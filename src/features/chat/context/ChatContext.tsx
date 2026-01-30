"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useCamera } from "@/shared/context/CameraContext";
import { supabase } from "@/shared/lib/supabase/client";
import { chatService } from "../services/chat.service";
import type { ChatMessage, ChatSession } from "../types";

const SESSION_KEY = "chat_session_id";

interface ChatContextType {
  session: ChatSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  unreadCount: number;
  isWidgetOpen: boolean;
  startSession: (visitorName: string) => Promise<ChatSession>;
  sendMessage: (message: string) => Promise<ChatMessage | undefined>;
  clearMessages: () => Promise<void>;
  endSession: () => void;
  setWidgetOpen: (open: boolean) => void;
  markAsRead: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const isWidgetOpenRef = useRef(false);
  const { captureForSession } = useCamera();

  // Ref ni state bilan sync qilish
  useEffect(() => {
    isWidgetOpenRef.current = isWidgetOpen;
  }, [isWidgetOpen]);

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

          // Owner dan xabar kelganda va widget yopiq bo'lsa unread count oshirish
          if (newMessage.sender_type === "owner" && !isWidgetOpenRef.current) {
            setUnreadCount((prev) => prev + 1);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const startSession = useCallback(
    async (visitorName: string) => {
      const newSession = await chatService.createSession({
        visitor_name: visitorName,
      });
      localStorage.setItem(SESSION_KEY, newSession.id);
      setSession(newSession);
      setMessages([]);

      // Birinchi rasmni session bilan bog'lash (IP orqali)
      fetch("/api/visitor-snapshot/link-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: newSession.id }),
      }).catch(() => {});

      // Yangi session uchun yangi rasm olish (agar kamera mavjud bo'lsa)
      captureForSession(newSession.id).catch(() => {});

      return newSession;
    },
    [captureForSession],
  );

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
    setUnreadCount(0);
  }, []);

  const setWidgetOpen = useCallback((open: boolean) => {
    setIsWidgetOpen(open);
    if (open) {
      setUnreadCount(0);
    }
  }, []);

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        session,
        messages,
        isLoading,
        unreadCount,
        isWidgetOpen,
        startSession,
        sendMessage,
        clearMessages,
        endSession,
        setWidgetOpen,
        markAsRead,
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
