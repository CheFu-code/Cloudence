import React from "react";
import { getFiles } from "@/lib/actions/file.actions";
import { getFileTypesParams } from "@/lib/utils";
import TypeFileView from "@/components/TypeFileView";
import { notFound, redirect } from "next/navigation";

const Page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";
  if (!["documents", "images", "media", "others"].includes(type)) notFound();
  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";

  const types = getFileTypesParams(type) as FileType[];

  const query = await searchParams;
  const folderId = typeof query?.folder === "string" ? query.folder : undefined;
  const offset = Number(query?.offset || 0);
  const files = await getFiles({ types, searchText, sort, section: type, folderId, offset }).catch((error) => {
    if (folderId && error?.status === 404) redirect(`/${type}`);
    throw error;
  });
  const totalSize = files.documents.reduce((total, file) => total + file.size, 0);

  return (
    <div className="page-container">
      <TypeFileView
        type={type}
        files={files.documents}
        totalSize={totalSize}
        initialSort={sort}
        folders={files.folders}
        folderId={folderId}
        nextOffset={files.nextOffset}
        offset={offset}
      />
    </div>
  );
};

export default Page;
