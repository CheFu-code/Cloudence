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
                    "relative flex items-center gap-1.5 md:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 transition-colors",
                    index === 0 && "border-r border-gray-300", // Add border only to the first item
                    isActive ? "bg-[#cceeff]" : "hover:bg-gray-50"
                  )}
                >
                  {isActive && (
                    <Check
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] text-slate-800"
                      strokeWidth={2.5}
                    />
                  )}
                  <Icon
                    className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-slate-800"
                    strokeWidth={2}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};