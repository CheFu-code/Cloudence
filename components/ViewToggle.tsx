"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Check, LayoutGrid, List } from "lucide-react";

export type ViewType = "list" | "grid";

interface ViewToggleProps {
    view: ViewType;
    onChange: (view: ViewType) => void;
    className?: string;
}

const VIEWS = [
    { id: "list", label: "List View", Icon: List },
    { id: "grid", label: "Grid View", Icon: LayoutGrid },
] as const;

export const ViewToggle = ({
    view = "list",
    onChange,
    className,
}: ViewToggleProps) => {
    return (
        <TooltipProvider>
            <div
                className={cn(
                    "inline-flex items-center rounded-full border border-gray-300 overflow-hidden bg-white shadow-sm",
                    className
                )}
            >
                {VIEWS.map(({ id, label, Icon }, index) => {
                    const isActive = view === id;

                    return (
                        <Tooltip key={id}>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => onChange(id)}
                                    type="button"
                                    aria-label={`Switch to ${id} view`}
                                    className={cn(
                                        // Reduced padding and gap, removed sm/md scaling
                                        "relative flex items-center gap-1.5 px-3 py-1.5 transition-colors text-sm",
                                        index === 0 && "border-r border-gray-300",
                                        isActive ? "bg-[#cceeff]" : "hover:bg-gray-50"
                                    )}
                                >
                                    {isActive && (
                                        <Check
                                            // Fixed smaller size for the checkmark
                                            className="w-3.5 h-3.5 text-slate-800"
                                            strokeWidth={2.5}
                                        />
                                    )}
                                    <Icon
                                        // Fixed smaller size for the main icons (16px)
                                        className="w-4 h-4 text-slate-800"
                                        strokeWidth={2}
                                    />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs">{label}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </div>
        </TooltipProvider>
    );
};