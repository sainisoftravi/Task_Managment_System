"use client";

import * as React from "react";

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({ defaultValue, value, onValueChange, className, children }: TabsProps) {
  return (
    <div className={className || ""}>
      {children}
    </div>
  );
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export function TabsList({ className, children }: TabsListProps) {
  return (
    <div className={`mb-4 flex ${className || ""}`}>
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function TabsTrigger({ value, className, children }: TabsTriggerProps) {
  const [selected, setSelected] = React.useState<string>(value);
  const isSelected = selected === value;

  return (
    <button
      onClick={() => setSelected(value)}
      className={`
        flex items-center justify-center gap-2 rounded-md
        border-b-2 px-4 py-2 text-sm font-medium transition-all
        ${isSelected
          ? "border-primary-600 text-primary-700"
          : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"}
        ${className || ""}
      `}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export function TabsContent({ value, children }: TabsContentProps) {
  return <div>{children}</div>;
}
