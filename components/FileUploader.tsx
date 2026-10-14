"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/components/Thumbnail";
import { BLOCKED_EXTENSIONS, MAX_FILE_SIZE } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { uploadFile, UploadError } from "@/lib/client-api";
import { useRouter } from "next/navigation";
import { MAX_UPLOAD_FILES, runUploadQueue } from "@/lib/upload-queue";


interface UploadEntry {
  id: string;
  file: File;
  url: string;
  controller: AbortController;
  progress: number;
  queued: boolean;
}

interface Props {
  className?: string;
}

const FileUploader = ({ className }: Props) => {
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
            const ext = file.name.includes(".")
              ? file.name.split(".").pop()!.toLowerCase()
              : "";
            if (BLOCKED_EXTENSIONS.has(ext)) {
              setFiles((prevFiles) =>
                prevFiles.filter((item) => item.id !== entry.id),
              );
              results.failed++;
              firstError ||= `${file.name}: .${ext} files are blocked.`;
              return;
            }

            let maxBytes = MAX_FILE_SIZE; 
            let limitLabel = "50MB";
            if (ext === "svg") {
              maxBytes = 5 * 1024 * 1024;
              limitLabel = "5MB for vector SVGs";
            } else if (
              [
                "txt",
                "json",
                "xml",
                "yaml",
                "yml",
                "md",
                "csv",
                "log",
                "env",
                "conf",
              ].includes(ext)
            ) {
              maxBytes = 10 * 1024 * 1024;
              limitLabel = "10MB for text/data files";
            } else if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
              maxBytes = 20 * 1024 * 1024;
              limitLabel = "20MB for images";
            } else if (
              ["pdf", "docx", "xlsx", "pptx", "doc", "xls", "ppt"].includes(ext)
            ) {
              maxBytes = 25 * 1024 * 1024;
              limitLabel = "25MB for documents";
            }

            if (file.size > maxBytes) {
              setFiles((prevFiles) =>
                prevFiles.filter((item) => item.id !== entry.id),
              );
              results.failed++;
              firstError ||= `${file.name} exceeds the ${limitLabel} limit.`;
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

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button
        type="button"
        disabled={isUploading}
        className={cn("uploader-button", className)}
      >
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />{" "}
        <p>{isUploading ? "Uploading..." : "Upload"}</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>

          {files.map((entry) => {
            const { file } = entry;
            const { type, extension } = getFileType(file.name);

            return (
              <li key={entry.id} className="uploader-preview-item">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={entry.url}
                    className="shrink-0"
                  />

                  <div className="preview-item-name min-w-0 flex-1">
                    <p className="subtitle-2 truncate text-light-100 mb-1">
                      {file.name}
                    </p>
                    <progress
                      className="h-2 w-full accent-teal-600"
                      max={100}
                      value={entry.progress}
                      aria-label={`Upload progress for ${file.name}`}
                    />
                    <p className="caption text-light-200" role="status">
                      {entry.queued
                        ? "Queued"
                        : entry.progress >= 100
                          ? "Saving file..."
                          : `${entry.progress}% uploaded`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={entry.progress >= 100}
                  aria-label={`Cancel upload of ${file.name}`}
                  onClick={(event) => handleCancel(event, entry)}
                  className="shrink-0 ml-2 hover:opacity-80 disabled:opacity-40"
                >
                  <Image
                    src="/assets/icons/remove.svg"
                    width={24}
                    height={24}
                    alt=""
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
