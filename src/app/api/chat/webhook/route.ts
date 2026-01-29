import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID ?? "";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message;

    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    // Only process messages from the owner
    if (String(message.chat.id) !== TELEGRAM_CHAT_ID) {
      return NextResponse.json({ ok: true });
    }

    const text = message.text;

    // Check if this is a reply to a notification message
    if (message.reply_to_message) {
      const repliedText = message.reply_to_message.text || "";

      // Extract session ID from the replied message (last line after 🔑)
      const sessionMatch = repliedText.match(/🔑\s*([a-f0-9-]+)/);

      if (sessionMatch) {
        const sessionId = sessionMatch[1];

        // Save reply to database
        const { error } = await supabase.from("chat_messages").insert({
          session_id: sessionId,
          sender_type: "owner",
          message: text,
        });

        if (error) {
          await sendTelegramMessage(`❌ Xatolik: ${error.message}`);
        } else {
          await sendTelegramMessage("✅ Javob yuborildi!");
        }

        return NextResponse.json({ ok: true });
      }
    }

    // Check if it's a reply command: /reply session_id message
    if (text.startsWith("/reply ")) {
      const parts = text.slice(7).split(" ");
      const sessionId = parts[0];
      const replyMessage = parts.slice(1).join(" ");

      if (!sessionId || !replyMessage) {
        await sendTelegramMessage(
          "❌ Format xato. Foydalaning: /reply session_id xabar",
        );
        return NextResponse.json({ ok: true });
      }

      // Save reply to database
      const { error } = await supabase.from("chat_messages").insert({
        session_id: sessionId,
        sender_type: "owner",
        message: replyMessage,
      });

      if (error) {
        await sendTelegramMessage(`❌ Xatolik: ${error.message}`);
      } else {
        await sendTelegramMessage("✅ Javob yuborildi!");
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}

async function sendTelegramMessage(text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
    }),
  });
}
