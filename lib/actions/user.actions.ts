"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const CHEFU_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.chefu.co.za";

const CHEFU_SESSION_COOKIE_NAMES = ["__session", "__session_meta"];

function apiUrl(path: string) {
  return `${CHEFU_API_BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

async function getChefuCookieHeader() {
  const cookieStore = await cookies();
  const chefuCookies = cookieStore
    .getAll()
    .filter((cookie) => CHEFU_SESSION_COOKIE_NAMES.includes(cookie.name));

  if (!chefuCookies.length) return "";

  return chefuCookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

export async function getCurrentUser() {
  try {
    const cookieHeader = await getChefuCookieHeader();

    if (!cookieHeader) {
      return null;
    }

    const response = await fetch(apiUrl("/auth/me"), {
      cache: "no-store",
      credentials: "include",
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json().catch(() => null)) as
      | {
          user?: {
            uid?: string;
            email?: string;
            displayName?: string;
            name?: string;
            photoURL?: string | null;
          };
        }
      | null;

    const user = payload?.user;

    if (!user) {
      return null;
    }

    return {
      $id: user.uid || user.email || "cloudence-user",
      accountId: user.uid || user.email || "cloudence-user",
      fullName:
        user.displayName ||
        user.name ||
        (user.email ? user.email.split("@")[0] : "Cloudence User"),
      avatar: user.photoURL || "/assets/images/avatar-placeholder.svg",
      email: user.email || "",
      uid: user.uid || user.email || "cloudence-user",
    };
  } catch {
    return null;
  }
}

export async function signOutUser() {
  try {
    await fetch(apiUrl("/auth/session?global=true"), {
      credentials: "include",
      method: "DELETE",
    });
  } catch {
    // Intentionally swallow backend errors so the app can redirect to the sign-in screen.
  } finally {
    redirect("/sign-in");
  }
}
