"use client";
import dynamic from "next/dynamic";

// Load the real uploader only when the signed-in landing-page control is mounted.
const FileUploader = dynamic(() => import("../FileUploader"), {
  ssr: false,
  loading: () => <div className="h-[44px] w-[110px] rounded-full bg-slate-100 animate-pulse" aria-label="Loading upload control" />,
});

export function LandingUploadButton() {
  return <FileUploader />;
}
