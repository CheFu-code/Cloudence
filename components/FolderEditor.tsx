"use client";

import { Folder, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { useFolders } from "@/hooks/use-folders";

export default function FolderEditor({ editor, section }: { editor: ReturnType<typeof useFolders>; section: string }) {
  const removing = Boolean(editor.editing?.remove);
  const renaming = Boolean(editor.editing?.folder);
  const title = removing ? "Delete folder" : renaming ? "Rename folder" : "Create a folder";
  return (
    <Dialog open onOpenChange={(open) => { if (!open) editor.cancel(); }}>
      <DialogContent className="max-w-md gap-0 overflow-hidden rounded-2xl border-slate-200 p-0" onEscapeKeyDown={(event) => { if (editor.busy) event.preventDefault(); }} onPointerDownOutside={(event) => { if (editor.busy) event.preventDefault(); }}>
        <form onSubmit={async (event) => { event.preventDefault(); await editor.submit(); }}>
          <div className="p-6">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Folder className="size-6" aria-hidden="true" /></div>
            <DialogHeader className="text-left">
              <DialogTitle className="text-xl font-semibold text-slate-900">{title}</DialogTitle>
              <DialogDescription className="mt-1 text-sm text-slate-500">
                {removing ? "Your files will stay safe and return to the section’s file list." : <>Keep your <span className="lowercase">{section}</span> organized with a clear folder name.</>}
              </DialogDescription>
            </DialogHeader>
            {removing ? <p className="mt-5 rounded-lg bg-slate-50 p-3 text-sm font-medium text-slate-700">{editor.editing?.folder?.name}</p> : (
              <div className="mt-6">
                <label htmlFor="folder-name" className="text-sm font-medium text-slate-700">Folder name</label>
                <Input id="folder-name" required maxLength={80} value={editor.name} disabled={editor.busy} onChange={(event) => editor.setName(event.target.value)} placeholder="e.g. Invoices" aria-invalid={Boolean(editor.error)} aria-describedby={editor.error ? "folder-error" : "folder-name-help"} className="mt-2 h-11 border-slate-300 bg-white focus-visible:ring-teal-500" />
                <div id="folder-name-help" className="mt-2 flex justify-between gap-3 text-xs text-slate-500"><span>Choose a name you can find easily.</span><span>{editor.name.length}/80</span></div>
              </div>
            )}
            {editor.error && <p id="folder-error" role="alert" className="mt-3 text-sm text-red">{editor.error}</p>}
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
            <Button type="button" variant="outline" disabled={editor.busy} onClick={editor.cancel}>Cancel</Button>
            <Button type="submit" disabled={editor.busy || (!removing && !editor.name.trim())} className={removing ? "bg-red text-white hover:bg-red/90" : "bg-teal-700 text-white hover:bg-teal-800"}>
              {editor.busy && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />}
              {editor.busy ? "Saving…" : removing ? "Delete folder" : renaming ? "Save changes" : "Create folder"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
