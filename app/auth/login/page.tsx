import { Suspense } from "react";
import LoginForm from "./components/LoginForm";
import Header from "@/components/Header";

export const metadata = {
  title: "Login",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <>
      <Suspense
        fallback={<div className="mx-auto max-w-md px-6 py-24">Loading...</div>}
      >
        <Header />
      </Suspense>
      <div className="mx-auto max-w-md px-6 py-24">
        <LoginForm />
      </div>
    </>
  );
}
