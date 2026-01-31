"use client";

import { IconMessageCircle } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

interface Props {
  onStart: (name: string) => Promise<unknown>;
}

// Taqiqlangan belgilar
const FORBIDDEN_CHARS = /[,.;":/\\|`_*@#%&()^!-]/g;

// Ism validatsiyasi
function validateName(name: string): { valid: boolean; error?: string } {
  const trimmedName = name.trim();

  // Bo'sh yoki juda qisqa
  if (trimmedName.length < 3) {
    return {
      valid: false,
      error: "Ism kamida 3 ta belgidan iborat bo'lishi kerak",
    };
  }

  // Maxsus belgilar tekshiruvi
  if (FORBIDDEN_CHARS.test(trimmedName)) {
    return {
      valid: false,
      error:
        'Ismda quyidagi belgilardan foydalanish mumkin emas: , . ; " : / \\ | ` - _ * @ # % & ( ) ^ !',
    };
  }

  return { valid: true };
}

export function StartChatForm({ onStart }: Props) {
  const t = useTranslations("chat");
  const [name, setName] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName || isStarting) return;

    // Validatsiya
    const validation = validateName(trimmedName);
    if (!validation.valid) {
      setError(validation.error || "Ism noto'g'ri kiritildi");
      toast.error(validation.error || "Ism noto'g'ri kiritildi");
      return;
    }

    setError(null);
    setIsStarting(true);
    try {
      await onStart(trimmedName);
    } finally {
      setIsStarting(false);
    }
  };

  // Real-time validatsiya
  const handleNameChange = (value: string) => {
    setName(value);
    if (error) {
      const validation = validateName(value.trim());
      if (validation.valid) {
        setError(null);
      }
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
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder={t("namePlaceholder")}
            disabled={isStarting}
            className={`w-full rounded-2xl border px-5 py-4 text-center text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 disabled:opacity-50 transition-all ${
              error
                ? "border-red-500/50 bg-red-500/5 focus:border-red-500 focus:ring-red-500/20"
                : "border-white/10 bg-white/5 focus:border-primary focus:bg-white/10 focus:ring-primary/20"
            }`}
          />
          {error && (
            <p className="mt-2 text-xs text-red-400 text-center">{error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isStarting || !name.trim()}
          className="w-full rounded-2xl bg-emerald-700 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-700/25 transition-all hover:bg-emerald-800 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-700/30 active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
        >
          {isStarting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
