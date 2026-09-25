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
    // Determine if it's a standard image or a PDF that needs a thumbnail
    const isImage = type === "image" && extension !== "svg";
    const isPdf = extension === "pdf";
    const shouldGeneratePreview = (isImage || isPdf) && url !== "";

    // Get the Cloudinary URL or fallback to the local SVG icon
    const imageSrc = shouldGeneratePreview
        ? getOptimizedThumbnailUrl(url, 160, 160, isPdf)
        : getFileIcon(extension, type);

    return (
        <figure className={cn("thumbnail flex items-center justify-center overflow-hidden", className)}>
            <Image
                src={imageSrc}
                alt="thumbnail"
                width={100}
                height={100}
                className={cn(
                    "size-8 object-contain",
                    imageClassName,
                    shouldGeneratePreview && "thumbnail-image"
                )}
            />
        </figure>
    );
};
export default Thumbnail;