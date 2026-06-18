"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import {
  Camera,
  CheckCheck,
  ChevronUp,
  CircleX,
  Clock3,
  FileText,
  Loader2,
  Maximize2,
  Paperclip,
  Search,
  Send,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const fallbackAvatar = "https://api.dicebear.com/9.x/adventurer/svg?seed=Aloha"

function createTempMessageId() {
  return `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function formatTime(value) {
  if (!value) return ""

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

function formatDate(value) {
  if (!value) return ""

  const date = new Date(value)
  const today = new Date()

  if (date.toDateString() === today.toDateString()) return "Today"

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date)
}

function getAvatar(user) {
  return user?.avatar || fallbackAvatar
}

function formatRole(roleKey) {
  return String(roleKey ?? "")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function mergeMessages(serverMessages, currentMessages) {
  const serverIds = new Set(serverMessages.map((item) => item.id))
  const localMessages = currentMessages.filter(
    (item) => item.localOnly && !serverIds.has(item.id)
  )

  return [...serverMessages, ...localMessages]
}

function appendServerMessages(currentMessages, serverMessages) {
  const currentIds = new Set(currentMessages.map((item) => item.id))
  const newMessages = serverMessages.filter((item) => !currentIds.has(item.id))

  if (!newMessages.length) return currentMessages

  return [...currentMessages, ...newMessages]
}

function prependServerMessages(currentMessages, serverMessages) {
  const currentIds = new Set(currentMessages.map((item) => item.id))
  const olderMessages = serverMessages.filter((item) => !currentIds.has(item.id))

  if (!olderMessages.length) return currentMessages

  return [...olderMessages, ...currentMessages]
}

function MessageStatus({ status }) {
  if (status === "failed") {
    return (
      <span className="inline-flex items-center text-destructive" title="Failed">
        <CircleX className="h-3.5 w-3.5" />
      </span>
    )
  }

  if (status === "sending") {
    return (
      <span className="inline-flex items-center" title="Sending">
        <Clock3 className="h-3.5 w-3.5" />
      </span>
    )
  }

  return (
    <span className="inline-flex items-center" title="Sent">
      <CheckCheck className="h-3.5 w-3.5" />
    </span>
  )
}

export default function Messages({ fullscreen = false }) {
  const t = useTranslations("messages")
  const [open, setOpen] = useState(fullscreen)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [conversationId, setConversationId] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingOlder, setLoadingOlder] = useState(false)
  const [hasMoreOlder, setHasMoreOlder] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState("")
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [clearError, setClearError] = useState("")
  const [isClearing, setIsClearing] = useState(false)
  const messageAreaRef = useRef(null)
  const messageInputRef = useRef(null)
  const searchInputRef = useRef(null)
  const attachmentInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const mountedRef = useRef(false)
  const messagesSignatureRef = useRef("")
  const latestMessageIdRef = useRef(0)
  const optimisticUrlsRef = useRef(new Set())
  const skipNextAutoScrollRef = useRef(false)
  const loadingOlderRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true

    return () => {
      for (const url of optimisticUrlsRef.current) {
        URL.revokeObjectURL(url)
      }

      optimisticUrlsRef.current.clear()
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    function handleSearch() {
      setSearchOpen(true)
      requestAnimationFrame(() => searchInputRef.current?.focus())
    }

    function handleClear() {
      setClearError("")
      setClearDialogOpen(true)
    }

    window.addEventListener("aloha-messages-search", handleSearch)
    window.addEventListener("aloha-messages-clear", handleClear)

    return () => {
      window.removeEventListener("aloha-messages-search", handleSearch)
      window.removeEventListener("aloha-messages-clear", handleClear)
    }
  }, [])

  async function confirmClearChat() {
    setIsClearing(true)
    setClearError("")
    setError("")

    try {
      const response = await fetch("/api/messages", {
        method: "DELETE",
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Could not clear the chat.")
      }

      setMessages([])
      setSearchQuery("")
      setSearchOpen(false)
      setHasMoreOlder(false)
      messagesSignatureRef.current = ""
      latestMessageIdRef.current = 0
      setClearDialogOpen(false)
    } catch (clearChatError) {
      setClearError(clearChatError.message || "Could not clear the chat.")
    } finally {
      setIsClearing(false)
    }
  }

  async function loadConversation({
    silent = false,
    afterMessageId = null,
    beforeMessageId = null,
  } = {}) {
    if (!silent) {
      setLoading(true)
      setError("")
    }

    try {
      const params = new URLSearchParams()
      if (afterMessageId) params.set("afterMessageId", String(afterMessageId))
      if (beforeMessageId) params.set("beforeMessageId", String(beforeMessageId))
      const query = params.toString() ? `?${params.toString()}` : ""
      const response = await fetch(`/api/messages${query}`, { cache: "no-store" })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Could not load messages.")
      }

      if (!mountedRef.current) return

      const nextMessages = data.messages ?? []
      const latestMessageId = nextMessages.at(-1)?.id ?? 0
      const signature = `${nextMessages.length}:${latestMessageId}`

      if (beforeMessageId) {
        setHasMoreOlder(Boolean(data.hasMoreOlder))
        if (nextMessages.length) {
          skipNextAutoScrollRef.current = true
          setMessages((currentMessages) =>
            prependServerMessages(currentMessages, nextMessages)
          )
        }
      } else if (afterMessageId) {
        if (nextMessages.length) {
          latestMessageIdRef.current = Math.max(
            latestMessageIdRef.current,
            latestMessageId
          )
          setMessages((currentMessages) =>
            appendServerMessages(currentMessages, nextMessages)
          )
        }
      } else if (messagesSignatureRef.current !== signature) {
        messagesSignatureRef.current = signature
        latestMessageIdRef.current = latestMessageId
        setHasMoreOlder(Boolean(data.hasMoreOlder))
        setMessages((currentMessages) =>
          mergeMessages(nextMessages, currentMessages)
        )
      }

      setConversationId((currentId) =>
        currentId === data.conversationId ? currentId : data.conversationId
      )
      setCurrentUser((currentUserValue) =>
        currentUserValue?.id === data.currentUser?.id
          ? currentUserValue
          : data.currentUser
      )
    } catch (loadError) {
      if (mountedRef.current) {
        setError(loadError.message || "Could not load messages.")
      }
    } finally {
      if (mountedRef.current && !silent) setLoading(false)
    }
  }

  useEffect(() => {
    if (open) loadConversation()
  }, [open])

  useEffect(() => {
    if (!open || !conversationId) return

    const events = new EventSource(
      `/api/messages/events?conversationId=${conversationId}&lastMessageId=${latestMessageIdRef.current}`
    )

    events.addEventListener("message", (event) => {
      const data = JSON.parse(event.data)

      if (data.cleared) {
        latestMessageIdRef.current = 0
        messagesSignatureRef.current = ""
        setMessages([])
        setHasMoreOlder(false)
        return
      }

      if (data.latestMessageId > latestMessageIdRef.current) {
        loadConversation({
          silent: true,
          afterMessageId: latestMessageIdRef.current,
        })
      }
    })

    return () => {
      events.close()
    }
  }, [open, conversationId])

  useEffect(() => {
    if (!messageAreaRef.current) return

    if (skipNextAutoScrollRef.current) {
      skipNextAutoScrollRef.current = false
      return
    }

    messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight
  }, [messages, open])

  useEffect(() => {
    if (!messageInputRef.current) return

    const input = messageInputRef.current
    input.style.height = "auto"
    input.style.height = `${Math.min(input.scrollHeight, 72)}px`
    input.style.overflowY = input.scrollHeight > 72 ? "auto" : "hidden"
  }, [message])

  async function handleSend() {
    const text = message.trim()
    const filesToSend = selectedFiles

    if (!text && filesToSend.length === 0) return

    const formData = new FormData()
    formData.append("body", text)

    if (conversationId) {
      formData.append("conversationId", String(conversationId))
    }

    for (const file of filesToSend) {
      formData.append("attachments", file)
    }

    const tempId = createTempMessageId()
    const optimisticAttachments = filesToSend.map((file, index) => {
      const objectUrl = URL.createObjectURL(file)
      optimisticUrlsRef.current.add(objectUrl)

      return {
        id: `${tempId}-attachment-${index}`,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        url: objectUrl,
        localOnly: true,
      }
    })
    const optimisticMessage = {
      id: tempId,
      conversationId,
      senderId: currentUser?.id,
      senderName: currentUser?.name,
      senderRoleKey: currentUser?.roleKey,
      senderAccountStatus: "active",
      senderAvatar: currentUser?.avatar,
      type: "sent",
      text,
      status: "sending",
      createdAt: new Date().toISOString(),
      attachments: optimisticAttachments,
      localOnly: true,
    }

    setMessages((prev) => [...prev, optimisticMessage])
    setMessage("")
    setSelectedFiles([])
    if (attachmentInputRef.current) attachmentInputRef.current.value = ""
    if (cameraInputRef.current) cameraInputRef.current.value = ""
    setError("")

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Could not send message.")
      }

      latestMessageIdRef.current = data.message?.id ?? latestMessageIdRef.current
      setMessages((prev) => {
        if (!data.message) {
          return prev
        }

        const hasServerMessage = prev.some((item) => item.id === data.message.id)
        const nextMessages = hasServerMessage
          ? prev.filter((item) => item.id !== tempId)
          : prev.map((item) => (item.id === tempId ? data.message : item))

        messagesSignatureRef.current = `${nextMessages.length}:${data.message.id}`
        return nextMessages
      })
      setConversationId(data.conversationId)

      for (const attachment of optimisticAttachments) {
        URL.revokeObjectURL(attachment.url)
        optimisticUrlsRef.current.delete(attachment.url)
      }
    } catch (sendError) {
      setMessages((prev) =>
        prev.map((item) =>
          item.id === tempId
            ? {
                ...item,
                status: "failed",
              }
            : item
        )
      )
      setError(sendError.message || "Could not send message.")
    }
  }

  async function loadOlderMessages() {
    if (
      loadingOlderRef.current ||
      loadingOlder ||
      !hasMoreOlder ||
      messages.length === 0
    ) {
      return
    }

    const oldestServerMessage = messages.find((item) => !item.localOnly)
    if (!oldestServerMessage) return

    const messageArea = messageAreaRef.current
    const previousScrollHeight = messageArea?.scrollHeight ?? 0

    loadingOlderRef.current = true
    setLoadingOlder(true)

    await loadConversation({
      silent: true,
      beforeMessageId: oldestServerMessage.id,
    })

    requestAnimationFrame(() => {
      if (!messageArea) return

      messageArea.scrollTop = messageArea.scrollHeight - previousScrollHeight
    })

    setLoadingOlder(false)
    loadingOlderRef.current = false
  }

  function handleMessageAreaScroll() {
    if (messageAreaRef.current?.scrollTop <= 80) {
      loadOlderMessages()
    }
  }

  function handleSelectedFiles(event) {
    setSelectedFiles((files) => [...files, ...Array.from(event.target.files ?? [])])
  }

  function removeSelectedFile(index) {
    setSelectedFiles((files) => files.filter((_, fileIndex) => fileIndex !== index))
  }

  const chatBoxClass = fullscreen
    ? "flex h-full min-h-0 flex-col overflow-hidden bg-background "
    : "fixed bottom-0 right-6 z-50 flex h-[620px] w-[430px] flex-col overflow-hidden rounded-t-xl border bg-background shadow-2xl"
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const visibleMessages = normalizedSearchQuery
    ? messages.filter((item) => {
        const text = item.text ?? ""
        const attachmentText = (item.attachments ?? [])
          .map((attachment) => attachment.fileName)
          .join(" ")

        return `${text} ${attachmentText}`
          .toLowerCase()
          .includes(normalizedSearchQuery)
      })
    : messages

  return (
    <>
      <Dialog
        open={clearDialogOpen}
        onOpenChange={(nextOpen) => {
          if (!isClearing) {
            setClearDialogOpen(nextOpen)
            if (!nextOpen) setClearError("")
          }
        }}
      >
        <DialogContent showCloseButton={!isClearing}>
          <DialogHeader>
            <DialogTitle>Clear all chats?</DialogTitle>
            <DialogDescription>
              This permanently deletes every message for all users from the
              database. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {clearError ? (
            <div
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive"
            >
              {clearError}
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isClearing}
              onClick={() => setClearDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isClearing}
              onClick={confirmClearChat}
            >
              {isClearing ? (
                <Loader2 className="animate-spin" />
              ) : null}
              {isClearing ? "Clearing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {open ? (
        <div className={chatBoxClass}>
          {!fullscreen && (
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={getAvatar(currentUser)}
                  alt={t("customer")}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{t("newMessage")}</h3>
                </div>
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
            onScroll={handleMessageAreaScroll}
            className="min-h-0 flex-1 overflow-y-auto px-2 py-3 sm:px-5 sm:py-4"
          >
            {searchOpen && (
              <div className="sticky top-0 z-10 -mx-2 mb-3 border-b bg-background/95 px-2 pb-3 backdrop-blur sm:-mx-5 sm:px-5">
                <div className="flex min-h-10 items-center gap-2 rounded-full border bg-muted/35 px-3">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search messages"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    className="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Close search"
                    onClick={() => {
                      setSearchOpen(false)
                      setSearchQuery("")
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            {loading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading messages
              </div>
            ) : visibleMessages.length === 0 ? (
              <div className="flex h-full items-center justify-center px-8 text-center text-sm text-muted-foreground">
                {normalizedSearchQuery
                  ? "No messages found."
                  : "Start a team conversation between store managers and employees."}
              </div>
            ) : (
              <div className="flex min-h-full flex-col">
                {loadingOlder && (
                  <div className="flex justify-center pb-3 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}

                <div className="mt-auto flex items-center gap-2 pb-4 sm:gap-3 sm:pb-5">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    {formatDate(visibleMessages[visibleMessages.length - 1]?.createdAt)}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="space-y-4 sm:space-y-5">
                  {visibleMessages.map((item) => (
                    <div
                      key={item.id}
                      className={`flex min-w-0 gap-2 sm:gap-3 ${
                        item.type === "sent" ? "justify-end" : "items-start"
                      }`}
                    >
                      {item.type === "received" && (
                        <img
                          src={item.senderAvatar || fallbackAvatar}
                          alt={item.senderName || t("customer")}
                          className="h-8 w-8 shrink-0 rounded-full object-cover sm:h-10 sm:w-10"
                        />
                      )}

                      <div
                        className={`min-w-0 max-w-[82%] sm:max-w-[520px] ${
                          item.type === "sent"
                            ? "rounded-2xl bg-primary px-3 py-2 text-primary-foreground sm:px-4"
                            : "rounded-2xl bg-muted px-3 py-2 sm:px-4"
                        }`}
                      >
                        {item.type !== "sent" && (
                          <div className="mb-1 flex min-w-0 items-baseline gap-2 leading-5 justify-between">
                            <span className="truncate text-sm font-semibold text-foreground">
                              {item.senderName || t("customer")}
                            </span>
                            {item.senderAccountStatus === "removed" ? (
                              <Badge
                                variant="destructive"
                                className="shrink-0 text-[10px]"
                              >
                                Removed
                              </Badge>
                            ) : item.senderAccountStatus === "inactive" ? (
                              <Badge
                                variant="outline"
                                className="shrink-0 text-[10px] text-muted-foreground"
                              >
                                Inactive
                              </Badge>
                            ) : item.senderRoleKey ? (
                              <span className="shrink-0 text-[11px] font-normal text-muted-foreground">
                                ~ {formatRole(item.senderRoleKey)}
                              </span>
                            ) : null}
                          </div>
                        )}

                        {item.text && (
                          <p className="whitespace-pre-line break-words text-sm leading-relaxed">
                            {item.text}
                          </p>
                        )}

                        {item.attachments?.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {item.attachments.map((attachment) => {
                              const isImage = attachment.mimeType?.startsWith("image/")

                              return (
                                <a
                                  key={attachment.id}
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`block overflow-hidden rounded-lg border ${
                                    item.type === "sent"
                                      ? "border-primary-foreground/20 bg-primary-foreground/10"
                                      : "border-border bg-background"
                                  }`}
                                >
                                  {isImage ? (
                                    <img
                                      src={attachment.url}
                                      alt={attachment.fileName}
                                      className="max-h-56 w-full object-cover"
                                    />
                                  ) : (
                                    <span className="flex items-center gap-2 px-3 py-2 text-xs">
                                      <FileText className="h-4 w-4 shrink-0" />
                                      <span className="truncate">
                                        {attachment.fileName}
                                      </span>
                                    </span>
                                  )}
                                </a>
                              )
                            })}
                          </div>
                        )}

                        <div
                          className={`mt-1 flex items-center justify-end gap-2 text-[11px] ${
                            item.type === "sent"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          <span>
                            {formatDate(item.createdAt)} - {formatTime(item.createdAt)}
                          </span>
                          {item.type === "sent" && (
                            <MessageStatus status={item.status} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t bg-background px-1.5 py-1.5 sm:px-3 sm:py-2">
            {error && (
              <div className="px-2 pb-2 text-xs font-medium text-destructive">
                {error}
              </div>
            )}

            {selectedFiles.length > 0 && (
              <div className="flex gap-2 overflow-x-auto px-2 pb-2">
                {selectedFiles.map((file, index) => (
                  <button
                    key={`${file.name}-${file.lastModified}-${index}`}
                    type="button"
                    onClick={() => removeSelectedFile(index)}
                    className="flex max-w-[180px] shrink-0 items-center gap-2 rounded-full border bg-muted/60 px-3 py-1.5 text-xs"
                    title="Remove file"
                  >
                    <Paperclip className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{file.name}</span>
                    <X className="h-3.5 w-3.5 shrink-0" />
                  </button>
                ))}
              </div>
            )}

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
                  accept="image/jpeg,image/png,image/webp,application/pdf"
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
                disabled={!message.trim() && selectedFiles.length === 0}
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
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={getAvatar(currentUser)}
                  alt={t("avatar")}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="truncate font-semibold">{t("newMessage")}</span>
              </div>

              <ChevronUp className="h-5 w-5 shrink-0" />
            </div>
          </button>
        )
      )}
    </>
  )
}
