"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { ArrowRight, Menu, X, LayoutDashboard } from "lucide-react";
import { getCurrentUser } from "@/lib/actions/user.actions";
import FileUploader from "../FileUploader";
import { navLinks } from "@/constants";

export interface LandingUser {
    $id?: string;
    accountId?: string;
    fullName?: string;
    avatar?: string;
    email?: string;
    uid?: string;
}

interface LandingNavbarProps {
    user?: LandingUser | null;
}

export function LandingNavbar({ user: initialUser }: LandingNavbarProps = {}) {
    const [user, setUser] = useState<LandingUser | null | undefined>(initialUser);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (initialUser !== undefined) {
            setUser(initialUser);
            return;
        }

        let isMounted = true;
        getCurrentUser()
            .then((data) => {
                if (isMounted) setUser(data);
            })
            .catch(() => {
                if (isMounted) setUser(null);
            });

        return () => {
            isMounted = false;
        };
    }, [initialUser]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isAuthenticated = Boolean(user);

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-200 ${isScrolled
                ? "bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                : "bg-transparent border-b border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Brand */}
                    <BrandLogo showBadge />

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Action CTAs */}
                    <div className="hidden sm:flex items-center gap-3.5">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-sm font-semibold text-slate-700 hover:text-teal-700 px-3.5 py-2 transition-colors flex items-center gap-1.5"
                                >
                                    <LayoutDashboard className="w-4 h-4 text-teal-600" />
                                    <span>Dashboard</span>
                                </Link>
                                <FileUploader ownerId={user?.$id as string} accountId={user?.accountId as string} />
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/sign-in"
                                    className="text-sm font-semibold text-slate-700 hover:text-teal-700 px-3.5 py-2 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/sign-up"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm shadow-teal-700/20 transition-all hover:translate-y-[-0.5px]"
                                >
                                    <span>Get Started</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center sm:hidden gap-2">
                        <Link
                            href={isAuthenticated ? "/dashboard" : "/sign-in"}
                            className="text-xs font-semibold text-slate-700 hover:text-teal-700 px-2.5 py-1.5 transition-colors"
                        >
                            {isAuthenticated ? "Dashboard" : "Sign In"}
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
                            aria-label="Toggle Navigation Menu"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg">
                    <div className="flex flex-col space-y-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-teal-700 rounded-md transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                        {isAuthenticated ? (
                            <>
                                {user?.fullName && (
                                    <div className="px-3 py-1 text-xs text-slate-500">
                                        Signed in as <span className="font-semibold text-slate-800">{user.fullName || user.email || "User"}</span>
                                    </div>
                                )}
                                <Link
                                    href="/dashboard"
                                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>Go to Workspace</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/sign-up"
                                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span>Get Started Free</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/sign-in"
                                    className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}