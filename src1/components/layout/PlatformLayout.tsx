import { ReactNode } from "react";
import { PlatformSidebar } from "./PlatformSidebar";
import { PlatformTopBar } from "./PlatformTopBar";

interface PlatformLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function PlatformLayout({ children, title, subtitle }: PlatformLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-[#0b1120]">
      <PlatformSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PlatformTopBar title={title} subtitle={subtitle} />
        <main className="flex-1 p-6 overflow-auto text-slate-200">{children}</main>
      </div>
    </div>
  );
}
