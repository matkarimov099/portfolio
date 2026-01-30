"use client";

import { IconMessageCircle, IconPlus, IconTrash } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useChat } from "../hooks/use-chat";
import { ChatForm } from "./ChatForm";
import { ChatMessages } from "./ChatMessages";
import { StartChatForm } from "./StartChatForm";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function ChatSection() {
  const t = useTranslations("chat");
  const {
    session,
    messages,
    isLoading,
    startSession,
    sendMessage,
    clearMessages,
    endSession,
    markAsRead,
  } = useChat();

  // Chat sahifasida xabarlarni darhol o'qilgan deb belgilash
  useEffect(() => {
    markAsRead();
  }, [markAsRead]);

  if (isLoading) {
    return (
      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8 md:py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-10px)] flex-col px-4 pb-14 pt-4 md:pb-2 md:pt-2">
      <div className="mx-auto w-full max-w-2xl flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          className="mb-2 text-center md:mb-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
            <IconMessageCircle size={18} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              {t("title")}
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
            {t("subtitle")}
          </h2>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-white/10 to-white/5 shadow-2xl backdrop-blur-xl md:rounded-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
          style={{ minHeight: "500px", maxHeight: "calc(100vh - 200px)" }}
        >
          {session ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3 md:px-6 md:py-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                      {session.visitor_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {session.visitor_name}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      {t("chatting")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={clearMessages}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                    aria-label={t("clearChat")}
                  >
                    <IconTrash size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={endSession}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                    aria-label={t("newChat")}
                  >
                    <IconPlus size={16} aria-hidden="true" />
                    <span className="hidden sm:inline">{t("newChat")}</span>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <ChatMessages messages={messages} />

              {/* Input */}
              <ChatForm onSend={sendMessage} />
            </>
          ) : (
            <StartChatForm onStart={startSession} />
          )}
        </motion.div>
      </div>
    </section>
  );
}
