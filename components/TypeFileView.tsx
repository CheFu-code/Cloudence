"use client";

import React, { useState, useMemo, useEffect } from "react";
import Sort from "@/components/Sort";
import Card from "@/components/Card";
import { convertFileSize } from "@/lib/utils";
import { sortTypes } from "@/constants";

export function sortFiles(files: CloudenceFile[], sortType: string): CloudenceFile[] {
  if (!files || files.length <= 1) return files || [];

  return [...files].sort((a, b) => {
    switch (sortType) {
      case "$createdAt-asc":
        return new Date(a.$createdAt || 0).getTime() - new Date(b.$createdAt || 0).getTime();
      case "$createdAt-desc":
        return new Date(b.$createdAt || 0).getTime() - new Date(a.$createdAt || 0).getTime();
      case "name-asc":
        return (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base", numeric: true });
      case "name-desc":
        return (b.name || "").localeCompare(a.name || "", undefined, { sensitivity: "base", numeric: true });
      case "size-asc":
        return (a.size || 0) - (b.size || 0);
      case "size-desc":
        return (b.size || 0) - (a.size || 0);
      default:
        return new Date(b.$createdAt || 0).getTime() - new Date(a.$createdAt || 0).getTime();
    }
  });
}

interface TypeFileViewProps {
  type: string;
  files: CloudenceFile[];
  totalSize: number;
  initialSort?: string;
}

export default function TypeFileView({
  type,
  files,
  totalSize,
  initialSort = "$createdAt-desc",
}: TypeFileViewProps) {
  const [currentSort, setCurrentSort] = useState(initialSort || sortTypes[0].value);

  // Sync state if initialSort changes from the server
  useEffect(() => {
    if (initialSort) {
      setCurrentSort(initialSort);
    }
  }, [initialSort]);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const sortParam = params.get("sort");
      if (sortParam) {
        setCurrentSort(sortParam);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSortChange = (newSort: string) => {
    setCurrentSort(newSort);

    // Update URL shallowly without triggering an expensive server re-render
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("sort", newSort);
      window.history.replaceState(null, "", url.toString());
    }
  };

  const sortedFiles = useMemo(() => {
    return sortFiles(files, currentSort);
  }, [files, currentSort]);

  return (
    <>
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">{convertFileSize(totalSize)}</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>

            <Sort value={currentSort} onSortChange={handleSortChange} />
          </div>
        </div>
      </section>

      {/* Render the files */}
      {sortedFiles.length > 0 ? (
        <section className="file-list">
          {sortedFiles.map((file: CloudenceFile) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </>
  );
}
