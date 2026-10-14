export const MAX_UPLOAD_FILES = 15;
export const UPLOAD_CONCURRENCY = 3;

/** Workers take the next file only after their current upload completes. */
export async function runUploadQueue<T>(
  entries: T[],
  upload: (entry: T) => Promise<void>,
): Promise<void> {
  let next = 0;
  async function worker() {
    while (next < entries.length) {
      const entry = entries[next++];
      await upload(entry);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(UPLOAD_CONCURRENCY, entries.length) }, () =>
      worker(),
    ),
  );
}
