export const MAX_BULK_MOVE = 50;

export function folderHref(section: string, currentQuery: string, folderId?: string, offset = 0) {
  const query = new URLSearchParams(currentQuery);
  if (folderId) query.set("folder", folderId);
  else query.delete("folder");
  if (offset > 0) query.set("offset", String(offset));
  else query.delete("offset");
  query.delete("filter");
  return `/${section}${query.size ? `?${query}` : ""}`;
}

export function visibleFolders(folders: CloudenceFolder[], query: string, order: string) {
  const search = query.trim().toLowerCase();
  const filtered = folders.filter((folder) => folder.name.toLowerCase().includes(search));
  return filtered.sort((a, b) => order === "newest"
    ? b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id)
    : (order === "name-desc" ? -1 : 1) * (a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }) || a.id.localeCompare(b.id)));
}
