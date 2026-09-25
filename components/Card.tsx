import Thumbnail from "@/components/Thumbnail";
import { convertFileSize, cn } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateTime";
import ActionDropdown from "@/components/ActionDropdown";
import { ViewType } from "./ViewToggle"; 

interface CardProps {
    file: CloudenceFile;
    view?: ViewType;
}

const Card = ({ file, view = "grid" }: CardProps) => {
    return (
        <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "file-card transition-all",
                view === "list" && "!flex-row !items-center !justify-between !gap-4 !p-4 !h-auto w-full"
            )}
        >
            
            {view === "grid" && (
                <>
                    <div className="flex justify-between">
                        <Thumbnail
                            type={file.type}
                            extension={file.extension}
                            url={file.url}
                            className="!size-20"
                            imageClassName="!size-11"
                        />

                        <div
                            className="flex flex-col items-end justify-between"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <ActionDropdown file={file} />
                            <p className="body-1">{convertFileSize(file.size)}</p>
                        </div>
                    </div>

                    <div className="file-card-details">
                        <p className="subtitle-2 line-clamp-1">{file.name}</p>
                        <FormattedDateTime
                            date={file.$createdAt}
                            className="body-2 text-light-100"
                        />
                        <p className="caption line-clamp-1 text-light-200">
                            By: {file.owner.fullName}
                        </p>
                    </div>
                </>
            )}

            
            {view === "list" && (
                <>
                    {/* Left Side: Thumbnail & Text */}
                    <div className="flex items-center gap-4 flex-1 truncate">
                        <Thumbnail
                            type={file.type}
                            extension={file.extension}
                            url={file.url}
                            className="!size-12 shrink-0"
                            imageClassName="!size-7 shrink-0"
                        />

                        <div className="flex flex-col truncate pr-2">
                            <p className="subtitle-2 line-clamp-1">{file.name}</p>
                            <p className="caption text-light-200 line-clamp-1">
                                By: {file.owner.fullName}
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Metadata & Actions */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                        <FormattedDateTime
                            date={file.$createdAt}
                            className="body-2 text-light-100 hidden sm:block"
                        />
                        <p className="body-1 hidden md:block">
                            {convertFileSize(file.size)}
                        </p>

                        <div onClick={(e) => e.stopPropagation()}>
                            <ActionDropdown file={file} />
                        </div>
                    </div>
                </>
            )}
        </a>
    );
};

export default Card;