"use client";

import { useLinkStatus } from "next/link";

export function NavLinkPending() {
  const { pending } = useLinkStatus();

  if (!pending) return null;

  return (
    <span
      aria-label="Loading"
      className="nav-link-pending"
    />
  );
}
