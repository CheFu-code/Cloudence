"use client";

import Image from "next/image";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function LogoutButton({ mobile = false }: { mobile?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
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
