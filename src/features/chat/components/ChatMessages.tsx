"use client";

import { IconArrowDown, IconMessageCircle } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../types";

interface Props {
  messages: ChatMessage[];
}

export function ChatMessages({ messages }: Props) {
  const t = useTranslations("chat");
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const prevMessagesLengthRef = useRef(messages.length);

  // Scroll pozitsiyasini tekshirish
  const checkIfAtBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;

    const threshold = 100; // 100px ichida bo'lsa "pastda" deb hisoblanadi
    return (
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold
    );
  }, []);

  // Scroll event handler
  const handleScroll = useCallback(() => {
    const atBottom = checkIfAtBottom();
    setIsAtBottom(atBottom);

    // Agar pastga tushsa, yangi xabar countni tozalash
    if (atBottom) {
      setNewMessageCount(0);
    }
  }, [checkIfAtBottom]);

  // Yangi xabar kelganda
  useEffect(() => {
    const newMessagesAdded = messages.length - prevMessagesLengthRef.current;

    if (newMessagesAdded > 0) {
      if (isAtBottom) {
        // Pastda bo'lsa - auto scroll
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        // Tepada bo'lsa - badge count oshirish
        setNewMessageCount((prev) => prev + newMessagesAdded);
      }
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages.length, isAtBottom]);

  // Pastga scroll qilish funksiyasi
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setNewMessageCount(0);
  }, []);

  // Initial scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-muted-foreground">
        <IconMessageCircle size={32} className="opacity-50" />
        <p className="text-sm">{t("emptyChat")}</p>
      </div>
    );
  }

  return (
    <div className="relative flex-1">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="custom-scrollbar absolute inset-0 space-y-3 overflow-y-auto p-3 md:space-y-4 md:p-5"
      >
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
            className={`flex ${msg.sender_type === "visitor" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm md:max-w-[75%] md:px-5 md:py-3 ${
                msg.sender_type === "visitor"
                  ? "rounded-br-md bg-primary text-primary-foreground shadow-primary/20"
                  : "rounded-bl-md bg-white/10 text-foreground"
              }`}
            >
              <p className="text-sm leading-relaxed md:text-base">
                {msg.message}
              </p>
              <p
                className={`mt-1.5 text-[10px] md:text-xs ${
                  msg.sender_type === "visitor"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {new Date(msg.created_at).toLocaleTimeString("uz-UZ", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Pastga tushish tugmasi */}
      <AnimatePresence>
        {!isAtBottom && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-3 right-3 flex items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/25 transition-transform hover:scale-110 md:bottom-4 md:right-4 h-9 w-9 md:h-10 md:w-10"
          >
            <IconArrowDown size={18} className="text-primary-foreground" />

            {/* Yangi xabar badge */}
            {newMessageCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {newMessageCount > 9 ? "9+" : newMessageCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
