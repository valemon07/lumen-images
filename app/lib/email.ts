import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail({
  user,
  url,
}: {
  user: { email: string };
  url: string;
}) {
  await resend.emails.send({
    from: "Lumen Images <noreply@lumen-images.local>",
    to: user.email,
    subject: "Verify your email address",
    html: `<p>Click the link below to verify your email address:</p><p><a href="${url}">${url}</a></p>`,
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
  await resend.emails.send({
    from: "Lumen Images <noreply@lumen-images.local>",
    to: user.email,
    subject: `Confirm email change to ${newEmail}`,
    html: `<p>You requested to change your email to <strong>${newEmail}</strong>.</p><p>Click the link below to confirm this change:</p><p><a href="${url}">${url}</a></p>`,
  });
}

export async function sendDeleteAccountVerification({
  user,
  url,
}: {
  user: { email: string };
  url: string;
}) {
  await resend.emails.send({
    from: "Lumen Images <noreply@lumen-images.local>",
    to: user.email,
    subject: "Confirm account deletion",
    html: `<p>You requested to delete your account.</p><p>Click the link below to confirm account deletion:</p><p><a href="${url}">${url}</a></p>`,
  });
}