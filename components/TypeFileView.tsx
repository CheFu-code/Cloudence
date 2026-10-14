"use client";

import React from "react";
import { useFileView } from "@/hooks/use-file-view";
import Sort from "@/components/Sort";
import Card from "@/components/Card";
import { ViewToggle } from "@/components/ViewToggle";
import { cn, convertFileSize } from "@/lib/utils";
import FolderBrowser from "@/components/FolderBrowser";

interface TypeFileViewProps {
  type: string;
  files: CloudenceFile[];
  totalSize: number;
  initialSort?: string;
  folders?: CloudenceFolder[];
  folderId?: string;
  nextOffset?: number;
  offset?: number;
}

export default function TypeFileView({
  type,
  files,
  totalSize,
  initialSort = "$createdAt-desc",
  folders = [],
  folderId,
  nextOffset,
  offset = 0,
}: TypeFileViewProps) {
  const {
    currentSort,
    currentView,
    setCurrentView,
    handleSortChange,
    sortedFiles,
  } = useFileView(files, initialSort);
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

      <FolderBrowser section={type} folders={folders} folderId={folderId} offset={offset} nextOffset={nextOffset} />
      {!folderId && <h2 className="mt-6 text-sm font-medium text-slate-600">All files</h2>}

      {sortedFiles.length > 0 ? (
        <section
          className={cn(
            "mt-8 w-full",
            currentView === "grid"
              ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" // Grid classes
              : "flex flex-col gap-4", // List classes
          )}
        >
          {sortedFiles.map((file: CloudenceFile) => (
            <Card key={file.$id} file={file} view={currentView} folders={folders} />
          ))}
        </section>
      ) : (
        <p className="empty-list">{folderId ? "This folder has no files on this page. Move files here or upload files from this section." : "No files in this section."}</p>
      )}
    </>
  );
}
