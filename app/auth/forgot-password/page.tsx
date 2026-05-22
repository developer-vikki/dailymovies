import ForgotResetPasswordForm from "./components/ForgotResetPasswordForm";

export const metadata = {
  title: "Reset Password",
  description: "Reset your password using OTP",
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <ForgotResetPasswordForm />
    </div>
  );
}
