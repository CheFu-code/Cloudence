"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveFolder } from "@/lib/actions/file.actions";
import { useToast } from "@/hooks/use-toast";

export function useFolders(section: string, currentFolderId?: string) {
  const [editing, setEditing] = useState<{ folder?: CloudenceFolder; remove?: boolean } | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
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
      if (leavingDeletedFolder) router.replace(`/${section}`);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Please try again.";
      setError(message);
      toast({ title: "Folder update failed", description: message, className: "error-toast" });
    } finally { setBusy(false); }
  };
  return { editing, name, setName, busy, error, begin, cancel, submit };
}
