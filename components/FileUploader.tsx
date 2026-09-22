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
              await uploadFile({ file, ownerId, accountId, path });
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
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      width={80}
                      height={26}
                      alt="Loader"
                    />
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="Remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
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
