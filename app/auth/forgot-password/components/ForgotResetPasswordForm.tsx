"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const supabase = createClient();

type Step = "email" | "otp";

export default function ForgotResetPasswordForm() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [timer, setTimer] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  /* ---------------- SEND OTP ---------------- */
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    if (error) {
      setError(error.message);
    } else {
      setStep("otp");
      startTimer();
    }

    setLoading(false);
  }

  /* ---------------- VERIFY OTP + RESET ---------------- */
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Verify OTP
    const { error: otpError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (otpError) {
      setError("Invalid or expired OTP");
      setLoading(false);
      return;
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      router.replace("/auth/login");
      alert("Password updated successfully");
    }

    setLoading(false);
  }

  /* ---------------- RESEND OTP ---------------- */
  async function handleResendOtp() {
    if (timer > 0) return;

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    if (error) setError(error.message);
    else startTimer();

    setLoading(false);
  }

  /* ---------------- UI ---------------- */
  return (
    <>
      <h1 className="text-2xl font-semibold">Reset password</h1>

      {step === "email" && (
        <form onSubmit={handleSendOtp} className="mt-8 space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleResetPassword} className="mt-8 space-y-4">
          <Input
            placeholder="8-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={8}
            required
          />

          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Updating..." : "Change Password"}
          </Button>
        </form>
      )}
    </>
  );
}
