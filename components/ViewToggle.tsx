"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LayoutGrid, List } from "lucide-react";

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
                    "inline-flex items-center rounded-md border border-gray-200 overflow-hidden bg-white shadow-sm",
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
                                        "relative flex items-center justify-center px-2 py-1 transition-colors",
                                        index !== VIEWS.length - 1 && "border-r border-gray-200",
                                        isActive ? "bg-[#cceeff]" : "hover:bg-gray-50"
                                    )}
                                >
                                    <Icon
                                        className="w-3.5 h-3.5 text-slate-800"
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