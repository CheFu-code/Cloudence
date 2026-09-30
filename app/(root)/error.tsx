"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkspaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[400px] text-center">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-200">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-dark-200 font-poppins">
        Unable to load workspace files
      </h2>
      <p className="mt-2 text-sm text-light-100 max-w-md">
        We encountered a problem fetching your files or quota. Please retry or refresh your session.
      </p>
      <Button
        onClick={() => reset()}
        className="mt-6 primary-btn px-6 gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Reload Workspace</span>
      </Button>
    </div>
  );
}
