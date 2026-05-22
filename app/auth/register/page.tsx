import { Suspense } from "react";
import RegisterForm from "./components/RegisterForm";
import Header from "@/components/Header";

export const metadata = {
  title: "Register",
  description: "Create a new account to access our services.",
};
// loading page for register route

export default function RegisterPage() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense>
      <div className="mx-auto max-w-md px-6 py-24">
        <RegisterForm />
      </div>
    </>
  );
}
