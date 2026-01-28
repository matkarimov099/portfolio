import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");
  if (!username) {
    return NextResponse.json(
      { error: "username is required" },
      { status: 400 },
    );
  }

  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // Use /user endpoint for authenticated user
  if (token) {
    const authRes = await fetch("https://api.github.com/user", { headers });
    if (authRes.ok) {
      const authData = await authRes.json();
      if (authData.login?.toLowerCase() === username.toLowerCase()) {
        return NextResponse.json(authData);
      }
    }
  }

  // Fallback to public endpoint
  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers,
  });
  if (!res.ok) {
    return NextResponse.json(
      { error: "GitHub API error" },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
