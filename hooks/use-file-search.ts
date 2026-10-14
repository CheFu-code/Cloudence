"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/file.actions";
import { useDebounce } from "use-debounce";
export function useFileSearch() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(searchQuery);
  const [results, setResults] = useState<CloudenceFile[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    let isCurrent = true;
    const fetchFiles = async () => {
      if (debouncedQuery.length === 0) {
        setResults([]);
        setOpen(false);
        if (searchParams.has("query")) {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("query");
          const remaining = params.toString();
          router.push(remaining ? `${path}?${remaining}` : path);
        }
        return;
      }

      try {
        const files = await getFiles({
          types: [],
          searchText: debouncedQuery,
          limit: 8,
        });
        if (isCurrent) {
          setResults(files.documents);
          setOpen(true);
        }
      } catch {
        if (isCurrent) {
          setResults([]);
          setOpen(false);
        }
      }
    };

    fetchFiles();
    return () => {
      isCurrent = false;
    };
  }, [debouncedQuery, path, router, searchParams]);

  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  const handleClickItem = (file: CloudenceFile) => {
    setOpen(false);
    setResults([]);

    const routeType =
      file.type === "video" || file.type === "audio"
        ? "media"
        : `${file.type}s`;
    router.push(`/${routeType}?query=${encodeURIComponent(query)}`);
  };

  return { query, setQuery, results, open, handleClickItem };
}
