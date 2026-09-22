"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.chefu.co.za";
const APP_ID = "cloudence";

function apiUrl(path: string) {
  return `${API_BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

async function sessionHeaders() {
  const cookieStore = await cookies();
  const sessionCookies = cookieStore
    .getAll()
    .filter((cookie) => cookie.name === "__session" || cookie.name === "__session_meta")
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return { Cookie: sessionCookies, "x-chefu-app": APP_ID };
}

async function request<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(apiUrl(path), {
    ...init,
    cache: "no-store",
    headers: {
      ...(await sessionHeaders()),
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

function normalizeFile(file: Record<string, unknown>): CloudenceFile {
  return {
    ...(file as unknown as CloudenceFile),
    $id: String(file.id),
    $createdAt: String(file.createdAt),
    $updatedAt: String(file.updatedAt),
  };
}

export async function uploadFile({ file, path }: UploadFileProps) {
  const uploaded = await request<Record<string, unknown>>("/cloudence/files", {
    body: JSON.stringify({
      name: file.name,
      contentType: file.type,
      dataBase64: Buffer.from(await file.arrayBuffer()).toString("base64"),
    }),
    method: "POST",
  });

  revalidatePath(path);
  return normalizeFile(uploaded);
}

export async function getFiles({
  types = [],
  searchText = "",
  sort = "",
  limit,
}: GetFilesProps) {
  const params = new URLSearchParams();
  if (types.length === 1) params.set("type", types[0]);
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

export async function renameFile({ fileId, name, extension, path }: RenameFileProps) {
  const updated = await request<Record<string, unknown>>(`/cloudence/files/${fileId}`, {
    body: JSON.stringify({ name: `${name}.${extension}` }),
    method: "PATCH",
  });

  revalidatePath(path);
  return normalizeFile(updated);
}

export async function updateFileUsers({ fileId, emails, path }: UpdateFileUsersProps) {
  const updated = await request<Record<string, unknown>>(`/cloudence/files/${fileId}`, {
    body: JSON.stringify({ users: emails }),
    method: "PATCH",
  });

  revalidatePath(path);
  return normalizeFile(updated);
}

export async function deleteFile({ fileId, path }: DeleteFileProps) {
  await request(`/cloudence/files/${fileId}`, { method: "DELETE" });
  revalidatePath(path);
  return { status: "success" };
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
