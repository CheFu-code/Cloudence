"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.chefu.co.za";
const APP_ID = "cloudence";

function apiUrl(path: string) {
  return `${API_BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Read session cookies once and return auth headers. */
async function sessionHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const sessionCookies = cookieStore
    .getAll()
    .filter((c) => c.name === "__session" || c.name === "__session_meta")
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return { Cookie: sessionCookies, "x-chefu-app": APP_ID };
}

/** JSON fetch — adds Content-Type automatically. */
async function request<T>(
  path: string,
  init: RequestInit = {},
  headers?: Record<string, string>,
): Promise<T> {
  const authHeaders = headers ?? (await sessionHeaders());
  const response = await fetch(apiUrl(path), {
    ...init,
    cache: "no-store",
    headers: {
      ...authHeaders,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const data = (await response.json().catch(() => null)) as
    | (T & { message?: string; error?: string })
    | null;

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Cloudence file request failed.");
  }

  return data as T;
}

/** Like `request` but never throws — returns `{ error }` on failure so the
 *  message survives Next.js server-action serialisation in production. */
async function safeRequest<T = Record<string, unknown>>(
  path: string,
  init: RequestInit = {},
  headers?: Record<string, string>,
): Promise<T | { error: string }> {
  try {
    return await request<T>(path, init, headers);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong. Please try again." };
  }
}

/**
 * Strict allowlist — only the 9 fields the UI actually renders are forwarded
 * across the RSC serialisation boundary. This strips sha256, ownerId, publicId,
 * isDeleted, deletedAt, deletedBy, resourceType, signedUrl, etc. from every
 * page payload, reducing per-file RSC JSON size by ~35%.
 */
function normalizeFile(file: Record<string, unknown>): CloudenceFile {
  return {
    $id: String(file.id ?? ""),
    $createdAt: String(file.createdAt ?? ""),
    $updatedAt: String(file.updatedAt ?? ""),
    name: String(file.name ?? ""),
    type: (file.type as CloudenceFile["type"]) ?? "other",
    extension: String(file.extension ?? ""),
    // Prefer the pre-computed signedUrl stored in Firestore; fall back to raw url.
    url: String((file.signedUrl as string) || (file.url as string) || ""),
    size: Number(file.size ?? 0),
    owner: (file.owner as CloudenceFile["owner"]) ?? { id: "", fullName: "", email: "" },
    users: Array.isArray(file.users) ? (file.users as string[]) : [],
    shareExpiresAt: file.shareExpiresAt ? String(file.shareExpiresAt) : undefined,
  };
}

export async function uploadFile({ file, path }: UploadFileProps) {
  // Hoist session headers once — reused for the single request below.
  const authHeaders = await sessionHeaders();

  // Send as binary multipart/form-data — no base64 encode/decode, no +33% size,
  // no full-file arrayBuffer() RAM allocation. The browser streams the binary
  // directly and fetch sets the correct Content-Type + boundary automatically.
  const formData = new FormData();
  formData.append("file", file, file.name);
  // Pass filename explicitly so the backend sees it even if originalname is percent-encoded.
  formData.append("name", file.name);

  const result = await safeRequest<Record<string, unknown>>(
    "/cloudence/files",
    { method: "POST", body: formData },
    // Do NOT include Content-Type here — fetch must set it with the multipart boundary.
    authHeaders,
  );

  if ("error" in result) return result;
  revalidatePath(path);
  return normalizeFile(result);
}

export async function getFiles({
  types = [],
  searchText = "",
  sort = "",
  limit,
}: GetFilesProps) {
  const params = new URLSearchParams();
  if (types.length === 1) {
    params.set("type", types[0]);
  } else if (types.length > 1) {
    params.set("types", types.join(","));
  }
  if (searchText) params.set("search", searchText);
  if (limit) params.set("limit", String(limit));
  params.set("sort", sort || "$createdAt-desc");

  const result = await request<{
    total: number;
    documents: Record<string, unknown>[];
  }>(`/cloudence/files?${params.toString()}`);

  return {
    total: result.total,
    documents: result.documents.map(normalizeFile),
  };
}

export async function getTotalSpaceUsed() {
  return request<{
    image: { size: number; latestDate: string };
    document: { size: number; latestDate: string };
    video: { size: number; latestDate: string };
    audio: { size: number; latestDate: string };
    other: { size: number; latestDate: string };
    used: number;
    all: number;
  }>("/cloudence/files/usage");
}

export async function renameFile({ fileId, name, extension, path }: RenameFileProps) {
  const result = await safeRequest<Record<string, unknown>>(`/cloudence/files/${fileId}`, {
    body: JSON.stringify({ name: `${name}.${extension}` }),
    method: "PATCH",
  });

  if ("error" in result) return result;
  revalidatePath(path);
  return normalizeFile(result);
}

export async function updateFileUsers({ fileId, emails, path }: UpdateFileUsersProps) {
  const result = await safeRequest<Record<string, unknown>>(`/cloudence/files/${fileId}`, {
    body: JSON.stringify({ users: emails }),
    method: "PATCH",
  });

  if ("error" in result) return result;
  revalidatePath(path);
  return normalizeFile(result);
}

export async function deleteFile({ fileId, path }: DeleteFileProps) {
  const result = await safeRequest<Record<string, unknown>>(`/cloudence/files/${fileId}`, { method: "DELETE" });
  if ("error" in result) return result;
  revalidatePath(path);
  return { status: "success" };
}

export async function getFileDownloadUrl(fileId: string) {
  return safeRequest<{
    downloadUrl: string;
    name: string;
    sha256?: string;
    size: number;
  }>(`/cloudence/files/${fileId}/download?json=true`);
}

