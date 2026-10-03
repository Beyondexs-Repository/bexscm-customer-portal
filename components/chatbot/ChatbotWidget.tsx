"use client"
import { getCustomerNumber } from "@/lib/customer"

import * as React from "react"
import {
  BotIcon,
  ChevronDownIcon,
  Loader2Icon,
  MicIcon,
  MicOffIcon,
  PackageIcon,
  SendIcon,
  SparklesIcon,
  UploadCloudIcon,
  XIcon,
  ReceiptIcon,
  ShoppingBagIcon,
  PaperclipIcon,
  FilmIcon,
  MusicIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  ImageIcon,
  FileIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useCart } from "@/app/context/app-context"
import { sendChatMessage } from "@/lib/api/chatApi"
import { postMessageApi, isOrderPlacementText, extractRecentItemNames } from "@/lib/api/messagesApi"
import { postImportApi } from "@/lib/api/importApi"





export interface AttachedFileItem {
  id: string
  file: File
  name: string
  size: string
  extension: string
  type: "document" | "image" | "video" | "audio" | "other"
  url: string
}

export interface ChatMessage {
  id: string
  sender: "bot" | "user"
  text: string
  time: string
  attachments?: AttachedFileItem[]
}

interface ISpeechRecognitionResult {
  0: {
    transcript: string
  }
}

interface ISpeechRecognitionEvent {
  results: ArrayLike<ISpeechRecognitionResult>
}

interface ISpeechRecognitionErrorEvent {
  error: string
}

interface ISpeechRecognition {
  continuous: boolean
  interimResults: boolean
  lang: string
  onstart: (() => void) | null
  onresult: ((event: ISpeechRecognitionEvent) => void) | null
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "Hello! 👋 I'm your Bex SCM AI Assistant. How can I help you with your orders, catalog, or account today? You can also upload documents, CSVs, MP3, or MP4 audio attachments directly in our chat!",
    time: "Just now",
  },
]

const QUICK_PROMPTS = [
  { label: "Upload File / Import", icon: UploadCloudIcon, text: "Upload document or file", isUpload: true },
  { label: "Check Order Status", icon: PackageIcon, text: "How can I check my recent order status?", isUpload: false },
  { label: "Browse Catalog", icon: ShoppingBagIcon, text: "Where can I find fresh seafood and meat products?", isUpload: false },
  { label: "View Invoices", icon: ReceiptIcon, text: "How do I review my pending invoices?", isUpload: false },
]

