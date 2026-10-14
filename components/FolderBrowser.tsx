"use client";

import Link from "next/link";
import { Folder, FolderPlus, Pencil, Trash2 } from "lucide-react";
import { useFolders } from "@/hooks/use-folders";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { folderHref, visibleFolders } from "@/lib/folder-view";
import dynamic from "next/dynamic";

const FolderEditor = dynamic(() => import("./FolderEditor"), { ssr: false });

interface Props {
  section: string;
  folders: CloudenceFolder[];
  folderId?: string;
  offset: number;
  nextOffset?: number;
}

export default function FolderBrowser({ section, folders, folderId, offset, nextOffset }: Props) {
  const activeFolder = folders.find((folder) => folder.id === folderId);
  const editor = useFolders(section, folderId);
  const query = useSearchParams();
  const [folderQuery, setFolderQuery] = useState("");
  const [folderOrder, setFolderOrder] = useState("name-asc");
  const displayedFolders = useMemo(() => visibleFolders(folders, folderQuery, folderOrder), [folders, folderQuery, folderOrder]);
  const root = folderHref(section, query.toString());
  const location = (id: string, page = 0) => folderHref(section, query.toString(), id, page);
  const folderActions = (folder: CloudenceFolder) => (
    <div className="flex shrink-0 items-center gap-1">
      <button type="button" disabled={editor.busy} onClick={() => editor.begin(folder)} aria-label={`Rename ${folder.name}`} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-teal-700">
        <Pencil className="size-4" aria-hidden="true" />
      </button>
      <button type="button" disabled={editor.busy} onClick={() => editor.begin(folder, true)} aria-label={`Delete ${folder.name}`} className="rounded-md p-2 text-slate-500 hover:bg-red/10 hover:text-red">
        <Trash2 className="size-4" aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <section className="mt-6 space-y-4" aria-label="Folders">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Folder breadcrumb" className="flex min-w-0 items-center gap-2 text-sm">
          <Link href={root} prefetch={false} className="capitalize text-teal-700 hover:underline">{section}</Link>
          {activeFolder && <><span aria-hidden="true">/</span><span aria-current="page" className="truncate font-medium">{activeFolder.name}</span></>}
        </nav>
        <div className="flex items-center gap-2">
          {activeFolder && folderActions(activeFolder)}
          {!folderId && <button type="button" disabled={editor.busy} onClick={() => editor.begin()} className="flex items-center gap-2 rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50">
            <FolderPlus className="size-4" aria-hidden="true" />New folder
          </button>}
        </div>
      </div>

      {!folderId && (
        <div className="flex flex-wrap items-center gap-3">
          <input aria-label="Search folders" placeholder="Search folders…" value={folderQuery} onChange={(event) => setFolderQuery(event.target.value)} className="min-w-0 rounded-lg border px-3 py-2 text-sm" />
          <select aria-label="Sort folders" value={folderOrder} onChange={(event) => setFolderOrder(event.target.value)} className="rounded-lg border px-3 py-2 text-sm">
            <option value="name-asc">Folder name A–Z</option><option value="name-desc">Folder name Z–A</option><option value="newest">Newest folders</option>
          </select>
          <button type="button" disabled={editor.busy} onClick={editor.cleanup} className="rounded-lg border px-3 py-2 text-sm" title="Check up to 100 placements for deleted or inaccessible files">
            {editor.cleanupRemaining ? "Continue cleanup" : "Clean up folders"}
          </button>
        </div>
      )}

      {editor.editing && <FolderEditor editor={editor} section={section} />}

      {!folderId && folders.length > 0 && <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {displayedFolders.map((folder) => <div key={folder.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:border-teal-200 hover:shadow-sm">
          <Link href={location(folder.id)} prefetch={false} className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-sm hover:text-teal-700" aria-label={`Open folder ${folder.name}`}>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Folder className="size-5" aria-hidden="true" /></span>
            <span className="min-w-0"><span className="block truncate font-semibold text-slate-800">{folder.name}</span><span className="mt-1 block text-xs text-slate-500">Folder</span></span>
          </Link>
          {folderActions(folder)}
        </div>)}
      </div>}
      {!folderId && folderQuery.trim() && displayedFolders.length === 0 && <p className="text-sm text-slate-500">No matching folders.</p>}

      {folderId && (offset > 0 || nextOffset !== undefined) && <nav aria-label="Folder pages" className="flex items-center justify-between gap-3 text-sm text-teal-700">
        {offset > 0 ? <Link href={location(folderId, Math.max(0, offset - 100))} prefetch={false}>Previous files</Link> : <span />}
        {nextOffset !== undefined && <Link href={location(folderId, nextOffset)} prefetch={false}>More files</Link>}
      </nav>}
    </section>
  );
}
