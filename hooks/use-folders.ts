"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveFolder, cleanupFolderPlacements } from "@/lib/actions/file.actions";
import { folderHref } from "@/lib/folder-view";
import { useToast } from "@/hooks/use-toast";

export function useFolders(section: string, currentFolderId?: string) {
  const [editing, setEditing] = useState<{ folder?: CloudenceFolder; remove?: boolean } | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const query = useSearchParams();
  const [cleanupRemaining, setCleanupRemaining] = useState<number | null>(null);
  const { toast } = useToast();

  const begin = (folder?: CloudenceFolder, remove = false) => {
    setEditing({ folder, remove });
    setName(folder?.name || "");
    setError("");
  };
  const cancel = () => { if (!busy) { setEditing(null); setError(""); } };
  const submit = async () => {
    if (!editing || busy || (!editing.remove && !name.trim())) return;
    setBusy(true);
    setError("");
    try {
      const leavingDeletedFolder = Boolean(editing.remove && editing.folder?.id === currentFolderId);
      const result = await saveFolder({ section, name: name.trim(), id: editing.folder?.id, remove: editing.remove, refresh: !leavingDeletedFolder });
      if ("error" in result) throw new Error(result.error);
      toast({ title: editing.remove ? "Folder deleted" : editing.folder ? "Folder renamed" : "Folder created" });
      setEditing(null);
      if (leavingDeletedFolder) router.replace(folderHref(section, query.toString()));
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Please try again.";
      setError(message);
      toast({ title: "Folder update failed", description: message, className: "error-toast" });
    } finally { setBusy(false); }
  };
  const cleanup = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await cleanupFolderPlacements(`/${section}`);
      if ("error" in result) throw new Error(result.error);
      setCleanupRemaining(result.remaining);
      toast({ title: "Folder cleanup complete", description: `${result.cleaned} obsolete placements removed. ${result.remaining ? `${result.remaining} remaining to check; click cleanup again to continue.` : "This pass is finished."}` });
    } catch (cause) {
      toast({ title: "Cleanup failed", description: cause instanceof Error ? cause.message : "Please try again.", className: "error-toast" });
    } finally { setBusy(false); }
  };
  return { editing, name, setName, busy, error, begin, cancel, submit, cleanup, cleanupRemaining };
}
