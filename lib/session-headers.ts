import { cookies, headers } from "next/headers";

/** Preserve the browser's request provenance for the API's cookie CSRF check. */
export async function sessionHeaders(): Promise<Record<string, string>> {
  const [cookieStore, requestHeaders] = await Promise.all([cookies(), headers()]);
  const sessionCookies = cookieStore
    .getAll()
    .filter((cookie) => cookie.name === "__session" || cookie.name === "__session_meta")
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const result: Record<string, string> = {
    Cookie: sessionCookies,
    "x-chefu-app": "cloudence",
  };

  for (const name of ["origin", "referer"]) {
    const value = requestHeaders.get(name);
    if (value) result[name] = value;
  }

  return result;
}
