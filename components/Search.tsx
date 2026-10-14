"use client";

import React from "react";
import { useFileSearch } from "@/hooks/use-file-search";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
const Search = () => {
  const { query, setQuery, results, open, handleClickItem } = useFileSearch();
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
