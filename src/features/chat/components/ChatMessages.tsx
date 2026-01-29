"use client";

import { IconMessageCircle } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import type { ChatMessage } from "../types";

interface Props {
  messages: ChatMessage[];
}

export function ChatMessages({ messages }: Props) {
  const t = useTranslations("chat");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
    <div className="flex-1 space-y-3 overflow-y-auto p-3 md:space-y-4 md:p-5">
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
  );
}
