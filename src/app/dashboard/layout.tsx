import { redirect } from "next/navigation";
import AppLayout from "@/app/app-layout";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1]
      : null;

  if (!token) {
    redirect("/login");
  }

  return <AppLayout>{children}</AppLayout>;
}
