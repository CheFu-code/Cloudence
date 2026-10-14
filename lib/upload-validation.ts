import { BLOCKED_EXTENSIONS, MAX_FILE_SIZE } from "@/constants";

export function validateUploadFile(file: {
  name: string;
  size: number;
}): string | null {
  const ext = file.name.includes(".")
    ? file.name.split(".").pop()!.toLowerCase()
    : "";
  if (BLOCKED_EXTENSIONS.has(ext))
    return `${file.name}: .${ext} files are blocked.`;
  let maxBytes = MAX_FILE_SIZE;
  let label = "50 MB";
  if (ext === "svg") {
    maxBytes = 5 * 1024 * 1024;
    label = "5 MB for SVGs";
  } else if (
    [
      "txt",
      "json",
      "xml",
      "yaml",
      "yml",
      "md",
      "csv",
      "log",
      "env",
      "conf",
    ].includes(ext)
  ) {
    maxBytes = 10 * 1024 * 1024;
    label = "10 MB for text/data files";
  } else if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
    maxBytes = 20 * 1024 * 1024;
    label = "20 MB for images";
  } else if (
    ["pdf", "docx", "xlsx", "pptx", "doc", "xls", "ppt"].includes(ext)
  ) {
    maxBytes = 25 * 1024 * 1024;
    label = "25 MB for documents";
  }
  return file.size > maxBytes
    ? `${file.name} exceeds the ${label} limit.`
    : null;
}
