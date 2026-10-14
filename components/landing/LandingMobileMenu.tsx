"use client";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";

export function LandingMobileMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="absolute right-4 top-5 p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        aria-label="Toggle navigation"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {open && (
        <div
          id="mobile-nav-drawer"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) setOpen(false);
          }}
          className="border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg"
        >
          {children}
        </div>
      )}
    </div>
  );
}
