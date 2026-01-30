"use client";

import { ReactNode } from "react";

interface ScreenLayoutProps {
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  tabIndex?: number;
}

export default function ScreenLayout({
  header,
  children,
  footer,
  onKeyDown,
  tabIndex,
}: ScreenLayoutProps) {
  return (
    <div
      className="flex min-h-screen flex-col bg-[#FFF5F7] outline-none"
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
    >
      <header className="shrink-0 border-b border-selfit-pink-light/40 bg-white/80 px-4 py-3 backdrop-blur">
        {header}
      </header>
      <main className="flex-1 overflow-auto px-4 py-6">{children}</main>
      {footer && (
        <footer className="shrink-0 border-t border-selfit-pink-light/40 bg-white/80 px-4 py-4 backdrop-blur">
          {footer}
        </footer>
      )}
    </div>
  );
}
