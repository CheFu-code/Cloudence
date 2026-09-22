import React from "react";
import Image from "next/image";
import { cn, getFileIcon, getOptimizedThumbnailUrl } from "@/lib/utils";

interface Props {
  type: string;
  extension: string;
  url?: string;
  imageClassName?: string;
  className?: string;
}

export const Thumbnail = ({
  type,
  extension,
  url = "",
  imageClassName,
  className,
}: Props) => {
  const isImage = type === "image" && extension !== "svg";
  const imageSrc = isImage ? getOptimizedThumbnailUrl(url, 160, 160) : getFileIcon(extension, type);

  return (
    <figure className={cn("thumbnail", className)}>
      <Image
        src={imageSrc}
        alt="thumbnail"
        width={100}
        height={100}
        className={cn(
          "size-8 object-contain",
          imageClassName,
          isImage && "thumbnail-image",
        )}
      />
    </figure>
  );
};
export default Thumbnail;
