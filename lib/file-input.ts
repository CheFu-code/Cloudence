export function normalizeEmails(emails: string[]): string[] {
  return [
    ...new Set(
      emails.map((email) => email.trim().toLowerCase()).filter(Boolean),
    ),
  ];
}

export function addRecipients(
  existing: string[],
  additions: string[],
): string[] {
  return normalizeEmails([...existing, ...additions]);
}

export function removeRecipient(existing: string[], email: string): string[] {
  return normalizeEmails(existing).filter(
    (recipient) => recipient !== email.trim().toLowerCase(),
  );
}

export function invalidEmails(emails: string[]): string[] {
  return normalizeEmails(emails).filter(
    (email) => !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
  );
}

export function localDateTime(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function renameFilename(name: string, extension: string): string {
  const filename = name.trim();
  const suffix = extension ? `.${extension}` : "";
  if (
    !filename ||
    !suffix ||
    filename.toLowerCase().endsWith(suffix.toLowerCase())
  )
    return filename;
  return `${filename}${suffix}`;
}
