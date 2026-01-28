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
    Accept: "application/vnd.github.v3+json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await fetch(
    `https://api.github.com/users/${username}/followers?per_page=100`,
    { headers },
  );
  if (!res.ok) {
    return NextResponse.json(
      { error: "GitHub API error" },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
