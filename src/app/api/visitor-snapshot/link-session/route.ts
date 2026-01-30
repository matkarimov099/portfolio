import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN ?? "";
const telegramChatId = process.env.TELEGRAM_CHAT_ID ?? "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function getSessionHash(sessionId: string): string {
  return sessionId.slice(0, 8).toUpperCase();
}

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 },
      );
    }

    // IP address olish (Vercel va boshqa platformalar uchun)
    const ip =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("cf-connecting-ip") || // Cloudflare
      "Unknown";

    // Oxirgi 5 daqiqa ichida shu IP dan kelgan session_id yo'q snapshot'ni topish
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const { data: snapshot, error: findError } = await supabase
      .from("visitor_snapshots")
      .select("*")
      .is("session_id", null)
      .eq("ip_address", ip)
      .gte("created_at", fiveMinutesAgo)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (findError || !snapshot) {
      return NextResponse.json({ linked: false });
    }

    // Snapshot'ni session bilan bog'lash
    const { error: updateError } = await supabase
      .from("visitor_snapshots")
      .update({ session_id: sessionId })
      .eq("id", snapshot.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({ linked: false });
    }

    // Telegram xabarini yangilash
    if (snapshot.telegram_message_id) {
      const newCaption = `📸 <b>Tashrif</b>

🏷 <code>${getSessionHash(sessionId)}</code> • 🌐 ${snapshot.ip_address}
📱 ${snapshot.device} • ${snapshot.os}
📐 ${snapshot.screen_resolution} • 🕐 ${snapshot.timezone}
⏰ ${new Date(snapshot.created_at).toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}`;

      await fetch(
        `https://api.telegram.org/bot${telegramBotToken}/editMessageCaption`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            message_id: snapshot.telegram_message_id,
            caption: newCaption,
            parse_mode: "HTML",
          }),
        },
      );
    }

    return NextResponse.json({ linked: true });
  } catch (error) {
    console.error("Link session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
