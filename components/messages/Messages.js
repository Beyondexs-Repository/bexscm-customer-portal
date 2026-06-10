"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import {
  Camera,
  ChevronUp,
  Maximize2,
  Paperclip,
  Send,
  X,
} from "lucide-react"

const avatarUrl = "https://api.dicebear.com/9.x/adventurer/svg?seed=Phoebe"

const initialMessages = [
  {
    id: 1,
    type: "received",
    text: "Hi <name>, can you confirm whether the Premium Incense Sticks are available in stock?",
    time: "10:15 AM",
    date: "Today",
  },
  {
    id: 2,
    type: "sent",
    text: "Yes, it is available. Currently we have 120 packs in stock.",
    time: "10:17 AM",
    date: "Today",
  },
]

export default function Messages({ fullscreen = false }) {
  const t = useTranslations("messages")
  const [open, setOpen] = useState(fullscreen)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(initialMessages)
  const messageAreaRef = useRef(null)
  const messageInputRef = useRef(null)
  const attachmentInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  useEffect(() => {
    if (!messageAreaRef.current) return

    messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight
  }, [messages, open])

  useEffect(() => {
    if (!messageInputRef.current) return

    const input = messageInputRef.current
    input.style.height = "auto"
    input.style.height = `${Math.min(input.scrollHeight, 72)}px`
    input.style.overflowY = input.scrollHeight > 72 ? "auto" : "hidden"
  }, [message])

  function handleSend() {
    if (!message.trim()) return

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "sent",
        text: message.trim(),
        time: t("now"),
        date: t("today"),
      },
    ])

    setMessage("")
  }

  function handleSelectedFiles(event) {
    event.target.value = ""
  }

  const chatBoxClass = fullscreen
    ? "flex h-full min-h-0 flex-col overflow-hidden bg-background"
    : "fixed bottom-0 right-6 z-50 flex h-[620px] w-[430px] flex-col overflow-hidden rounded-t-xl border bg-background shadow-2xl"

  return (
    <>
      {open ? (
        <div className={chatBoxClass}>
          {!fullscreen && (
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
              <div className="flex items-center gap-3">
                <img
                  src={avatarUrl}
                  alt={t("customer")}
                  className="h-9 w-9 rounded-full"
                />
                <h3 className="font-semibold">{t("newMessage")}</h3>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/messages">
                  <button
                    type="button"
                    className="rounded-md p-1 hover:bg-muted"
                    aria-label={t("openMessagesPage")}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </Link>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md p-1 hover:bg-muted"
                  aria-label={t("closeChat")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          <div
            ref={messageAreaRef}
            className="min-h-0 flex-1 overflow-y-auto px-2 py-3 sm:px-5 sm:py-4"
          >
            <div className="flex min-h-full flex-col">
              <div className="mt-auto flex items-center gap-2 pb-4 sm:gap-3 sm:pb-5">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-semibold text-muted-foreground">
                  {t("today")}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="space-y-4 sm:space-y-5">
                {messages.map((item) => (
                  <div
                    key={item.id}
                    className={`flex min-w-0 gap-2 sm:gap-3 ${
                      item.type === "sent" ? "justify-end" : "items-start"
                    }`}
                  >
                    {item.type === "received" && (
                      <img
                        src={avatarUrl}
                        alt={t("customer")}
                        className="h-8 w-8 shrink-0 rounded-full sm:h-10 sm:w-10"
                      />
                    )}

                    <div
                      className={`min-w-0 max-w-[82%] sm:max-w-[520px] ${
                        item.type === "sent"
                          ? "rounded-2xl bg-primary px-3 py-2 text-primary-foreground sm:px-4"
                          : "rounded-2xl bg-muted px-3 py-2 sm:px-4"
                      }`}
                    >
                      <p className="whitespace-pre-line break-words text-sm leading-relaxed">
                        {item.text}
                      </p>

                      <div
                        className={`mt-1 text-right text-[11px] ${
                          item.type === "sent"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.date} - {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t bg-background px-1.5 py-1.5 sm:px-3 sm:py-2">
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
              <div className="flex min-h-11 min-w-0 flex-1 items-center gap-1 rounded-full border bg-muted/35 px-1.5 py-1.5 focus-within:ring-2 focus-within:ring-primary/30 sm:px-2">
                <button
                  type="button"
                  className="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:size-8"
                  aria-label={t("attachFile")}
                  onClick={() => attachmentInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <input
                  ref={attachmentInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleSelectedFiles}
                />

                <textarea
                  ref={messageInputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder={t("writeMessage")}
                  rows={1}
                  className="no-scrollbar min-h-8 min-w-0 flex-1 resize-none bg-transparent px-1 py-1.5 text-sm leading-5 outline-none placeholder:text-muted-foreground [overflow-wrap:anywhere]"
                />

                <button
                  type="button"
                  className="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:size-8"
                  aria-label={t("openCamera")}
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleSelectedFiles}
                />
              </div>

              <button
                type="button"
                onClick={handleSend}
                className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60 sm:size-11"
                disabled={!message.trim()}
                aria-label={t("sendMessage")}
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        !fullscreen && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="fixed bottom-0 right-6 z-50 flex w-[280px] items-center justify-between rounded-t-xl border bg-background px-4 py-2 shadow-lg"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <img
                  src={avatarUrl}
                  alt={t("avatar")}
                  className="h-8 w-8 rounded-full"
                />
                <span className="font-semibold">{t("newMessage")}</span>
              </div>

              <ChevronUp className="h-5 w-5" />
            </div>
          </button>
        )
      )}
    </>
  )
}
