"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/app/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function NameForm({
  onSubmit,
  loading,
}: {
  onSubmit: (name: string) => void;
  loading: boolean;
}) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading || !name.trim()}>
        {loading ? "Saving..." : "Save name"}
      </Button>
    </form>
  );
}

function EmailForm({
  onSubmit,
  loading,
}: {
  onSubmit: (email: string) => void;
  loading: boolean;
}) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) onSubmit(email.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">New email address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="new@email.com"
          disabled={loading}
          autoComplete="email"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        A confirmation will be sent to your current email, then a verification
        link to the new address.
      </p>
      <Button type="submit" disabled={loading || !email.trim()}>
        {loading ? "Sending..." : "Change email"}
      </Button>
    </form>
  );
}

function PasswordForm({
  onSubmit,
  loading,
}: {
  onSubmit: (current: string, newPass: string) => void;
  loading: boolean;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    onSubmit(currentPassword, newPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={loading}
          autoComplete="current-password"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
          autoComplete="new-password"
          minLength={8}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          autoComplete="new-password"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Must be at least 8 characters. Other sessions will be logged out.
      </p>
      <Button
        type="submit"
        disabled={
          loading || !currentPassword || !newPassword || !confirmPassword
        }
      >
        {loading ? "Changing..." : "Change password"}
      </Button>
    </form>
  );
}

function DeleteAccountButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={loading}>
          {loading ? "Deleting..." : "Delete account"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. You will receive an email to confirm
            deletion. All your photos, albums, and data will be permanently
            removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onClick}
            disabled={loading}
          >
            Delete account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function SettingsClient() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleNameUpdate = async (name: string) => {
    setLoading("name");
    const { error } = await authClient.updateUser({ name });
    if (error) toast.error(error.message || "Failed to update name");
    else toast.success("Name updated");
    setLoading(null);
  };

  const handleEmailChange = async (newEmail: string) => {
    setLoading("email");
    const { error } = await authClient.changeEmail({
      newEmail,
      callbackURL: "/home/prefs",
    });
    if (error) toast.error(error.message || "Failed to change email");
    else toast.success("Confirmation sent to your current email");
    setLoading(null);
  };

  const handlePasswordChange = async (current: string, newPass: string) => {
    setLoading("password");
    const { error } = await authClient.changePassword({
      currentPassword: current,
      newPassword: newPass,
      revokeOtherSessions: true,
    });
    if (error) toast.error(error.message || "Failed to change password");
    else toast.success("Password changed");
    setLoading(null);
  };

  const handleDeleteAccount = async () => {
    setLoading("delete");
    await authClient.deleteUser({ callbackURL: "/login" });
  };

  return (
    <div className="max-w-2xl space-y-8">
      <section className="border-t border-border pt-8 first:border-t-0 first:pt-0">
        <h2 className="mb-4 text-xl font-bold tracking-tight">Profile</h2>
        <NameForm onSubmit={handleNameUpdate} loading={loading === "name"} />
      </section>

      <section className="border-t border-border pt-8 first:border-t-0 first:pt-0">
        <h2 className="mb-4 text-xl font-bold tracking-tight">Email</h2>
        <EmailForm onSubmit={handleEmailChange} loading={loading === "email"} />
      </section>

      <section className="border-t border-border pt-8 first:border-t-0 first:pt-0">
        <h2 className="mb-4 text-xl font-bold tracking-tight">Password</h2>
        <PasswordForm
          onSubmit={handlePasswordChange}
          loading={loading === "password"}
        />
      </section>

      <section className="border border-destructive/40 p-6">
        <h2 className="mb-4 text-xl font-bold tracking-tight text-destructive">
          Danger zone
        </h2>
        <DeleteAccountButton
          onClick={handleDeleteAccount}
          loading={loading === "delete"}
        />
      </section>
    </div>
  );
}
