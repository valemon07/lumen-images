"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { authClient } from "../lib/auth-client";
import { redirect } from "next/navigation";
import { User } from "better-auth";

async function signOut() {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        redirect("/login"); // redirect to login page
      },
    },
  });
}

async function getUser() {
  const session = await authClient.getSession();
  return session?.data?.user;
}

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const [hasUser, setHasUser] = useState(false);
  let user: User | undefined;
  getUser().then((value) => {
    user = value;
    if (user) {
      setHasUser(true);
    }
  });
  return (
    <div>
      {hasUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">My Account</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <LogOutIcon />
                  Sign Out
                </DropdownMenuItem>
              </AlertDialogTrigger>

              <AlertDialogContent size="sm">
                <form
                  onSubmit={(event) => {
                    signOut().then(() => setOpen(false));
                    event.preventDefault();
                  }}
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign Out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to sign out?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" type="submit">
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
