"use client";

import Link from "next/link";
import { Folder, FolderPlus, Pencil, Trash2 } from "lucide-react";
import { useFolders } from "@/hooks/use-folders";

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
  const root = `/${section}`;
  const location = (id: string, page = 0) => `${root}?folder=${encodeURIComponent(id)}${page ? `&offset=${page}` : ""}`;
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

      {editor.editing && (
        <form className="space-y-3 rounded-xl border border-slate-200 bg-white p-4" onSubmit={async (event) => { event.preventDefault(); await editor.submit(); }}>
          {editor.editing.remove ? (
            <p className="text-sm">Delete “{editor.editing.folder?.name}”? Its files will return to this section’s root. No files will be deleted.</p>
          ) : (
            <label className="flex flex-col gap-2 text-sm font-medium">
              {editor.editing.folder ? "Rename folder" : "Folder name"}
              <input autoFocus required maxLength={80} value={editor.name} disabled={editor.busy} onChange={(event) => editor.setName(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 font-normal" placeholder="e.g. Invoices" />
            </label>
          )}
          {editor.error && <p role="alert" className="text-sm text-red">{editor.error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={editor.busy || (!editor.editing.remove && !editor.name.trim())} className="rounded-lg bg-teal-700 px-4 py-2 text-sm text-white disabled:opacity-50">
              {editor.busy ? "Saving…" : editor.editing.remove ? "Delete folder" : "Save"}
            </button>
            <button type="button" disabled={editor.busy} onClick={editor.cancel} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
          </div>
        </form>
      )}

      {!folderId && folders.length > 0 && <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {folders.map((folder) => <div key={folder.id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3">
          <Link href={location(folder.id)} prefetch={false} className="flex min-w-0 flex-1 items-center gap-3 rounded-md py-2 text-sm font-medium hover:text-teal-700">
            <Folder className="size-6 shrink-0 text-teal-600" aria-hidden="true" /><span className="truncate">{folder.name}</span>
          </Link>
          {folderActions(folder)}
        </div>)}
      </div>}

      {folderId && (offset > 0 || nextOffset !== undefined) && <nav aria-label="Folder pages" className="flex items-center justify-between gap-3 text-sm text-teal-700">
        {offset > 0 ? <Link href={location(folderId, Math.max(0, offset - 100))} prefetch={false}>Previous files</Link> : <span />}
        {nextOffset !== undefined && <Link href={location(folderId, nextOffset)} prefetch={false}>More files</Link>}
      </nav>}
    </section>
  );
}
