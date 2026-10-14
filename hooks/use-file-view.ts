"use client";
import { useState, useMemo, useEffect } from "react";
import type { ViewType } from "@/components/ViewToggle";
import { sortTypes } from "@/constants";
import { sortFiles } from "@/lib/file-sort";
export function useFileView(files: CloudenceFile[], initialSort: string) {
  const [currentSort, setCurrentSort] = useState(
    initialSort || sortTypes[0].value,
  );
  const [currentView, setCurrentView] = useState<ViewType>("grid");

  useEffect(() => {
    if (initialSort) {
      setCurrentSort(initialSort);
    }
  }, [initialSort]);

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

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("sort", newSort);
      window.history.replaceState(null, "", url.toString());
    }
  };

  const sortedFiles = useMemo(() => {
    return sortFiles(files, currentSort);
  }, [files, currentSort]);

  return {
    currentSort,
    currentView,
    setCurrentView,
    handleSortChange,
    sortedFiles,
  };
}
