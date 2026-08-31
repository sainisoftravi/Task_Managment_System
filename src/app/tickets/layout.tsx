import AppLayout from "@/app/app-layout";

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
