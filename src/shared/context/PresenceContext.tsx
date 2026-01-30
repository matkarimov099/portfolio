"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "@/shared/lib/supabase/client";

interface PresenceState {
  visitorId: string;
  joinedAt: string;
}

interface PresenceContextType {
  onlineCount: number;
  isConnected: boolean;
}

const PresenceContext = createContext<PresenceContextType>({
  onlineCount: 0,
  isConnected: false,
});

// Unique visitor ID yaratish
function getVisitorId(): string {
  if (typeof window === "undefined") {
    return `visitor_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  const key = "visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `visitor_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export function PresenceProvider({ children }: { children: ReactNode }) {
  const [onlineCount, setOnlineCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const visitorId = getVisitorId();
    const channelName = "online-visitors";

    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: visitorId,
        },
      },
    });

    // Presence sync - barcha online foydalanuvchilarni olish
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const count = Object.keys(state).length;
      setOnlineCount(count);
    });

    // Yangi foydalanuvchi qo'shilganda
    channel.on("presence", { event: "join" }, () => {});

    // Foydalanuvchi chiqib ketganda
    channel.on("presence", { event: "leave" }, () => {});

    // Kanalga ulanish va presence track qilish
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        const presenceState: PresenceState = {
          visitorId,
          joinedAt: new Date().toISOString(),
        };

        await channel.track(presenceState);
        setIsConnected(true);
      }
    });

    // Cleanup - sahifadan chiqishda
    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <PresenceContext.Provider value={{ onlineCount, isConnected }}>
      {children}
    </PresenceContext.Provider>
  );
}

export function usePresence() {
  return useContext(PresenceContext);
}
