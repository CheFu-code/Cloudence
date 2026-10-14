"use client";

import Image from "next/image";
import { useLogout } from "@/hooks/use-logout";
import { Button } from "@/components/ui/button";

export function LogoutButton({ mobile = false }: { mobile?: boolean }) {
  const { pending, handleLogout } = useLogout();
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
