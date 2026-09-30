"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/file.actions";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { useDebounce } from "use-debounce";
const Search = () => {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
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
        const files = await getFiles({ types: [], searchText: debouncedQuery, limit: 8 });
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
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  const handleClickItem = (file: CloudenceFile) => {
    setOpen(false);
    setResults([]);

    const routeType = file.type === "video" || file.type === "audio" ? "media" : `${file.type}s`;
    router.push(`/${routeType}?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="search" role="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt=""
          aria-hidden="true"
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder="Search..."
          aria-label="Search files"
          aria-expanded={open}
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />


        {open && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  className="flex items-center justify-between"
                  key={file.$id}
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>

                  <FormattedDateTime
                    date={file.$createdAt}
                    className="caption line-clamp-1 text-light-200"
                  />
                </li>
              ))
            ) : (
              <p className="empty-result">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
