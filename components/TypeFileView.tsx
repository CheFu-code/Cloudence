"use client";

import React, { useState, useMemo, useEffect } from "react";
import Sort from "@/components/Sort";
import Card from "@/components/Card";
import { ViewToggle, type ViewType } from "@/components/ViewToggle";
import { cn, convertFileSize } from "@/lib/utils";
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

    return (
        <>
            <section className="w-full">
                <h1 className="h1 capitalize">{type}</h1>

                <div className="total-size-section flex items-center justify-between mt-4">
                    <p className="body-1">
                        Total: <span className="h5">{convertFileSize(totalSize)}</span>
                    </p>

                    {/* 2. Group the Sort and ViewToggle together */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="sort-container flex items-center gap-2">
                            <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>
                            <Sort value={currentSort} onSortChange={handleSortChange} />
                        </div>

                        {/* 3. Insert the ViewToggle */}
                        <ViewToggle view={currentView} onChange={setCurrentView} />
                    </div>
                </div>
            </section>

            {sortedFiles.length > 0 ? (
                <section
                    className={cn(
                        "mt-8 w-full",
                        currentView === "grid"
                            ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" // Grid classes
                            : "flex flex-col gap-4" // List classes
                    )}
                >
                    {sortedFiles.map((file: CloudenceFile) => (
                        <Card key={file.$id} file={file} view={currentView} />
                    ))}
                </section>
            ) : (
                <p className="empty-list">No files uploaded</p>
            )}
        </>
    );
}
