import AppLayout from "@/app/app-layout";

export default function TimeTrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
