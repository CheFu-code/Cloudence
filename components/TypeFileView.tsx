"use client";

import React from "react";
import { useFileView } from "@/hooks/use-file-view";
import Sort from "@/components/Sort";
import Card from "@/components/Card";
import { ViewToggle } from "@/components/ViewToggle";
import { cn, convertFileSize } from "@/lib/utils";
import FolderBrowser from "@/components/FolderBrowser";
import { useFileSelection } from "@/hooks/use-file-selection";
import { MAX_BULK_MOVE } from "@/lib/folder-view";

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
  const visibleFiles = sortedFiles.filter((file) => folderId ? file.folderId === folderId : !file.folderId);
  const selection = useFileSelection(visibleFiles, `${folderId || "root"}:${offset}`);
  return (
    <>
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section flex items-center justify-between mt-4">
          <p className="body-1">
            Total shown: <span className="h5">{convertFileSize(visibleFiles.reduce((size, file) => size + file.size, 0))}</span>
          </p>

          {/* 2. Group the Sort and ViewToggle together */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="sort-container flex items-center gap-2">
              <p className="body-1 hidden text-light-200 sm:block">Sort this page:</p>
              <Sort value={currentSort} onSortChange={handleSortChange} />
            </div>

            {/* 3. Insert the ViewToggle */}
            <ViewToggle view={currentView} onChange={setCurrentView} />
          </div>
        </div>
      </section>

      <FolderBrowser section={type} folders={folders} folderId={folderId} offset={offset} nextOffset={nextOffset} />
      {!folderId && <div className="mt-7 border-t border-slate-200 pt-5">
        <h2 className="text-base font-semibold text-slate-900">All files</h2>
        <p className="mt-1 text-sm text-slate-500">Files outside folders.</p>
      </div>}

      {visibleFiles.length > 0 && <form aria-label="Bulk file actions" className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border bg-white p-3" onSubmit={async (event) => { event.preventDefault(); await selection.move(); }}>
        <button type="button" disabled={selection.busy} onClick={selection.selectPage} className="rounded-lg border px-3 py-2 text-sm">Select up to {MAX_BULK_MOVE} on this page</button>
        <span className="text-sm" aria-live="polite">{selection.selected.length} / {MAX_BULK_MOVE} selected</span>
        {selection.selected.length > 0 && <>
          <select aria-label="Bulk move destination" disabled={selection.busy} value={selection.destination} onChange={(event) => selection.setDestination(event.target.value)} className="rounded-lg border px-3 py-2 text-sm">
            <option value="">Section root (Unfiled)</option>
            {folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
          </select>
          <button type="submit" disabled={selection.busy} className="rounded-lg bg-teal-700 px-3 py-2 text-sm text-white">{selection.busy ? "Moving…" : "Move selected"}</button>
          <button type="button" disabled={selection.busy} onClick={selection.clear} className="rounded-lg border px-3 py-2 text-sm">Clear selection</button>
        </>}
      </form>}

      {visibleFiles.length > 0 ? (
        <section
          className={cn(
            "mt-8 w-full",
            currentView === "grid"
              ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" // Grid classes
              : "flex flex-col gap-4", // List classes
          )}
        >
          {visibleFiles.map((file: CloudenceFile) => (
            <Card key={file.$id} file={file} view={currentView} folders={folders} selection={
              <input type="checkbox" aria-label={`Select ${file.name}`} checked={selection.selected.includes(file.$id)} disabled={selection.busy || (!selection.selected.includes(file.$id) && selection.selected.length >= MAX_BULK_MOVE)} onChange={() => selection.toggle(file.$id)} className="size-4 shrink-0 accent-teal-700" />
            } />
          ))}
        </section>
      ) : (
        <p className="empty-list">{folderId ? "This folder has no files on this page. Move files here or upload files from this section." : "No files outside folders on this page."}</p>
      )}
    </>
  );
}
