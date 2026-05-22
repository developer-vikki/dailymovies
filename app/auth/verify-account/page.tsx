"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerifyAccountPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold">Verify your email</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        We’ve sent a verification link to your email address. Please verify your
        account to continue.
      </p>

      <Button className="mt-6 w-full">Resend Verification Email</Button>

      <p className="mt-4 text-sm">
        <Link href="/auth/login" className="hover:underline">
          Back to login
        </Link>
      </p>
    </main>
  );
}
