"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { moveFilesToFolder } from "@/lib/actions/file.actions";
import { MAX_BULK_MOVE } from "@/lib/folder-view";

export function useFileSelection(files: CloudenceFile[], scope: string) {
  const [selection, setSelection] = useState<string[]>([]);
  const [destination, setDestination] = useState("");
  const [busy, setBusy] = useState(false);
  const path = usePathname();
  const { toast } = useToast();
  useEffect(() => { setSelection([]); }, [scope]);
  const ids = new Set(files.map((file) => file.$id));
  const selected = selection.filter((id) => ids.has(id));
  const toggle = (id: string) => {
    if (busy) return;
    setSelection((previous) => previous.includes(id) ? previous.filter((value) => value !== id)
      : previous.filter((value) => ids.has(value)).length < MAX_BULK_MOVE ? [...previous.filter((value) => ids.has(value)), id] : previous);
  };
  const selectPage = () => { if (!busy) setSelection(files.slice(0, MAX_BULK_MOVE).map((file) => file.$id)); };
  const clear = () => { if (!busy) setSelection([]); };
  const move = async () => {
    if (!selected.length || busy) return;
    setBusy(true);
    try {
      const result = await moveFilesToFolder({ fileIds: selected, folderId: destination || null, path });
      if ("error" in result) throw new Error(result.error);
      setSelection([]);
      toast({ title: `${result.moved} files moved` });
    } catch (error) {
      toast({ title: "Move failed", description: error instanceof Error ? error.message : "Please try again.", className: "error-toast" });
    } finally { setBusy(false); }
  };
  return { selected, destination, setDestination, busy, toggle, selectPage, clear, move };
}
