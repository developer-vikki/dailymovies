"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ---------------- SUPABASE CLIENT ---------------- */
const supabase = createClient();

type Step = "form" | "otp";

/* ---------------- PASSWORD STRENGTH ---------------- */
function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export default function RegisterForm() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [timer, setTimer] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const strength = getPasswordStrength(password);

  /* ---------------- TIMER ---------------- */
  const startTimer = () => {
    setTimer(60);
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /* ---------------- STEP 1: REGISTER ---------------- */
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!acceptedTerms) {
      setError("You must accept the terms and conditions.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (strength < 3) {
      setError("Password is too weak.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setStep("otp");
      startTimer();
    }

    setLoading(false);
  }

  /* ---------------- STEP 2: VERIFY OTP ---------------- */
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      setError("Invalid or expired verification code.");
    } else {
      router.replace("/admin-dashboard");
      alert("Email verified! You are now logged in.");
    }

    setLoading(false);
  }

  /* ---------------- RESEND OTP ---------------- */
  async function handleResendOtp() {
    if (timer > 0) return;

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      setError(error.message);
    } else {
      startTimer();
    }

    setLoading(false);
  }

  /* ---------------- AUTO REDIRECT IF LOGGED IN ---------------- */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/admin-dashboard");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.replace("/admin-dashboard");
    });

    return () => subscription.unsubscribe();
  }, [router]);

  /* ---------------- UI ---------------- */
  return (
    <>
      <h1 className="text-2xl font-semibold">Create your account</h1>

      {step === "form" && (
        <form onSubmit={handleRegister} className="mt-8 space-y-4">
          <Input
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

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

          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <label className="flex gap-2 text-sm">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <span>I agree to the Terms & Conditions</span>
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </Button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOtp} className="mt-8 space-y-4">
          <Input
            placeholder="Enter 8-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={8}
            required
          />

          <p className="text-sm text-muted-foreground">
            {timer > 0 ? `Resend in ${timer}s` : "Didn’t receive the code?"}
          </p>

          <Button
            type="button"
            variant="link"
            disabled={timer > 0}
            onClick={handleResendOtp}
          >
            Resend OTP
          </Button>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button className="w-full" disabled={loading}>
            Verify Email
          </Button>
        </form>
      )}

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link href="/auth/login" className="underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
