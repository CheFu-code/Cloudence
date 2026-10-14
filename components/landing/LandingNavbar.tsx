import { navLinks } from "@/constants";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { LandingMobileMenu } from "./LandingMobileMenu";
import { LandingUploadButton } from "./LandingUploadButton";
import type { LandingUser } from "@/types/landing";

export async function LandingNavbar({
  user: providedUser,
}: { user?: LandingUser | null } = {}) {
  const user =
    providedUser !== undefined ? providedUser : await getCurrentUser();
  return (
    <header className="relative sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <BrandLogo showBadge />
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="hidden sm:flex items-center gap-3.5">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold text-slate-700 px-3.5 py-2 flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <LandingUploadButton />
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-semibold text-slate-700 px-3.5 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
          <Link
            href={user ? "/dashboard" : "/sign-in"}
            className="sm:hidden mr-10 text-xs font-semibold text-slate-700"
          >
            {user ? "Dashboard" : "Sign In"}
          </Link>
        </div>
      </div>
      <LandingMobileMenu>
        <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
            >
              {link.name}
            </a>
          ))}
        </nav>
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
          {user?.fullName && (
            <p className="px-3 text-xs text-slate-500">
              Signed in as {user.fullName}
            </p>
          )}
          <Link
            href={user ? "/dashboard" : "/sign-up"}
            className="text-center py-2.5 text-sm text-white bg-teal-600 rounded-lg"
          >
            {user ? "Go to Workspace" : "Get Started Free"}
          </Link>
          {!user && (
            <Link
              href="/sign-in"
              className="text-center py-2 text-sm text-slate-700 bg-slate-100 rounded-lg"
            >
              Sign In
            </Link>
          )}
        </div>
      </LandingMobileMenu>
    </header>
  );
}
