"use client";
import { useState } from "react";
import { signOutUser } from "@/lib/client-api";
import { useToast } from "@/hooks/use-toast";
export function useLogout() {
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
        description:
          error instanceof Error ? error.message : "Please try again.",
        className: "error-toast",
      });
      setPending(false);
    }
  };

  return { pending, handleLogout };
}
