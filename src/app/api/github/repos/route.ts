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

  // Use /user/repos for authenticated user (includes private repos)
  const res = await fetch(
    token
      ? `https://api.github.com/user/repos?per_page=100&sort=updated&type=owner`
      : `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=owner`,
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
