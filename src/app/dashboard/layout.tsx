"use client";

import AppLayout from "@/app/app-layout";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
