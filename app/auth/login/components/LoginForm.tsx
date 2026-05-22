"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- AUTH STATE HANDLING ---------------- */
  useEffect(() => {
    let mounted = true;

    // Initial session check
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;

      if (data.session) {
        router.replace("/admin-dashboard");
      }
    });

    // Auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/admin-dashboard");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  /* ---------------- LOGIN HANDLER ---------------- */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  }

  /* ---------------- UI ---------------- */
  return (
    <>
      <h1 className="text-2xl font-semibold">Sign in to your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Welcome back. Please enter your credentials.
      </p>

      <form onSubmit={handleLogin} className="mt-8 space-y-4">
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-4 flex justify-between text-sm">
        <Link href="/auth/forgot-password" className="hover:underline">
          Forgot password?
        </Link>
        <Link href="/auth/register" className="hover:underline">
          Create account
        </Link>
      </div>
    </>
  );
}
