export function sortFiles(
  files: CloudenceFile[],
  sortType: string,
): CloudenceFile[] {
  if (!files || files.length <= 1) return files || [];

  return [...files].sort((a, b) => {
    switch (sortType) {
      case "$createdAt-asc":
        return (
          new Date(a.$createdAt || 0).getTime() -
          new Date(b.$createdAt || 0).getTime()
        );
      case "$createdAt-desc":
        return (
          new Date(b.$createdAt || 0).getTime() -
          new Date(a.$createdAt || 0).getTime()
        );
      case "name-asc":
        return (a.name || "").localeCompare(b.name || "", undefined, {
          sensitivity: "base",
          numeric: true,
        });
      case "name-desc":
        return (b.name || "").localeCompare(a.name || "", undefined, {
          sensitivity: "base",
          numeric: true,
        });
      case "size-asc":
        return (a.size || 0) - (b.size || 0);
      case "size-desc":
        return (b.size || 0) - (a.size || 0);
      default:
        return (
          new Date(b.$createdAt || 0).getTime() -
          new Date(a.$createdAt || 0).getTime()
        );
    }
  });
}
