"use client";

import { IconMessageCircle } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";

interface Props {
  onStart: (name: string) => Promise<unknown>;
}

export function StartChatForm({ onStart }: Props) {
  const t = useTranslations("chat");
  const [name, setName] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isStarting) return;

    setIsStarting(true);
    try {
      await onStart(name.trim());
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-1 flex-col items-center justify-center p-6 md:p-10"
    >
      {/* Animated Icon */}
      <motion.div
        className="relative mb-8"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
        <div className="relative rounded-full bg-linear-to-br from-primary/30 to-primary/10 p-5">
          <IconMessageCircle size={56} className="text-primary" />
        </div>
      </motion.div>

      {/* Text */}
      <h3 className="mb-3 text-xl font-bold text-foreground md:text-2xl">
        {t("startTitle")}
      </h3>
      <p className="mb-8 max-w-sm text-center text-sm text-muted-foreground md:text-base">
        {t("startDescription")}
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("namePlaceholder")}
            disabled={isStarting}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={isStarting || !name.trim()}
          className="w-full rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
        >
          {isStarting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              {t("starting")}
            </span>
          ) : (
            t("startChat")
          )}
        </button>
      </form>
    </motion.div>
  );
}
