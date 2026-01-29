"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "@/shared/lib/supabase/client";
import { chatService } from "../services/chat.service";
import type { ChatMessage, ChatSession } from "../types";

const SESSION_KEY = "chat_session_id";

interface ChatContextType {
  session: ChatSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  startSession: (visitorName: string) => Promise<ChatSession>;
  sendMessage: (message: string) => Promise<ChatMessage | undefined>;
  clearMessages: () => Promise<void>;
  endSession: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing session from localStorage
  useEffect(() => {
    const loadSession = async () => {
      const sessionId = localStorage.getItem(SESSION_KEY);
      if (sessionId) {
        const existingSession = await chatService.getSession(sessionId);
        if (existingSession?.is_active) {
          setSession(existingSession);
          const msgs = await chatService.getMessages(sessionId);
          setMessages(msgs);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
      setIsLoading(false);
    };
    loadSession();
  }, []);

  // Real-time subscription
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel(`chat-${session.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${session.id}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const startSession = useCallback(async (visitorName: string) => {
    const newSession = await chatService.createSession({
      visitor_name: visitorName,
    });
    localStorage.setItem(SESSION_KEY, newSession.id);
    setSession(newSession);
    setMessages([]);
    return newSession;
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!session) return;

      const newMessage = await chatService.sendMessage({
        session_id: session.id,
        sender_type: "visitor",
        message,
      });

      await chatService.notifyTelegram(
        session.id,
        session.visitor_name,
        message,
      );

      return newMessage;
    },
    [session],
  );

  const clearMessages = useCallback(async () => {
    if (!session) return;

    await supabase.from("chat_messages").delete().eq("session_id", session.id);

    setMessages([]);
  }, [session]);

  const endSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        session,
        messages,
        isLoading,
        startSession,
        sendMessage,
        clearMessages,
        endSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
