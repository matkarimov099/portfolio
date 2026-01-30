import { NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID ?? "";

// Session ID dan qisqa hash yaratish (rasm bilan solishtirish uchun)
function getSessionHash(sessionId: string): string {
  return sessionId.slice(0, 8).toUpperCase();
}

export async function POST(request: Request) {
  try {
    const { sessionId, visitorName, message, device, os } =
      await request.json();

    // IP address olish
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || "Unknown";

    const sessionHash = getSessionHash(sessionId);
    const deviceInfo = [device, os].filter(Boolean).join(" • ") || "Desktop";

    const text = `🔔 <b>Yangi xabar</b>
<tg-spoiler>🔑 ${sessionId} • 📱 ${deviceInfo}</tg-spoiler>
🏷 <code>${sessionHash}</code> • 🌐 ${ip}

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
