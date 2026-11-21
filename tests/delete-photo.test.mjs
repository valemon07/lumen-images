// Run with: node --experimental-vm-modules --test tests/delete-photo.test.mjs
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { SourceTextModule, SyntheticModule } from "node:vm";
import ts from "typescript";

const source = await readFile(new URL("../app/lib/actions.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});

async function setup({ user = "owner", storedKey = "stored-key", failure } = {}) {
  const calls = [];
  const sql = async (strings, ...values) => {
    const query = strings.join("?").trim().split(/\s+/).join(" ");
    calls.push({ query, values });
    if (failure === "database" && query.startsWith("DELETE")) throw new Error("DB failed");
    if (query.startsWith("SELECT")) {
      return values[0] === "photo-key" && values[1] === "owner" && storedKey
        ? [{ s3_key: storedKey }]
        : [];
    }
    return [];
  };
  class Command {
    constructor(input) { this.input = input; }
  }
  const mocks = {
    "./db": { default: sql },
    "./auth": { auth: { api: { getSession: async () => user ? { user: { id: user } } : null } } },
    "next/headers": { headers: async () => new Headers() },
    "@aws-sdk/client-s3": {
      S3Client: class {
        async send(command) {
          calls.push(command.input);
          if (failure === "s3") throw new Error("S3 failed");
        }
      },
      GetObjectCommand: Command,
      DeleteObjectCommand: Command,
    },
    "@aws-sdk/s3-request-presigner": { getSignedUrl: () => {} },
    "next/cache": { unstable_noStore: () => {} },
    "@/lib/env": { env: { AWS_REGION: "test", AWS_BUCKET_NAME: "test-bucket" } },
  };
  const actions = new SourceTextModule(outputText);
  await actions.link((specifier) => {
    const exports = mocks[specifier];
    assert.ok(exports, `Unexpected import: ${specifier}`);
    return new SyntheticModule(Object.keys(exports), function () {
      for (const [name, value] of Object.entries(exports)) this.setExport(name, value);
    });
  });
  await actions.evaluate();
  return { deletePhoto: actions.namespace.deletePhoto, calls };
}

test("invalid inputs never reach storage or the database", async () => {
  const { deletePhoto, calls } = await setup();
  for (const photo of [null, undefined, {}, { s3_key: 123 }, { s3_key: "  " }]) {
    assert.equal(await deletePhoto(photo), false);
  }
  assert.deepEqual(calls, []);
});

for (const [name, options, key] of [
  ["anonymous", { user: null }, "photo-key"],
  ["another user's photo with forged ownership", { user: "attacker" }, "photo-key"],
  ["missing photo", {}, "missing-key"],
]) {
  test(`rejects ${name} without deleting anything`, async () => {
    const { deletePhoto, calls } = await setup(options);
    assert.equal(await deletePhoto({ s3_key: key, user_id: "owner" }), false);
    assert.ok(calls.every((call) => call.query?.startsWith("SELECT")));
  });
}

test("deletes the stored key before the owner-scoped database row", async () => {
  const { deletePhoto, calls } = await setup();
  assert.equal(await deletePhoto({ s3_key: "photo-key", user_id: "forged" }), true);
  assert.deepEqual(calls, [
    { query: "SELECT s3_key FROM photos WHERE s3_key=? AND user_id=?", values: ["photo-key", "owner"] },
    { Bucket: "test-bucket", Key: "stored-key" },
    { query: "DELETE FROM photos WHERE s3_key=? AND user_id=?", values: ["stored-key", "owner"] },
  ]);
});

for (const failure of ["s3", "database"]) {
  test(`reports ${failure} failure${failure === "s3" ? " without deleting metadata" : ""}`, async (t) => {
    t.mock.method(console, "error", () => {});
    const { deletePhoto, calls } = await setup({ failure });
    assert.equal(await deletePhoto({ s3_key: "photo-key" }), false);
    assert.equal(calls.length, failure === "s3" ? 2 : 3);
  });
}
