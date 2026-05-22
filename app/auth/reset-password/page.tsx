"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-2xl font-semibold">Reset your password</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose a new password for your account.
      </p>

      <form className="mt-8 space-y-4">
        <Input type="password" placeholder="New password" />
        <Input type="password" placeholder="Confirm new password" />
        <Button className="w-full">Update Password</Button>
      </form>
    </main>
  );
}
