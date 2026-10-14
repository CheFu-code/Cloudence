"use client";
import { useState, type ReactNode } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileMenuShell({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger aria-label="Open navigation">
        <Image src="/assets/icons/menu.svg" alt="" width={30} height={30} />
      </SheetTrigger>
      <SheetContent className="shad-sheet h-screen px-3">
        <SheetTitle>{title}</SheetTitle>
        <div
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
