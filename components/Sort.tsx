"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { sortTypes } from "@/constants";

interface SortProps {
  value?: string;
  onSortChange?: (value: string) => void;
}

const Sort = ({ value, onSortChange }: SortProps = {}) => {
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (sortValue: string) => {
    if (onSortChange) {
      onSortChange(sortValue);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sort", sortValue);
      router.push(`${path}?${params.toString()}`);
    }
  };

  const selectedValue = value || searchParams.get("sort") || sortTypes[0].value;

  return (
    <Select
      onValueChange={handleSort}
      value={selectedValue}
    >
      <SelectTrigger className="sort-select">
        <SelectValue placeholder={sortTypes[0].value} />
      </SelectTrigger>
      <SelectContent className="sort-select-content">
        {sortTypes.map((sort) => (
          <SelectItem
            key={sort.label}
            className="shad-select-item"
            value={sort.value}
          >
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Sort;
