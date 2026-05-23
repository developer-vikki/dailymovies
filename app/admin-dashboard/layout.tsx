import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import AdminSidebar from "./components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // NOT LOGGED IN
  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error } = await supabase
    .from("users_accounts")
    .select("*")
    .eq("id", user.id)
    .single();

  // console.log("USER:", user);
  // console.log("PROFILE:", profile);
  // console.log("user_roles:", profile?.user_roles);
  // console.log("ERROR:", error);

  // NOT ADMIN
  if (
    !profile ||
    (profile.user_roles !== "admin" && profile.user_roles !== "staff")
  ) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
