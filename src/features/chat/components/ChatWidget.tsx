"use client";

import {
  IconMaximize,
  IconMessageCircle,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useChat } from "../hooks/use-chat";
import { ChatForm } from "./ChatForm";
import { ChatMessages } from "./ChatMessages";
import { StartChatForm } from "./StartChatForm";

export function ChatWidget() {
  const t = useTranslations("chat");
  const router = useRouter();
  const pathname = usePathname();
  const {
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
  } = useChat();

  // Chat sahifasida bo'lsa - /chat yoki /uz/chat yoki /en/chat
  const isOnChatPage = pathname?.endsWith("/chat");

  // Chat sahifasida bo'lsa xabarlarni o'qilgan deb belgilash
  useEffect(() => {
    if (isOnChatPage) {
      markAsRead();
    }
  }, [isOnChatPage, markAsRead]);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setWidgetOpen(true)}
        aria-label={t("title")}
        className={`fixed bottom-6 right-4 z-50 flex items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 ring-2 ring-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 md:bottom-6 md:right-6 md:p-4 ${isWidgetOpen ? "hidden" : ""} h-12 w-12 md:h-14 md:w-14`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <IconMessageCircle
          className="h-5 w-5 text-primary-foreground md:h-6 md:w-6"
          aria-hidden="true"
        />

        {/* Unread Badge - chat sahifasida ko'rsatmaslik */}
        {unreadCount > 0 && !isOnChatPage && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isWidgetOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-50 flex h-112.5 w-[calc(100vw-2rem)] max-w-90 flex-col overflow-hidden rounded-2xl border border-white/10 bg-background/95 shadow-2xl backdrop-blur-xl md:bottom-6 md:right-6 md:h-125 md:w-90"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-primary/10 px-4 py-3">
              <div>
                <p className="font-medium text-foreground">{t("title")}</p>
                <p className="text-xs text-muted-foreground">
                  {session ? t("chatting") : t("offline")}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    router.push("/chat");
                    setWidgetOpen(false);
                  }}
                  className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                  aria-label={t("maximize") || "Maximize"}
                >
                  <IconMaximize size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setWidgetOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                  aria-label="Close chat"
                >
                  <IconX size={20} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : session ? (
              <>
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
                  <p className="text-sm text-muted-foreground">
                    {session.visitor_name}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={clearMessages}
                      className="rounded p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                      aria-label={t("clearChat")}
                    >
                      <IconTrash size={14} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={endSession}
                      className="rounded p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                      aria-label={t("newChat")}
                    >
                      <IconPlus size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <ChatMessages messages={messages} />
                <ChatForm onSend={sendMessage} />
              </>
            ) : (
              <StartChatForm onStart={startSession} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
