const ACCOUNT_APP_URL =
  process.env.NEXT_PUBLIC_ACCOUNT_APP_URL || "https://myaccount.chefu.co.za";

export function accountAppUrl(
  path: "/login" | "/register" | "/logout",
  params: Record<string, string | undefined> = {},
) {
  const url = new URL(path, ACCOUNT_APP_URL);

  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }

  return url.toString();
}