"use client";

import React from "react";
import { Check, List, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

// 1. Define strict types for the view state
export type ViewType = "list" | "grid";

// 2. Interface for the Tooltip wrapper
interface TooltipProps {
    text: string;
    children: React.ReactNode;
}

const Tooltip = ({ text, children }: TooltipProps) => {
    return (
        <div className="relative flex items-center justify-center group">
            {children}
            <div className="absolute bottom-full mb-1.5 hidden group-hover:flex flex-col items-center z-10">
                <span className="relative z-10 px-2.5 py-1.5 text-xs font-medium leading-none text-white whitespace-nowrap bg-gray-800 rounded-md shadow-lg">
                    {text}
                </span>
                {/* Tooltip caret (arrow) */}
                <div className="w-2.5 h-2.5 -mt-1.5 rotate-45 bg-gray-800 rounded-sm"></div>
            </div>
        </div>
    );
};

// 3. Interface for the main ViewToggle component
interface ViewToggleProps {
    view: ViewType;
    onChange: (view: ViewType) => void;
    className?: string;
}

export const ViewToggle = ({
    view = "list",
    onChange,
    className
}: ViewToggleProps) => {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border border-gray-300 overflow-hidden bg-white shadow-sm",
                className
            )}
        >
            {/* List View Segment */}
            <Tooltip text="List View">
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
            </Tooltip>

            {/* Grid View Segment */}
            <Tooltip text="Grid View">
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
            </Tooltip>
        </div>
    );
};