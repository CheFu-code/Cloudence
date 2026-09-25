"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Check, LayoutGrid, List } from "lucide-react";

export type ViewType = "list" | "grid";

interface ViewToggleProps {
    view: ViewType;
    onChange: (view: ViewType) => void;
    className?: string;
}

export const ViewToggle = ({
    view = "list",
    onChange,
    className,
}: ViewToggleProps) => {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border border-gray-300 overflow-hidden bg-white shadow-sm",
                className
            )}
        >
            {/* List View Segment */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => onChange("list")}
                        type="button"
                        aria-label="Switch to list view"
                        className={cn(
                            "relative flex items-center gap-1.5 md:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 transition-colors border-r border-gray-300",
                            view === "list" ? "bg-[#cceeff]" : "hover:bg-gray-50"
                        )}
                    >
                        {view === "list" && (
                            <Check
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] text-slate-800"
                                strokeWidth={2.5}
                            />
                        )}
                        <List
                            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-slate-800"
                            strokeWidth={2}
                        />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>List View</p>
                </TooltipContent>
            </Tooltip>

            {/* Grid View Segment */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => onChange("grid")}
                        type="button"
                        aria-label="Switch to grid view"
                        className={cn(
                            "relative flex items-center gap-1.5 md:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 transition-colors",
                            view === "grid" ? "bg-[#cceeff]" : "hover:bg-gray-50"
                        )}
                    >
                        {view === "grid" && (
                            <Check
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] text-slate-800"
                                strokeWidth={2.5}
                            />
                        )}
                        <LayoutGrid
                            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-slate-800"
                            strokeWidth={2}
                        />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Grid View</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
};