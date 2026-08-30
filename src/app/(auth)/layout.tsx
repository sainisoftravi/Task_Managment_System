import { redirect } from "next/navigation";
import { AuthProvider } from "@/contexts/auth-context";
import LoginPage from "../login/page";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
