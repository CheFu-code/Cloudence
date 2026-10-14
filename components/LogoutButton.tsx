"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/client-api";
import { useToast } from "@/hooks/use-toast";

export function LogoutButton({ mobile = false }: { mobile?: boolean }) {
  const [pending, setPending] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    if (pending) return;
    setPending(true);
    try {
      await signOutUser();
      window.location.assign("/sign-in");
    } catch (error) {
      toast({
        title: "Sign-out failed",
        description: error instanceof Error ? error.message : "Please try again.",
        className: "error-toast",
      });
      setPending(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className={mobile ? "mobile-sign-out-button" : "sign-out-button"}
      aria-label="Log out"
    >
      <Image
        src="/assets/icons/logout.svg"
        alt=""
        width={24}
        height={24}
        className={pending ? "animate-pulse" : undefined}
      />
      {mobile && <p>{pending ? "Logging out..." : "Logout"}</p>}
    </Button>
  );
}