const getFileType = (ext: string, mimeType: string): AttachedFileItem["type"] => {
  const e = ext.toLowerCase()
  if (["mp3", "mp4", "wav", "ogg", "m4a", "aac", "flac", "wma"].includes(e) || mimeType.startsWith("audio/")) {
    return "audio"
  }
  if (["png", "jpg", "jpeg", "webp", "gif", "svg", "bmp"].includes(e) || mimeType.startsWith("image/")) {
    return "image"
  }
  if (["csv", "xls", "xlsx", "pdf", "doc", "docx", "txt", "rtf", "json"].includes(e)) {
    return "document"
  }
  return "other"
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

export function ChatbotWidget() {
  const cartContext = (useCart() as unknown) as {
    importDocumentCartApi?: (params: { file: File; custnmbr?: string }) => Promise<unknown>
    fetchCustomerCart?: (custnmbr?: string) => Promise<unknown>
  }
  const importDocumentCartApi = cartContext?.importDocumentCartApi
  const fetchCustomerCart = cartContext?.fetchCustomerCart

  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [inputValue, setInputValue] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const [isListening, setIsListening] = React.useState(false)
  const [dragActive, setDragActive] = React.useState(false)
  const [pendingAttachments, setPendingAttachments] = React.useState<AttachedFileItem[]>([])

  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const msgCounterRef = React.useRef(1)
  const recognitionRef = React.useRef<ISpeechRecognition | null>(null)
  const transcriptRef = React.useRef("")
  const attachmentInputRef = React.useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen, pendingAttachments])

  const renderFileIcon = (type: AttachedFileItem["type"], ext: string) => {
    switch (type) {
      case "video":
        return <FilmIcon className="size-4 text-purple-500 shrink-0" />
      case "audio":
        return <MusicIcon className="size-4 text-amber-500 shrink-0" />
      case "image":
        return <ImageIcon className="size-4 text-sky-500 shrink-0" />
      case "document":
        if (["csv", "xls", "xlsx"].includes(ext)) {
          return <FileSpreadsheetIcon className="size-4 text-emerald-500 shrink-0" />
        }
        return <FileTextIcon className="size-4 text-blue-500 shrink-0" />
      default:
        return <FileIcon className="size-4 text-muted-foreground shrink-0" />
    }
  }

  const getBotResponse = (userText: string): string => {
    const text = userText.toLowerCase()

    if (text.includes("order") || text.includes("status") || text.includes("track")) {
      return "You can view, search, and track your live customer orders on the 'My Orders' page."
    }
    if (text.includes("import") || text.includes("upload") || text.includes("csv") || text.includes("excel")) {
      return "You can upload documents, CSVs, or images right here in our chat or via the header Upload button to extract items into your cart automatically!"
    }
    if (text.includes("catalog") || text.includes("product") || text.includes("seafood") || text.includes("meat")) {
      return "Our 'Catalog' section features fresh produce, Certified Angus Beef, fresh seafood, and poultry with live pricing and availability."
    }
    if (text.includes("invoice") || text.includes("payment") || text.includes("bill")) {
      return "Check out the 'Invoices' tab to review invoice totals, payment balances, due dates, and download receipt records."
    }
    if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
      return "Hello! Great to assist you today. What product, order detail, or file attachment can I help you with?"
    }

    return "Thanks for reaching out! I'm here to help with order tracking, item catalog inquiries, file uploads/cart imports, MP4 videos, and invoices. Is there a specific feature you'd like to explore?"
  }

  const handleSendMessage = React.useCallback(
    async (textToSend?: string, customAttachments?: AttachedFileItem[]) => {
      const messageText = (textToSend || inputValue).trim()
      const activeAttachments = customAttachments || pendingAttachments

      if (!messageText && activeAttachments.length === 0) return
      if (isTyping) return

      const userMsgId = `user-msg-${msgCounterRef.current++}`
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      const promptText = messageText || (activeAttachments.length > 0 ? `Attached ${activeAttachments.length} file(s)` : "")

      const userMsg: ChatMessage = {
        id: userMsgId,
        sender: "user",
        text: promptText,
        time: now,
        attachments: activeAttachments.length > 0 ? [...activeAttachments] : undefined,
      }

      // Build history payload before updating messages state
      const historyPayload = messages
        .filter((m) => m.id !== "welcome-1" && Boolean(m.text))
        .map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        }))

      setMessages((prev) => [...prev, userMsg])
      if (!textToSend) setInputValue("")
      setPendingAttachments([])

      // Intercept customer credentials queries (customer number / email address)
      const cleanPrompt = promptText.trim().toLowerCase()
      if (
        cleanPrompt === getCustomerNumber() ||
        cleanPrompt === "customer number" ||
        cleanPrompt === `customer number ${getCustomerNumber()}` ||
        cleanPrompt === "email address" ||
        cleanPrompt === "customer email"
      ) {
        const botMsgId = `bot-msg-${msgCounterRef.current++}`
        const botMsg: ChatMessage = {
          id: botMsgId,
          sender: "bot",
          text: `Your customer number is ${getCustomerNumber()}. What order number or cart items would you like me to process?`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        setMessages((prev) => [...prev, botMsg])
        return
      }

      setIsTyping(true)

      // Call Crate Import API (https://crateapi.bexlgems.com/api/import) for attached files
      let importSuccess = false
      let importApiReply = ""
      let totalAddedCount = 0

      if (activeAttachments.length > 0) {
        for (const att of activeAttachments) {
          try {
            toast.info(`Uploading & importing ${att.name}...`)
            const importRes = await postImportApi({
              file: att.file,
              custnmbr: getCustomerNumber(),
            })

            if (importRes) {
              importSuccess = true
              if (Array.isArray(importRes.added) && importRes.added.length > 0) {
                totalAddedCount += importRes.added.length
              }
              const resText = importRes.reply || importRes.message
              if (resText) {
                importApiReply += (importApiReply ? "\n\n" : "") + resText
              }
            }
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "Import failed"
            console.error(`Import API error for ${att.name}:`, err)
            toast.error(`Import failed for ${att.name}: ${errorMsg}`)
          }
        }

        if (importSuccess && typeof fetchCustomerCart === "function") {
          await fetchCustomerCart(getCustomerNumber())
          if (totalAddedCount > 0) {
            toast.success(`Successfully imported ${totalAddedCount} item(s) into your cart!`)
          }
        }
      }

      // Check if message is an order placement request (e.g. "place order", "prepare order", "add top 5 items", "yes order this")
      let replyText = importApiReply
      if (!replyText && isOrderPlacementText(promptText)) {
        try {
          let messageToPost = promptText

          // Extract prior listed item names from conversation history if prompt is a relative order command
          const recentItems = extractRecentItemNames(messages)
          if (recentItems.length > 0 && !recentItems.some((it) => promptText.toLowerCase().includes(it.toLowerCase()))) {
            const qtyMatch = promptText.match(/\d+/)
            const qty = qtyMatch ? qtyMatch[0] : "10"
            messageToPost = `Please add ${qty} quantity of each: ${recentItems.join(", ")}`
          }

          const msgResponse = await postMessageApi({
            message: messageToPost,
            custnmbr: getCustomerNumber(),
          })

          if (msgResponse && msgResponse.reply) {
            replyText = msgResponse.reply
          }

          if (msgResponse && Array.isArray(msgResponse.added) && msgResponse.added.length > 0) {
            if (typeof fetchCustomerCart === "function") {
              await fetchCustomerCart(getCustomerNumber())
            }
            toast.success(`Added ${msgResponse.added.length} item(s) to your cart!`)
          }
        } catch (msgErr: unknown) {
          console.warn("Messages API call failed, attempting Chat API fallback:", msgErr)
        }
      }

      // If not an order request or Messages/Import API yielded no reply, call Chat API (https://crateapi.bexlgems.com/api/Chat)
      if (!replyText) {
        try {
          const apiResponse = await sendChatMessage({
            message: promptText,
            customerNumber: getCustomerNumber(),
            email: "",
            history: historyPayload,
          })

          if (apiResponse && apiResponse.reply) {
            replyText = apiResponse.reply
          } else {
            replyText = getBotResponse(messageText)
          }
        } catch (apiErr: unknown) {
          console.warn("Chat API call failed, using fallback bot response:", apiErr)
          replyText = getBotResponse(messageText)
        }
      }

      if (activeAttachments.length > 0 && !importApiReply) {
        const mediaTypes = Array.from(new Set(activeAttachments.map((a) => a.type)))
        const mediaDetails = activeAttachments.map((a) => `${a.name} (${a.size})`).join(", ")

        const cleanLLMReply = replyText.replace(/I currently cannot process or view attached files\.[^.]*\.?/gi, "").trim()
        if (mediaTypes.includes("audio")) {
          replyText = `${cleanLLMReply ? cleanLLMReply + "\n\n" : ""}🎵 Audio Received: Attached (${mediaDetails}). You can play your audio directly in chat.`
        } else if (mediaTypes.includes("image")) {
          replyText = `${cleanLLMReply ? cleanLLMReply + "\n\n" : ""}🖼️ Image Attached: Received image file(s) (${mediaDetails}).`
        } else if (cleanLLMReply) {
          replyText = `${cleanLLMReply}\n\n📎 Attached files (${mediaDetails}).`
        } else {
          replyText = `📎 Attached files (${mediaDetails}).`
        }
      }

      const botMsgId = `bot-msg-${msgCounterRef.current++}`
      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: "bot",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    },
    [inputValue, isTyping, pendingAttachments, importDocumentCartApi, fetchCustomerCart, messages]
  )

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const fileList = Array.from(e.target.files)
    const newAttachments: AttachedFileItem[] = fileList.map((file) => {
      const ext = (file.name.split(".").pop() || "").toLowerCase()
      const type = getFileType(ext, file.type)
      return {
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: formatFileSize(file.size),
        extension: ext,
        type,
        url: URL.createObjectURL(file),
      }
    })

    setPendingAttachments((prev) => [...prev, ...newAttachments])
    e.target.value = ""
  }

  const removePendingAttachment = (id: string) => {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileList = Array.from(e.dataTransfer.files)
      const newAttachments: AttachedFileItem[] = fileList.map((file) => {
        const ext = (file.name.split(".").pop() || "").toLowerCase()
        const type = getFileType(ext, file.type)
        return {
          id: Math.random().toString(36).substring(2, 9),
          file,
          name: file.name,
          size: formatFileSize(file.size),
          extension: ext,
          type,
          url: URL.createObjectURL(file),
        }
      })
      setPendingAttachments((prev) => [...prev, ...newAttachments])
    }
  }

  // Initialize Web Speech API for Voice Input
  React.useEffect(() => {
    if (typeof window === "undefined") return

    const windowObj = window as unknown as Record<string, unknown>
    const SpeechRecognitionClass = (windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition) as {
      new (): ISpeechRecognition
    } | undefined

    if (SpeechRecognitionClass) {
      const recognition = new SpeechRecognitionClass()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onstart = () => {
        setIsListening(true)
        transcriptRef.current = ""
      }

      recognition.onresult = (event: ISpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result: ISpeechRecognitionResult) => result[0].transcript)
          .join("")
        transcriptRef.current = transcript
      }

      recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
        console.warn("Speech recognition error:", event.error)
        setIsListening(false)
        if (event.error === "not-allowed") {
          toast.error("Microphone access denied. Please allow microphone permissions.")
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        const spokenText = transcriptRef.current.trim()
        if (spokenText) {
          handleSendMessage(spokenText)
          transcriptRef.current = ""
        }
      }

      recognitionRef.current = recognition
    }
  }, [handleSendMessage])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
        toast.info("Listening... Speak now to send your voice message directly to chat.")
      } catch (err) {
        console.warn("Error starting speech recognition:", err)
        setIsListening(false)
      }
    } else {
      setIsListening(true)
      toast.info("Listening to your voice...")
      setTimeout(() => {
        setIsListening(false)
        handleSendMessage("How can I check my recent order status?")
      }, 1500)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Hidden File Input for Attachments */}
      <input
        ref={attachmentInputRef}
        type="file"
        multiple
        accept=".csv,.xlsx,.xls,.pdf,.png,.jpg,.jpeg,.gif,.webp,.doc,.docx,.mp3,.mp4,.wav,.ogg,.m4a,.aac,.flac,image/*,audio/*"
        onChange={handleAttachmentChange}
        className="hidden"
      />

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-20 right-4 z-50 sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="group relative flex size-13 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-emerald-600 text-primary-foreground shadow-xl shadow-primary/30 outline-none transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={isOpen ? "Close AI Chatbot" : "Open AI Chatbot"}
        >
          {isOpen ? (
            <XIcon className="size-6 transition-transform duration-200 group-hover:rotate-90" />
          ) : (
            <>
              <BotIcon className="size-6 transition-transform duration-200 group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center">
                <span className="absolute size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* Chatbot Window Panel */}
      {isOpen && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`fixed bottom-36 right-4 z-50 flex h-[34rem] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border bg-card/95 backdrop-blur-md text-card-foreground shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 sm:bottom-22 sm:right-6 sm:w-96 ${
            dragActive ? "ring-2 ring-primary ring-offset-2 bg-primary/5" : ""
          }`}
        >
          {/* Drag & Drop Overlay */}
          {dragActive && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-card/90 p-6 text-center backdrop-blur-xs">
              <UploadCloudIcon className="size-12 animate-bounce text-primary mb-2" />
              <p className="text-sm font-bold text-foreground">Drop files here to attach</p>
              <p className="text-xs text-muted-foreground mt-1">Supports Documents, Images, MP3 & MP4 Audio</p>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <SparklesIcon className="size-5 text-primary" />
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight text-foreground">AI Assistant</h3>
                <p className="text-[11px] text-muted-foreground">Always active to support you</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsOpen(false)}
              className="size-7 rounded-full text-muted-foreground hover:text-foreground"
            >
              <ChevronDownIcon className="size-4" />
            </Button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
                    <BotIcon className="size-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "rounded-br-none bg-primary text-primary-foreground shadow-xs"
                      : "rounded-bl-none border bg-muted/60 text-foreground shadow-2xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Render Message Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2.5 space-y-2">
                      {msg.attachments.map((att) => (
                        <div
                          key={att.id}
                          className={`overflow-hidden rounded-xl border p-2 text-[11px] shadow-2xs ${
                            msg.sender === "user" ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground" : "bg-card border-border text-card-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2 font-medium">
                            {renderFileIcon(att.type, att.extension)}
                            <span className="truncate flex-1 font-semibold" title={att.name}>
                              {att.name}
                            </span>
                            <span className="text-[9px] opacity-80">{att.size}</span>
                          </div>

                          {/* MP4 Video Player */}
                          {att.type === "video" && (
                            <div className="mt-1.5 overflow-hidden rounded-lg bg-black">
                              <video
                                controls
                                preload="metadata"
                                src={att.url}
                                className="max-h-48 w-full rounded-lg object-contain"
                              >
                                Your browser does not support video playback.
                              </video>
                            </div>
                          )}

                          {/* Audio Player */}
                          {att.type === "audio" && (
                            <div className="mt-1.5 rounded-lg bg-muted/60 p-1">
                              <audio
                                controls
                                preload="metadata"
                                src={att.url}
                                className="h-8 w-full accent-primary"
                              >
                                Your browser does not support audio playback.
                              </audio>
                            </div>
                          )}

                          {/* Image Preview */}
                          {att.type === "image" && (
                            <div className="mt-1.5 overflow-hidden rounded-lg border bg-muted">
                              <img
                                src={att.url}
                                alt={att.name}
                                className="max-h-44 max-w-full rounded-lg object-cover"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <span
                    className={`mt-1 block text-[9px] ${
                      msg.sender === "user" ? "text-primary-foreground/75 text-right" : "text-muted-foreground"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BotIcon className="size-4" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl border bg-muted/50 px-3 py-2">
                  <Loader2Icon className="size-3.5 animate-spin text-primary" />
                  <span className="text-[11px]">AI is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Listening Banner */}
          {isListening && (
            <div className="flex items-center justify-between border-t bg-red-50 dark:bg-red-950/40 px-3 py-2 text-xs text-red-600 dark:text-red-300">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
                </span>
                <span className="font-medium text-[11px]">Listening... Speak into microphone</span>
              </div>
              <button
                type="button"
                onClick={toggleListening}
                className="text-[11px] font-semibold underline hover:text-red-700"
              >
                Stop
              </button>
            </div>
          )}

          {/* Pending Attachment Chips Bar */}
          {pendingAttachments.length > 0 && (
            <div className="border-t bg-muted/30 p-2">
              <div className="flex items-center justify-between px-1 mb-1 text-[11px] text-muted-foreground font-medium">
                <span>Attached files ({pendingAttachments.length})</span>
                <button
                  type="button"
                  onClick={() => setPendingAttachments([])}
                  className="text-destructive hover:underline text-[10px]"
                >
                  Clear all
                </button>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {pendingAttachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-1.5 rounded-lg border bg-card px-2.5 py-1 text-xs text-foreground shadow-2xs shrink-0 max-w-[200px]"
                  >
                    {renderFileIcon(att.type, att.extension)}
                    <span className="truncate text-[11px] font-medium max-w-[110px]" title={att.name}>
                      {att.name}
                    </span>
                    <span className="text-[9px] text-muted-foreground shrink-0">{att.size}</span>
                    <button
                      type="button"
                      onClick={() => removePendingAttachment(att.id)}
                      className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <XIcon className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Suggestion Chips */}
          <div className="border-t bg-muted/20 px-3 py-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              {QUICK_PROMPTS.map((prompt, idx) => {
                const Icon = prompt.icon
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (prompt.isUpload) {
                        attachmentInputRef.current?.click()
                      } else {
                        handleSendMessage(prompt.text)
                      }
                    }}
                    className="flex items-center gap-1 rounded-full border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-2xs transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                  >
                    <Icon className="size-3 text-primary" />
                    <span>{prompt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer Input Bar with Attachment Paperclip & Voice Mic Button */}
          <div className="border-t p-3 bg-card">
            <div className="flex items-center gap-2">
              {/* Paperclip File Attachment Button */}
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                onClick={() => attachmentInputRef.current?.click()}
                title="Attach files, documents, MP3 or MP4 audio"
                className="size-8 shrink-0 rounded-lg hover:text-primary"
              >
                <PaperclipIcon className="size-4 text-muted-foreground hover:text-primary" />
              </Button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isListening
                    ? "Listening to your voice..."
                    : pendingAttachments.length > 0
                    ? "Add a message or press send..."
                    : "Ask AI Assistant or attach files..."
                }
                className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />

              {/* Voice Microphone Button */}
              <Button
                type="button"
                size="icon-sm"
                variant={isListening ? "destructive" : "outline"}
                onClick={toggleListening}
                title={isListening ? "Stop Voice Input" : "Speak to Chat Directly"}
                className={`size-8 shrink-0 rounded-lg transition-all ${
                  isListening ? "animate-pulse shadow-md shadow-red-500/30" : "hover:text-primary"
                }`}
              >
                {isListening ? <MicOffIcon className="size-4" /> : <MicIcon className="size-4 text-primary" />}
              </Button>

              {/* Send Message Button */}
              <Button
                size="icon-sm"
                onClick={() => handleSendMessage()}
                disabled={(!inputValue.trim() && pendingAttachments.length === 0) || isTyping}
                className="size-8 shrink-0 rounded-lg"
              >
                <SendIcon className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
