import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("url");
  if (source) {
    try {
      const url = new URL(source, request.url);
      const path = decodeURIComponent(url.pathname);
      // Old previews must not remain accessible through the shared image cache.
      if (
        (url.hostname === "res.cloudinary.com" && path.includes("/chefu/cloudence/")) ||
        /\/cloudence\/files\/[^/]+\/content(?:\/|$)/.test(path)
      ) {
        return new NextResponse("File previews require authenticated access.", {
          status: 403,
          headers: { "Cache-Control": "private, no-store" },
        });
      }
    } catch {
      return new NextResponse("Invalid image URL.", { status: 400 });
    }
  }
  return NextResponse.next();
}

export const config = { matcher: "/_next/image" };
