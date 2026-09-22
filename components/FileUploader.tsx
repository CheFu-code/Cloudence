"use client";

import React, { useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/components/Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";

const BLOCKED_EXTENSIONS = new Set([
  "exe", "bat", "cmd", "sh", "bash", "zsh", "ps1", "psm1", "psd1",
  "msi", "msp", "scr", "pif", "com", "hta", "cpl", "vbs", "vbe", "wsf", "wsh",
  "php", "php3", "php4", "php5", "phtml", "phar",
  "py", "pyc", "pyo", "pyw", "rb", "pl", "cgi",
  "jar", "war", "ear",
  "dll", "so", "dylib", "sys", "drv",
  "js", "mjs", "cjs", "ts",
]);

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (isUploading || acceptedFiles.length === 0) return;
      setIsUploading(true);
      setFiles(acceptedFiles);

      try {
        await Promise.all(
          acceptedFiles.map(async (file) => {
            const ext = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "";
            if (BLOCKED_EXTENSIONS.has(ext)) {
              setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
              toast({
                title: "Upload blocked",
                description: `.${ext} files are not permitted for security reasons (executable/script files are blocked).`,
                className: "error-toast",
              });
              return;
            }

            if (file.size > MAX_FILE_SIZE) {
              setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
              toast({
                title: "Upload failed",
                description: `${file.name} is too large. Max file size is 50MB.`,
                className: "error-toast",
              });
              return;
            }

            try {
              const res = await uploadFile({ file, ownerId, accountId, path });
              if (res && "error" in res && res.error) {
                setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
                toast({
                  title: "Upload failed",
                  description: String(res.error),
                  className: "error-toast",
                });
                return;
              }

              setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
              toast({ title: "Upload complete", description: `${file.name} was uploaded.` });
            } catch (error) {
              setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
              toast({
                title: "Upload failed",
                description: error instanceof Error ? error.message : `Could not upload ${file.name}.`,
                className: "error-toast",
              });
            }
          }),
        );
      } finally {
        setIsUploading(false);
      }
    },
    [ownerId, accountId, path, isUploading, toast],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string,
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" disabled={isUploading} className={cn("uploader-button", className)}>
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

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                    className="shrink-0"
                  />

                  <div className="preview-item-name min-w-0 flex-1">
                    <p className="subtitle-2 truncate text-light-100 mb-1">{file.name}</p>
                    <Image
                      src="/assets/icons/file-loader.gif"
                      width={80}
                      height={26}
                      alt="Loader"
                      className="shrink-0"
                    />
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="Remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                  className="shrink-0 cursor-pointer ml-2 hover:opacity-80 transition-opacity"
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
