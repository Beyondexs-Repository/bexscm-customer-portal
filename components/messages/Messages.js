"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
	ChevronUp,
	ImageIcon,
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
		text: "Hi Beyondexs, can you confirm whether the Premium Incense Sticks are available in stock?",
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
	const [open, setOpen] = useState(fullscreen)
	const [message, setMessage] = useState("")
	const [messages, setMessages] = useState(initialMessages)
	const messageAreaRef = useRef(null)

	useEffect(() => {
		if (!messageAreaRef.current) return

		messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight
	}, [messages, open])

	function handleSend() {
		if (!message.trim()) return

		setMessages((prev) => [
			...prev,
			{
				id: Date.now(),
				type: "sent",
				text: message.trim(),
				time: "Now",
				date: "Today",
			},
		])

		setMessage("")
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
									alt="Customer"
									className="h-9 w-9 rounded-full"
								/>
								<h3 className="font-semibold">New Message</h3>
							</div>

							<div className="flex items-center gap-2">
								<Link href="/messages">
									<button
										type="button"
										className="rounded-md p-1 hover:bg-muted"
										aria-label="Open messages page"
									>
										<Maximize2 className="h-4 w-4" />
									</button>
								</Link>

								<button
									type="button"
									onClick={() => setOpen(false)}
									className="rounded-md p-1 hover:bg-muted"
									aria-label="Close chat"
								>
									<X className="h-5 w-5" />
								</button>
							</div>
						</div>
					)}

					<div
						ref={messageAreaRef}
						className="min-h-0 flex-1 overflow-y-auto px-5 py-4"
					>
						<div className="flex min-h-full flex-col">
						<div className="mt-auto flex items-center gap-3 pb-5">
							<div className="h-px flex-1 bg-border" />
							<span className="text-xs font-semibold text-muted-foreground">
								TODAY
							</span>
							<div className="h-px flex-1 bg-border" />
						</div>

						<div className="space-y-5">
							{messages.map((item) => (
								<div
									key={item.id}
									className={`flex gap-3 ${
										item.type === "sent"
											? "justify-end"
											: "items-start"
									}`}
								>
									{item.type === "received" && (
										<img
											src={avatarUrl}
											alt="Customer"
											className="h-10 w-10 rounded-full"
										/>
									)}

									<div
										className={`max-w-[520px] ${
											item.type === "sent"
												? "rounded-2xl bg-primary px-4 py-2 text-primary-foreground"
												: "rounded-2xl bg-muted px-4 py-2"
										}`}
									>
										<p className="whitespace-pre-line text-sm leading-relaxed">
											{item.text}
										</p>

										<div
											className={`mt-1 text-right text-[11px] ${
												item.type === "sent"
													? "text-primary-foreground/70"
													: "text-muted-foreground"
											}`}
										>
											{item.date} · {item.time}
										</div>
									</div>
								</div>
							))}
						</div>
						</div>
					</div>

					<div className="shrink-0 border-t bg-background p-3">
						<textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault()
									handleSend()
								}
							}}
							placeholder="Write a message..."
							rows={2}
							className="mb-2 w-full resize-none rounded-lg border bg-muted/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
						/>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<button
									type="button"
									className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
								>
									<Paperclip className="h-5 w-5" />
								</button>

								<button
									type="button"
									className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
								>
									<ImageIcon className="h-5 w-5" />
								</button>
							</div>

							<button
								type="button"
								onClick={handleSend}
								className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
							>
								Send
								<Send className="h-4 w-4" />
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
									alt="Avatar"
									className="h-8 w-8 rounded-full"
								/>
								<span className="font-semibold">New Message</span>
							</div>

							<ChevronUp className="h-5 w-5" />
						</div>
					</button>
				)
			)}
		</>
	)
}
