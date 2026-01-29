import { NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID ?? "";

export async function POST(request: Request) {
  try {
    const { sessionId, visitorName, message, device, os, browser } =
      await request.json();

    const deviceInfo =
      [device, browser, os].filter(Boolean).join(" • ") || "Desktop";

    const text = `🔔 <b>Yangi xabar</b>
<tg-spoiler>🔑 ${sessionId} • 📱 ${deviceInfo}</tg-spoiler>

👤 <b>${visitorName}</b>
<blockquote>${message}</blockquote>`;

    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML",
        }),
      },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Telegram notify error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 },
    );
  }
}
