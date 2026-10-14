/** Keep internal storage and security fields out of client file objects. */
export function normalizeFile(file: Record<string, unknown>): CloudenceFile {
  return {
    isOwner: file.isOwner === true,
    folderId: typeof file.folderId === "string" ? file.folderId : null,
    $id: String(file.id ?? ""),
    $createdAt: String(file.createdAt ?? ""),
    $updatedAt: String(file.updatedAt ?? ""),
    name: String(file.name ?? ""),
    type: (file.type as CloudenceFile["type"]) ?? "other",
    extension: String(file.extension ?? ""),
    url: String(file.url || ""),
    size: Number(file.size ?? 0),
    owner: (file.owner as CloudenceFile["owner"]) ?? { id: "", fullName: "", email: "" },
    users: Array.isArray(file.users) ? (file.users as string[]) : [],
    shareExpiresAt: file.shareExpiresAt ? String(file.shareExpiresAt) : undefined,
  };
}
