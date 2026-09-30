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
    const ownerInitial = file.owner.fullName ? file.owner.fullName.charAt(0).toUpperCase() : "U";

    return (
        <div
            className={cn(
                "transition-all w-full",
                view === "grid" 
                    ? "file-card" 
                    : "grid grid-cols-4 sm:grid-cols-12 items-center gap-4 border-b border-light-100 px-4 py-3 hover:bg-gray-50/70"
            )}
        >
            {view === "grid" && (
                <>
                    <div className="flex justify-between items-start">
                        <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                            aria-label={`Open ${file.name}`}
                        >
                            <Thumbnail
                                type={file.type}
                                extension={file.extension}
                                url={file.url}
                                className="!size-20"
                                imageClassName="!size-11"
                            />
                        </a>

                        <div className="flex flex-col items-end justify-between h-20">
                            <ActionDropdown file={file} />
                            <p className="body-1">{convertFileSize(file.size)}</p>
                        </div>
                    </div>

                    <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="file-card-details block group"
                    >
                        <p className="subtitle-2 line-clamp-1 group-hover:text-brand transition-colors">{file.name}</p>
                        <FormattedDateTime
                            date={file.$createdAt}
                            className="body-2 text-light-100"
                        />
                        <p className="caption line-clamp-1 text-light-200">
                            By: {file.owner.fullName}
                        </p>
                    </a>
                </>
            )}

            {view === "list" && (
                <>
                    {/* 1. Name Column */}
                    <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="col-span-3 sm:col-span-5 lg:col-span-4 flex items-center gap-3 overflow-hidden pr-2 group"
                    >
                        <Thumbnail
                            type={file.type}
                            extension={file.extension}
                            url={file.url}
                            className="!size-8 shrink-0 bg-transparent"
                            imageClassName="!size-5"
                        />
                        <p className="subtitle-2 truncate text-dark-200 font-medium group-hover:text-brand transition-colors">
                            {file.name}
                        </p>
                    </a>

                    {/* 2. Date Column (Hidden on mobile) */}
                    <div className="hidden sm:flex sm:col-span-4 lg:col-span-3 items-center text-sm text-light-200 truncate">
                        Uploaded •&nbsp;<FormattedDateTime date={file.$createdAt} className="truncate" />
                    </div>

                    {/* 3. Owner Column (Hidden on mobile & tablet) */}
                    <div className="hidden lg:flex lg:col-span-3 items-center gap-2 overflow-hidden">
                        <div className="w-6 h-6 shrink-0 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                            {ownerInitial}
                        </div>
                        <p className="text-sm truncate text-dark-200">
                            {file.owner.fullName}
                        </p>
                    </div>

                    {/* 4. Location / Size Column (Hidden on mobile) */}
                    <div className="hidden sm:flex sm:col-span-2 lg:col-span-1 items-center text-sm text-light-200 truncate">
                        {convertFileSize(file.size)}
                    </div>

                    {/* 5. Actions Column (Far right) */}
                    <div className="col-span-1 flex justify-end">
                        <ActionDropdown file={file} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Card;