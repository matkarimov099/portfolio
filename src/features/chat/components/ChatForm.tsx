"use client";

import { IconSend } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";

interface Props {
  onSend: (message: string) => Promise<unknown>;
  disabled?: boolean;
}

export function ChatForm({ onSend, disabled }: Props) {
  const t = useTranslations("chat");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSend(message.trim());
      setMessage("");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-white/10 bg-white/5 p-3 md:p-4"
    >
      <div className="flex gap-2 md:gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("messagePlaceholder")}
          disabled={disabled || isSending}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 md:rounded-2xl md:px-5 md:py-4 md:text-base"
        />
        <button
          type="submit"
          disabled={disabled || isSending || !message.trim()}
          aria-label="Send message"
          className="flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 text-white shadow-lg shadow-emerald-700/25 transition-all hover:bg-emerald-800 hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:hover:scale-100 md:rounded-2xl md:px-5 md:py-4"
        >
          {isSending ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <IconSend size={20} aria-hidden="true" />
          )}
        </button>
      </div>
    </form>
  );
}
