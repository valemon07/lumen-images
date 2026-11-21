// Run with: node --experimental-vm-modules tests/upload-photo.test.mjs
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { SourceTextModule, SyntheticModule } from "node:vm";
import ts from "typescript";
import { z } from "zod";

const source = await readFile(new URL("../app/api/upload/route.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const png = Buffer.from("89504e470d0a1a0a00000000", "hex");

async function setup({ authenticated = true, failure, cleanupFails = false } = {}) {
  const calls = [];
  class PutObjectCommand { constructor(input) { this.input = input; } }
  class DeleteObjectCommand { constructor(input) { this.input = input; } }
  const mocks = {
    "@aws-sdk/client-s3": {
      PutObjectCommand, DeleteObjectCommand,
      S3Client: class {
        async send(command) {
          const kind = command instanceof PutObjectCommand ? "put" : "delete";
          calls.push({ kind, ...command.input });
          if (failure === kind || (kind === "delete" && cleanupFails)) throw new Error("Storage failure");
        }
      },
    },
    uuid: { v4: () => "new-key" },
    zod: { z },
    "@/app/lib/auth": { auth: { api: { getSession: async () => authenticated ? { user: { id: "owner" } } : null } } },
    "@/app/lib/actions": { getAlbum: async (id) => {
      calls.push({ kind: "album", id });
      return id === "owned" ? { album_id: id, user_id: "owner" } : null;
    } },
    "@/app/lib/db": { default: async (strings, ...values) => {
      calls.push({ kind: "insert", values });
      if (failure === "database") throw new Error("Database failure");
    } },
    "@/lib/env": { env: { AWS_REGION: "test", AWS_BUCKET_NAME: "test-bucket" } },
  };
  const route = new SourceTextModule(outputText);
  await route.link((specifier) => {
    const exports = mocks[specifier];
    assert.ok(exports, `Unexpected import: ${specifier}`);
    return new SyntheticModule(Object.keys(exports), function () {
      for (const [name, value] of Object.entries(exports)) this.setExport(name, value);
    });
  });
  await route.evaluate();
  return { POST: route.namespace.POST, calls };
}

function request(file = new File([png], "photo.png", { type: "image/png" }), fields = {}) {
  const data = new FormData();
  if (file !== null) data.set("file", file);
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return new Request("http://localhost/api/upload", { method: "POST", body: data });
}

test("rejects anonymous requests before parsing the body", async () => {
  const { POST, calls } = await setup({ authenticated: false });
  const response = await POST({ headers: new Headers(), formData() { throw new Error("Must not parse"); } });
  assert.equal(response.status, 401);
  assert.deepEqual(calls, []);
});

for (const [name, file, fields, status] of [
  ["missing file", null, {}, 400],
  ["string file", "not a file", {}, 400],
  ["empty file", new File([], "empty.png", { type: "image/png" }), {}, 400],
  ["unsupported format", new File(["GIF89a"], "photo.gif", { type: "image/gif" }), {}, 400],
  ["mismatched signature", new File([png], "photo.jpg", { type: "image/jpeg" }), {}, 400],
  ["truncated signature", new File([png.subarray(0, 4)], "photo.png", { type: "image/png" }), {}, 400],
  ["invalid timestamp", undefined, { lastModified: "invalid" }, 400],
  ["invalid dimension", undefined, { width: "0" }, 400],
  ["fractional dimension", undefined, { height: "1.5" }, 400],
  ["missing album", undefined, { albumId: "missing" }, 404],
  ["unowned album", undefined, { albumId: "other-user" }, 404],
]) {
  test(`rejects ${name} before storage or insertion`, async () => {
    const { POST, calls } = await setup();
    assert.equal((await POST(request(file, fields))).status, status);
    assert.ok(calls.every((call) => call.kind === "album"));
  });
}

test("rejects malformed multipart data", async () => {
  const { POST, calls } = await setup();
  assert.equal((await POST(new Request("http://localhost", { method: "POST", body: "bad" }))).status, 400);
  assert.deepEqual(calls, []);
});

for (const extra of [0, 1]) {
  test(`${extra ? "rejects above" : "accepts exactly"} the 20 MiB limit using actual size`, async () => {
    const { POST, calls } = await setup();
    const bytes = Buffer.alloc(20 * 1024 * 1024 + extra);
    png.copy(bytes);
    const file = new File([bytes], "large.png", { type: "image/png" });
    const response = await POST(request(file, { fileSize: "1" }));
    assert.equal(response.status, extra ? 413 : 200);
    if (extra) assert.deepEqual(calls, []);
  });
}

for (const [type, bytes, albumId] of [
  ["image/png", png, "owned"],
  ["image/jpeg", Buffer.from([0xff, 0xd8, 0xff, 0xe0]), undefined],
  ["image/webp", Buffer.from("RIFF0000WEBP"), undefined],
]) {
  test(`uploads ${type} using authenticated ownership and actual metadata`, async () => {
    const { POST, calls } = await setup();
    const fields = { filename: "forged", fileType: "text/html", fileSize: "1", lastModified: "1700000000000", width: "100", height: "50" };
    if (albumId) fields.albumId = albumId;
    const response = await POST(request(new File([bytes], "original", { type }), fields));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true, key: "new-key" });
    const put = calls.find((call) => call.kind === "put");
    assert.equal(put.ContentType, type);
    assert.deepEqual(Buffer.from(put.Body), bytes);
    assert.deepEqual(calls.at(-1), {
      kind: "insert", values: ["original", "owner", bytes.length, type, new Date(1700000000000), "new-key", 100, 50, albumId ?? null],
    });
  });
}

for (const [failure, cleanupFails, expected] of [
  ["put", false, ["put"]],
  ["database", false, ["put", "insert", "delete"]],
  ["database", true, ["put", "insert", "delete"]],
]) {
  test(`handles ${failure} failure with cleanup failure=${cleanupFails}`, async (t) => {
    t.mock.method(console, "error", () => {});
    const { POST, calls } = await setup({ failure, cleanupFails });
    const response = await POST(request());
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error: "Upload failed" });
    assert.deepEqual(calls.map((call) => call.kind), expected);
    if (failure === "database") assert.deepEqual(calls.at(-1), { kind: "delete", Bucket: "test-bucket", Key: "new-key" });
    assert.equal(console.error.mock.calls.length, cleanupFails ? 2 : 1);
  });
}
