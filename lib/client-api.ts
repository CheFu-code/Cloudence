"use client";

import { normalizeFile } from "@/lib/cloudence-file";

export class UploadError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "UploadError";
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.chefu.co.za";

async function request(
  path: string,
  init: RequestInit,
): Promise<Record<string, unknown>> {
  const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}${path}`, {
    ...init,
    credentials: "include",
    headers: { "x-chefu-app": "cloudence" },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message || data?.error;
    throw new Error(
      Array.isArray(message)
        ? message.join(" ")
        : message || "Request failed. Please try again.",
    );
  }
  return data || {};
}

export function uploadFile(
  file: File,
  options: {
    signal?: AbortSignal;
    onProgress?: (percent: number) => void;
  } = {},
): Promise<CloudenceFile> {
  const body = new FormData();
  body.append("file", file, file.name);
  body.append("name", file.name);
  return new Promise((resolve, reject) => {
    if (options.signal?.aborted) {
      reject(new DOMException("Upload canceled.", "AbortError"));
      return;
    }
    const xhr = new XMLHttpRequest();
    const cleanup = () => options.signal?.removeEventListener("abort", cancel);
    const fail = (error: Error) => {
      cleanup();
      reject(error);
    };
    const cancel = () => {
      xhr.abort();
      fail(new DOMException("Upload canceled.", "AbortError"));
    };
    xhr.open("POST", `${API_BASE_URL.replace(/\/$/, "")}/cloudence/files`);
    xhr.withCredentials = true;
    xhr.setRequestHeader("x-chefu-app", "cloudence");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0)
        options.onProgress?.(
          Math.min(100, Math.floor((event.loaded / event.total) * 100)),
        );
    };
    xhr.upload.onload = () => options.onProgress?.(100);
    xhr.onerror = () =>
      fail(new Error("Upload failed. Check your connection and try again."));
    xhr.onabort = () =>
      fail(new DOMException("Upload canceled.", "AbortError"));
    xhr.onload = () => {
      let data: Record<string, unknown> | null = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        /* The API may return a plain-text error. */
      }
      if (xhr.status < 200 || xhr.status >= 300 || !data?.id) {
        const message = data?.message || data?.error;
        fail(
          new UploadError(
            Array.isArray(message)
              ? message.join(" ")
              : typeof message === "string"
                ? message
                : "Upload failed. Please try again.",
            xhr.status,
          ),
        );
        return;
      }
      cleanup();
      resolve(normalizeFile(data));
    };
    options.signal?.addEventListener("abort", cancel, { once: true });
    try {
      xhr.send(body);
    } catch (error) {
      fail(
        error instanceof Error
          ? error
          : new Error("Upload failed. Please try again."),
      );
    }
  });
}

export async function signOutUser(): Promise<void> {
  await request("/auth/session?global=true", { method: "DELETE" });
}
