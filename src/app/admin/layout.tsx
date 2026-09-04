import { getSession, isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Guard: Must be authenticated and have an admin role
  if (!session || !isAdmin(session.role)) {
    redirect("/admin-login");
  }

  return <AdminLayoutClient session={session}>{children}</AdminLayoutClient>;
}
