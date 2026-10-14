"use server";

import { revalidatePath } from "next/cache";
import { sessionHeaders } from "@/lib/session-headers";
import { normalizeFile } from "@/lib/cloudence-file";
import { normalizeEmails, renameFilename } from "@/lib/file-input";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.chefu.co.za";

function apiUrl(path: string) {
    return `${API_BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

/** JSON fetch — adds Content-Type automatically. */
async function request<T>(
    path: string,
    init: RequestInit = {},
): Promise<T> {
    const authHeaders = await sessionHeaders();

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
        throw Object.assign(new Error(data?.message || data?.error || "Cloudence file request failed."), { status: response.status });
    }

    return data as T;
}
/** Like `request` but never throws — returns `{ error }` on failure so the
 *  message survives Next.js server-action serialisation in production. */
async function safeRequest<T = Record<string, unknown>>(
    path: string,
    init: RequestInit = {},
): Promise<T | { error: string }> {
    try {
        return await request<T>(path, init);
    } catch (err) {
        return { error: err instanceof Error ? err.message : "Something went wrong. Please try again." };
    }
}

export async function getFiles({
    types = [],
    searchText = "",
    sort = "",
    limit,
    section,
    folderId,
    offset,
}: GetFilesProps) {
    const params = new URLSearchParams();
    if (types.length === 1) {
        params.set("type", types[0]);
    } else if (types.length > 1) {
        params.set("types", types.join(","));
    }
    if (searchText) params.set("search", searchText);
    if (limit) params.set("limit", String(limit));
    if (section) params.set("section", section);
    if (folderId) params.set("folder", folderId);
    if (offset) params.set("offset", String(offset));
    params.set("sort", sort || "$createdAt-desc");

    const result = await request<{
        total: number;
        documents: Record<string, unknown>[];
        folders?: CloudenceFolder[];
        nextOffset?: number;
    }>(`/cloudence/files?${params.toString()}`);

    return {
        total: result.total,
        documents: result.documents.map(normalizeFile),
        folders: result.folders || [],
        nextOffset: result.nextOffset,
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


export async function getDashboardData() {
    const result = await request<{
        recentFiles: Record<string, unknown>[];
        quota: {
            image: { size: number; latestDate: string };
            document: { size: number; latestDate: string };
            video: { size: number; latestDate: string };
            audio: { size: number; latestDate: string };
            other: { size: number; latestDate: string };
            used: number;
            all: number;
        };
    }>("/cloudence/files/dashboard");

    return {
        recentFiles: result.recentFiles.map(normalizeFile),
        quota: result.quota,
    };
}

export async function renameFile({ fileId, name, extension, path }: RenameFileProps) {
    if (!name.trim()) return { error: "A file name is required." };
    const result = await safeRequest<Record<string, unknown>>(`/cloudence/files/${fileId}`, {
        body: JSON.stringify({ name: renameFilename(name, extension) }),
        method: "PATCH",
    });

    if ("error" in result) return result;
    revalidatePath(path);
    return normalizeFile(result);
}

export async function updateFileUsers({ fileId, emails, addEmails, removeEmails, path, shareExpiresAt }: UpdateFileUsersProps) {
    const result = await safeRequest<Record<string, unknown>>(`/cloudence/files/${fileId}`, {
        body: JSON.stringify({
            ...(emails !== undefined ? { users: normalizeEmails(emails) } : {}),
            ...(addEmails !== undefined ? { addUsers: normalizeEmails(addEmails) } : {}),
            ...(removeEmails !== undefined ? { removeUsers: normalizeEmails(removeEmails) } : {}),
            ...(shareExpiresAt !== undefined ? { shareExpiresAt } : {}),
        }),
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

export async function saveFolder(input: { section: string; name?: string; id?: string; remove?: boolean; refresh?: boolean }) {
    if (!["documents", "images", "media", "others"].includes(input.section)) return { error: "Choose a valid section." };
    const result = await safeRequest<{ status: string }>(`/cloudence/files/folders${input.id ? `/${encodeURIComponent(input.id)}` : ""}`, {
        method: input.remove ? "DELETE" : input.id ? "PATCH" : "POST",
        ...(!input.remove ? { body: JSON.stringify({ section: input.section, name: input.name }) } : {}),
    });
    if ("error" in result) return result;
    if (input.refresh !== false) revalidatePath(`/${input.section}`);
    return result;
}

export async function moveFileToFolder({ fileId, folderId, path }: { fileId: string; folderId: string | null; path: string }) {
    const result = await safeRequest<{ status: string }>(`/cloudence/files/${encodeURIComponent(fileId)}/folder`, {
        method: "PATCH", body: JSON.stringify({ folderId }),
    });
    if ("error" in result) return result;
    revalidatePath(path);
    return result;
}

export async function moveFilesToFolder({ fileIds, folderId, path }: { fileIds: string[]; folderId: string | null; path: string }) {
    if (!fileIds.length || fileIds.length > 50) return { error: "Select between 1 and 50 files." };
    const result = await safeRequest<{ status: string; moved: number }>("/cloudence/files/folders/move", {
        method: "POST", body: JSON.stringify({ fileIds, folderId }),
    });
    if ("error" in result) return result;
    revalidatePath(path);
    return result;
}

export async function cleanupFolderPlacements(path: string) {
    const result = await safeRequest<{ status: string; cleaned: number; checked: number; remaining: number }>("/cloudence/files/folders/cleanup", { method: "POST" });
    if ("error" in result) return result;
    revalidatePath(path);
    return result;
}

