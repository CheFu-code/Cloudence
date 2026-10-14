"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { uploadFile, UploadError } from "@/lib/client-api";
import { MAX_UPLOAD_FILES, runUploadQueue } from "@/lib/upload-queue";
import { validateUploadFile } from "@/lib/upload-validation";

interface UploadEntry {
  id: string;
  file: File;
  url: string;
  controller: AbortController;
  progress: number;
  queued: boolean;
}

export function useFileUploader() {
  const router = useRouter();
  const { toast } = useToast();
  const [files, setFiles] = useState<UploadEntry[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const active = useRef(new Map<string, UploadEntry>());
  const busy = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const uploads = active.current;
    return () => {
      mounted.current = false;
      for (const entry of uploads.values()) {
        entry.controller.abort();
        URL.revokeObjectURL(entry.url);
      }
      uploads.clear();
    };
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (busy.current || acceptedFiles.length === 0) return;
      if (acceptedFiles.length > MAX_UPLOAD_FILES) {
        toast({
          title: "Too many files",
          description: `Select up to ${MAX_UPLOAD_FILES} files at a time.`,
          className: "error-toast",
        });
        return;
      }
      busy.current = true;
      setIsUploading(true);
      const entries = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        controller: new AbortController(),
        progress: 0,
        queued: true,
      }));
      entries.forEach((entry) => active.current.set(entry.id, entry));
      setFiles(entries);
      const results = { uploaded: 0, failed: 0, canceled: 0, skipped: 0 };
      let firstError = "";
      let stopped = false;

      try {
        await runUploadQueue(entries, async (entry) => {
          const { file } = entry;
          try {
            if (entry.controller.signal.aborted) {
              results.canceled++;
              return;
            }
            if (stopped) {
              results.skipped++;
              return;
            }
            const validationError = validateUploadFile(file);
            if (validationError) {
              results.failed++;
              firstError ||= validationError;
              return;
            }

            try {
              setFiles((previous) =>
                previous.map((item) =>
                  item.id === entry.id ? { ...item, queued: false } : item,
                ),
              );
              await uploadFile(file, {
                signal: entry.controller.signal,
                onProgress: (progress) =>
                  setFiles((previous) =>
                    previous.map((item) =>
                      item.id === entry.id ? { ...item, progress } : item,
                    ),
                  ),
              });
              results.uploaded++;

              setFiles((prevFiles) =>
                prevFiles.filter((item) => item.id !== entry.id),
              );
            } catch (error) {
              if (error instanceof Error && error.name === "AbortError") {
                results.canceled++;
                return;
              }
              results.failed++;
              firstError ||=
                error instanceof Error
                  ? error.message
                  : "Upload failed. Please try again.";
              if (error instanceof UploadError && error.status === 429) {
                stopped = true;
                firstError = error.message;
              }
            }
          } finally {
            active.current.delete(entry.id);
            URL.revokeObjectURL(entry.url);
            setFiles((previous) =>
              previous.filter((item) => item.id !== entry.id),
            );
          }
        });
      } finally {
        busy.current = false;
        setIsUploading(false);
        if (mounted.current) {
          if (results.uploaded) router.refresh();
          toast({
            title: results.failed
              ? "Some files could not be uploaded"
              : "Upload batch finished",
            description: `${results.uploaded} uploaded, ${results.failed} failed, ${results.canceled} canceled, ${results.skipped} skipped.${firstError ? ` ${firstError}` : ""}`,
            ...(results.failed ? { className: "error-toast" } : {}),
          });
        }
      }
    },
    [router, toast],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: MAX_UPLOAD_FILES,
    disabled: isUploading,
    onDropRejected: () =>
      toast({
        title: "Selection rejected",
        description: `Select up to ${MAX_UPLOAD_FILES} files at a time.`,
        className: "error-toast",
      }),
  });

  const handleCancel = (
    event: React.MouseEvent<HTMLButtonElement>,
    entry: UploadEntry,
  ) => {
    event.stopPropagation();
    entry.controller.abort();
    if (entry.queued)
      setFiles((previous) => previous.filter((item) => item.id !== entry.id));
  };

  return { files, isUploading, getRootProps, getInputProps, handleCancel };
}
