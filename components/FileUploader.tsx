"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/components/Thumbnail";
import { useFileUploader } from "@/hooks/use-file-uploader";

interface Props {
  className?: string;
}
const FileUploader = ({ className }: Props) => {
  const { files, isUploading, getRootProps, getInputProps, handleCancel } =
    useFileUploader();
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
