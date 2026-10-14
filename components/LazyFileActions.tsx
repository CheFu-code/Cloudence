"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const FileActions = dynamic(() => import("./ActionDropdown"), {
  ssr: false,
  loading: () => (
    <button type="button" disabled aria-label="Loading file actions" className="size-[34px]">
      <Image src="/assets/icons/dots.svg" alt="" width={34} height={34} />
    </button>
  ),
});

export default function LazyFileActions({ file }: { file: CloudenceFile }) {
  const [activated, setActivated] = useState(false);
  if (activated) return <FileActions file={file} initialOpen />;
  return (
    <button
      type="button" aria-label={`Actions for ${file.name}`} aria-haspopup="menu" aria-expanded={false}
      className="size-[34px]" onClick={() => setActivated(true)}
    >
      <Image src="/assets/icons/dots.svg" alt="" width={34} height={34} />
    </button>
  );
}
