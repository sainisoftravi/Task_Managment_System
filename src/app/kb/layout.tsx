import AppLayout from "@/app/app-layout";

export default function KBLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
