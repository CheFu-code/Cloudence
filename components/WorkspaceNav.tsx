"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navItems } from "@/constants";
import { cn } from "@/lib/utils";
import { NavLinkPending } from "./NavLinkPending";

export function WorkspaceNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  return (
    <nav
      className={mobile ? "mobile-nav" : "sidebar-nav"}
      aria-label="Workspace"
    >
      <ul className={mobile ? "mobile-nav-list" : "flex flex-1 flex-col gap-6"}>
        {navItems.map(({ url, name, icon }) => (
          <li key={url}>
            <Link
              href={url}
              aria-current={pathname === url ? "page" : undefined}
              className={cn(
                mobile ? "mobile-nav-item" : "sidebar-nav-item",
                pathname === url && "shad-active",
              )}
            >
              <Image
                src={icon}
                alt=""
                width={24}
                height={24}
                className={cn(
                  "nav-icon",
                  pathname === url && "nav-icon-active",
                )}
              />
              <span className={mobile ? undefined : "hidden lg:block"}>
                {name}
              </span>
              <NavLinkPending />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
