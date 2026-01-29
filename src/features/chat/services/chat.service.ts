import { UAParser } from "ua-parser-js";
import { supabase } from "@/shared/lib/supabase/client";
import type {
  ChatMessage,
  ChatSession,
  CreateSessionInput,
  SendMessageInput,
} from "../types";

export const chatService = {
  async createSession(input: CreateSessionInput): Promise<ChatSession> {
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({ visitor_name: input.visitor_name })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSession(sessionId: string): Promise<ChatSession | null> {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error) return null;
    return data;
  },

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async sendMessage(input: SendMessageInput): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        session_id: input.session_id,
        sender_type: input.sender_type,
        message: input.message,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async notifyTelegram(
    sessionId: string,
    visitorName: string,
    message: string,
  ): Promise<void> {
    const parser = new UAParser(navigator.userAgent);
    const result = parser.getResult();

    // Device info (without emoji)
    const deviceType = result.device.type || "desktop";
    const deviceVendor = result.device.vendor || "";
    const deviceModel = result.device.model || "";

    let device = `${deviceVendor} ${deviceModel}`.trim();
    if (!device) {
      device =
        deviceType === "mobile"
          ? "Mobile"
          : deviceType === "tablet"
            ? "Tablet"
            : "Desktop";
    }

    // OS info
    const os = result.os.name
      ? `${result.os.name} ${result.os.version || ""}`.trim()
      : "";

    // Browser info
    const browser = result.browser.name
      ? `${result.browser.name} ${result.browser.version || ""}`.trim()
      : "";

    await fetch("/api/chat/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        visitorName,
        message,
        device,
        os,
        browser,
      }),
    });
  },
};
