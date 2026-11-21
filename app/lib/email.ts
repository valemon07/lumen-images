import { Resend } from "resend";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY);
const FROM = env.EMAIL_FROM;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// resend.emails.send() resolves with { error } instead of throwing, so check it
// explicitly. better-auth catches and logs errors thrown from its email callbacks.
async function sendEmail(message: { to: string; subject: string; html: string }) {
  const { error } = await resend.emails.send({ from: FROM, ...message });
  if (error) {
    throw new Error(`Failed to send "${message.subject}" email: ${error.message}`);
  }
}

export async function sendVerificationEmail({
  user,
  url,
}: {
  user: { email: string };
  url: string;
}) {
  await sendEmail({
    to: user.email,
    subject: "Verify your email address",
    html: `<p>Click the link below to verify your email address:</p><p><a href="${url}">${url}</a></p>`,
  });
}

export async function sendResetPassword({
  user,
  url,
}: {
  user: { email: string };
  url: string;
}) {
  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    html: `<p>You requested to reset your password.</p><p>Click the link below to reset your password:</p><p><a href="${url}">${url}</a></p>`,
  });
}

export async function sendChangeEmailConfirmation({
  user,
  newEmail,
  url,
}: {
  user: { email: string };
  newEmail: string;
  url: string;
}) {
  await sendEmail({
    to: user.email,
    subject: `Confirm email change to ${newEmail}`,
    html: `<p>You requested to change your email to <strong>${escapeHtml(newEmail)}</strong>.</p><p>Click the link below to confirm this change:</p><p><a href="${url}">${url}</a></p>`,
  });
}

export async function sendDeleteAccountVerification({
  user,
  url,
}: {
  user: { email: string };
  url: string;
}) {
  await sendEmail({
    to: user.email,
    subject: "Confirm account deletion",
    html: `<p>You requested to delete your account.</p><p>Click the link below to confirm account deletion:</p><p><a href="${url}">${url}</a></p>`,
  });
}