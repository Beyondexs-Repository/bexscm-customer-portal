"use client"

import { useState } from "react"
import { CircleCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SMSConsent() {
  const [status, setStatus] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    const form = event.currentTarget
    const contactInput = form.elements.namedItem("email")
    const contact = contactInput.value.trim()
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
    if (!isEmail) {
      contactInput.setCustomValidity("Enter a valid email address.")
      contactInput.reportValidity()
      return
    }

    const payload = {
      name: form.elements.namedItem("name").value.trim(),
      email: contact,
      smsConsent: form.elements.namedItem("smsConsent").checked,
    }

    setIsSubmitting(true)
    setIsError(false)
    setStatus("")

    try {
      const response = await fetch("https://cportal.bexatm.com/api/sms-consent.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok || result?.success !== true) {
        throw new Error(result?.error || "Unable to submit your consent. Please try again.")
      }

      form.reset()
      setStatus("Your consent has been submitted successfully.")
    } catch (error) {
      setIsError(true)
      setStatus(
        error instanceof Error && !(error instanceof TypeError) && !(error instanceof SyntaxError)
          ? error.message
          : "Unable to confirm your submission. Please try again later."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main
      className="flex min-h-svh items-center justify-center bg-muted/30 px-3 py-5 text-foreground sm:px-4 sm:py-10"
      style={{
        "--primary": "#0D4E4D",
        "--primary-foreground": "#FFFFFF",
        "--ring": "#0D4E4D",
      }}
    >
      {status && !isError ? (
        <section
          role="status"
          aria-labelledby="sms-success-title"
          className="w-full max-w-lg rounded-2xl border border-primary/20 bg-card p-6 text-center shadow-sm sm:p-10"
        >
          <CircleCheck aria-hidden="true" className="mx-auto mb-4 size-12 text-primary" />
          <h1 id="sms-success-title" className="text-xl font-semibold text-primary sm:text-2xl">
            Thank you!
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{status}</p>
        </section>
      ) : (
      <section
        aria-labelledby="sms-consent-title"
        className="w-full max-w-lg rounded-2xl border bg-card p-4 shadow-sm sm:p-8"
      >
        <div className="mb-5 text-center sm:mb-8">
          <svg role="img" aria-label="Plymouth Poultry" className="mx-auto mb-3 h-auto w-24 text-primary sm:mb-5 sm:w-36" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 222.63 138.47">
          <title>plymouth-logo</title>
          <path d="M20,72.22h6.17v2.17H22.36v1.88h3v2.17h-3v2h4v2.17H20V72.22Z" fill="currentColor">
          </path>
          <path d="M32.72,79.35a4,4,0,0,0,2.36,1.07,0.88,0.88,0,0,0,1-.83c0-1.23-4.44-1.19-4.44-4.38A3.22,3.22,0,0,1,35.16,72a4.36,4.36,0,0,1,3.17,1.17l-1,2.07a3.67,3.67,0,0,0-2.18-.91,0.91,0.91,0,0,0-1,.81c0,1.3,4.44,1.07,4.44,4.35A3.2,3.2,0,0,1,35,82.75a5,5,0,0,1-3.6-1.48Z" fill="currentColor">
          </path>
          <path d="M46.28,74.39h-3V72.22h8.39v2.17h-3v8.19H46.28V74.39Z" fill="currentColor">
          </path>
          <path d="M56.89,72.22h3.5c3.1,0,5.08,1.9,5.08,5.16s-2,5.2-5.08,5.2h-3.5V72.22Zm3.4,8.19c1.67,0,2.69-1,2.69-3s-1.06-3-2.69-3h-1v6h1Z" fill="currentColor">
          </path>
          <path d="M157.55,80.41h2.09V76.09c0-.39,0-0.8,0-0.8h0a2,2,0,0,1-.38.55l-0.59.57-1.39-1.57,2.66-2.62H162v8.19h2.11v2.17h-6.56V80.41Z" fill="currentColor">
          </path>
          <path d="M169.37,82.31L170,80.13a3.59,3.59,0,0,0,1.35.3,2.17,2.17,0,0,0,2.12-1.71h0a2.67,2.67,0,0,1-1.35.36,3.53,3.53,0,0,1,.14-7c2,0,4,1.58,4,5,0,2.81-1.64,5.75-4.7,5.75A4.77,4.77,0,0,1,169.37,82.31Zm4.4-5.89a1.9,1.9,0,0,0-1.52-2.06,1.07,1.07,0,0,0-1,1.16A1.42,1.42,0,0,0,172.75,77C173.3,77,173.77,76.9,173.77,76.42Z" fill="currentColor">
          </path>
          <path d="M182.3,79.44a3.17,3.17,0,0,0,2,.93,1.19,1.19,0,0,0,1.4-1c0-.81-0.77-1.15-1.83-1.15h-0.69L182.71,77,184,75.32a11,11,0,0,1,.86-1v0a4.71,4.71,0,0,1-.94.07h-2.36V72.22h6.21V73.8l-2,2.42a3,3,0,0,1,2.38,3,3.43,3.43,0,0,1-3.65,3.54,4.57,4.57,0,0,1-3.36-1.36Z" fill="currentColor">
          </path>
          <path d="M194.79,77a2.57,2.57,0,0,1-.9-2,3,3,0,0,1,3.31-3c1.83,0,3.33,1.07,3.33,3a4.5,4.5,0,0,1-1,2.36,2.56,2.56,0,0,1,1.16,2.19c0,1.58-1.21,3.16-3.65,3.16s-3.65-1.57-3.65-3.22A3.49,3.49,0,0,1,194.79,77Zm1.63,1a1.91,1.91,0,0,0-.52,1.26,1.19,1.19,0,0,0,1.19,1.2,1,1,0,0,0,1.18-1.06C198.26,78.87,197.38,78.52,196.42,78.06Zm1.42-1.55a2.72,2.72,0,0,0,.34-1.28,0.92,0.92,0,0,0-1-1,0.79,0.79,0,0,0-.9.81C196.25,75.77,197,76.12,197.84,76.51Z" fill="currentColor">
          </path>
          <path d="M102.12,24.5l0,27.33,8.32-6.27v-21h3.7c3.54,0,5.15,2.39,5.15,4.61,0,2.39-.6,4.84-4.92,4.91v7.5h1.24c6.39,0,11.59-5.57,11.59-12.41a11.71,11.71,0,0,0-11.59-11.8H103L95.94,24.5h6.17Z" fill="currentColor">
          </path>
          <path d="M125.79,61.64l-14.58-11-14.58,11-5.84-4.4L78.4,66.6a41.21,41.21,0,0,0,65.82.14l-12.59-9.5ZM114.5,64.18l-8.13,8.52-1.21-4.86-5.6.66,5.25-5.35h4.51L111.75,57l9.3,9.43Z" fill="currentColor">
          </path>
          <path d="M74.49,45.75c0.86,0,5-2.37,5.06-5l0.06-5.43-5,3.72-5-3.83-0.06,5.43C69.51,43.28,73.63,45.74,74.49,45.75Z" fill="currentColor">
          </path>
          <path d="M74.62,32.24c0.8,0.32,5.55-.36,6.54-2.79l2-5L77.15,26l-3.21-5.38-2,5C70.9,28.12,73.82,31.91,74.62,32.24Z" fill="currentColor">
          </path>
          <path d="M87,19.24l3.66-4-6.24-.57L83.26,8.48l-3.65,4c-1.78,2-.34,6.53.3,7.11S85.24,21.18,87,19.24Z" fill="currentColor">
          </path>
          <path d="M95.81,11.38l4.83-2.49L95,6.18,96.06,0,91.23,2.48c-2.35,1.21-2.6,6-2.21,6.76S93.47,12.59,95.81,11.38Z" fill="currentColor">
          </path>
          <path d="M81.55,52.68L80,47.47l-3.72,5-5.87-2.19L72,55.53c0.75,2.53,5.41,3.66,6.24,3.42S82.3,55.19,81.55,52.68Z" fill="currentColor">
          </path>
          <path d="M143,35.32l0.06,5.43c0,2.63,4.19,5,5.06,5s5-2.47,5-5.11L153,35.21l-5,3.83Z" fill="currentColor">
          </path>
          <path d="M141.47,29.44c1,2.43,5.74,3.12,6.54,2.79s3.73-4.12,2.73-6.57l-2-5L145.47,26l-6.06-1.61Z" fill="currentColor">
          </path>
          <path d="M135.61,19.24c1.77,1.94,6.46,1,7.1.37s2.08-5.15.3-7.11l-3.65-4-1.16,6.16-6.24.57Z" fill="currentColor">
          </path>
          <path d="M126.82,11.38c2.34,1.2,6.39-1.37,6.78-2.14s0.14-5.56-2.21-6.76L126.56,0l1.07,6.18L122,8.9Z" fill="currentColor">
          </path>
          <path d="M152.22,50.32l-5.87,2.19-3.72-5-1.55,5.21c-0.75,2.52,2.53,6,3.35,6.27s5.49-.89,6.24-3.42Z" fill="currentColor">
          </path>
          <path d="M63.92,118.62c0,2.59-1.24,4.14-3.32,4.14s-3.44-1.55-3.44-4.14V106.4H49v15c0,4,1.45,8.78,8.34,8.78a8.57,8.57,0,0,0,6.45-2.76l0.43-.49v11.52h7.83V106.4H63.92v12.22Z" fill="currentColor">
          </path>
          <path d="M18.36,97.55H6.49L0,104.11H5v25.55h8.23v-9.78h5.15c6.21,0,10.55-4.61,10.55-11.21S24.57,97.55,18.36,97.55Zm-1.59,15.22H13.21v-8.1H16.9c2.29,0,3.65,1.5,3.65,4S19.14,112.77,16.77,112.77Z" fill="currentColor">
          </path>
          <path d="M43,122.68c-1.49,0-1.88-.55-1.88-2.68V97.55H32.94V121c0,7.86,4.62,8.87,8.65,8.87a20.74,20.74,0,0,0,2.33-.13l0.21,0v-7.12l-0.27,0C43.76,122.65,43.36,122.68,43,122.68Z" fill="currentColor">
          </path>
          <path d="M106.79,105.91a9.18,9.18,0,0,0-7.27,3.54l-0.23.26-0.17-.3a6.84,6.84,0,0,0-6.29-3.49,7.82,7.82,0,0,0-6.25,3.18l-0.43.52v-3.19H78.31v23.33h7.85V117.08c0-2.44,1.2-3.89,3.2-3.89s3.07,1.46,3.07,3.89v12.68h7.85V117.08c0-2.4,1.24-3.89,3.24-3.89s3.07,1.46,3.07,3.89v12.68h7.85V114.45C114.44,109.1,111.58,105.91,106.79,105.91Z" fill="currentColor">
          </path>
          <path d="M132.14,105.87c-7.6,0-13.12,5.14-13.12,12.23s5.54,12.1,13.16,12.1,13.16-5.09,13.16-12.1S139.79,105.87,132.14,105.87Zm0,17.47c-3.24,0-4.93-2.64-4.93-5.24a5,5,0,1,1,9.86,0A4.92,4.92,0,0,1,132.19,123.34Z" fill="currentColor">
          </path>
          <path d="M214.2,105.87a8.48,8.48,0,0,0-6.29,2.56l-0.43.47v-0.64c0-.15,0-0.3,0-0.47V97.55h-8.14v32.11h8.14V117.51c0-2.66,1.33-4.25,3.56-4.25s3.43,1.59,3.43,4.25v12.15h8.14v-15C222.63,108.9,219.71,105.87,214.2,105.87Z" fill="currentColor">
          </path>
          <path d="M192.63,122.68c-2.47,0-3.83-1-3.83-2.68v-7.21h4.78V106.4H188.8v-6.15h-7.92v6.15h-3.14v6.39h2.92V121c0,8,7.63,8.87,10.9,8.87a14.8,14.8,0,0,0,2.12-.14l0.21,0v-7.11l-0.28,0C193.46,122.65,193.11,122.68,192.63,122.68Z" fill="currentColor">
          </path>
          <path d="M164.88,118.62c0,2.59-1.24,4.14-3.32,4.14s-3.44-1.55-3.44-4.14V106.4H150v15c0,4,1.45,8.78,8.34,8.78a8.57,8.57,0,0,0,6.45-2.76l0.43-.49v2.72H173V106.4h-8.14v12.22Z" fill="currentColor">
          </path>
          <rect x="178.4" y="113.2" width="0.03" height="0.03" fill="currentColor">
          </rect>
          </svg>
          <h1 id="sms-consent-title" className="text-xl font-semibold text-primary sm:text-2xl">SMS Consent</h1>
          <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
            Sign up for weekly pricing and promotional text messages.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          aria-busy={isSubmitting}
          onChange={() => setStatus("")}
          className="space-y-4 sm:space-y-6"
        >
          <div className="space-y-2">
            <label htmlFor="sms-name" className="block text-sm font-medium">
              Name
            </label>
            <Input
              id="sms-name"
              name="name"
              type="text"
              disabled={isSubmitting}
              maxLength={200}
              required
              pattern=".*\S.*"
              title="Enter your name."
              autoComplete="name"
              placeholder="Enter your name"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="sms-email" className="block text-sm font-medium">
              Email ID
            </label>
            <Input
              id="sms-email"
              name="email"
              type="email"
              disabled={isSubmitting}
              maxLength={254}
              required
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="Enter your email address"
              className="h-11"
              onChange={event => event.currentTarget.setCustomValidity("")}
            />
          </div>

          <div className="flex items-start gap-2 sm:gap-3">
            <input
              id="sms-consent"
              name="smsConsent"
              type="checkbox"
              disabled={isSubmitting}
              required
              defaultChecked={false}
              aria-labelledby="sms-consent-description"
              className="mt-1 size-4 shrink-0 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
            <div className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              <span id="sms-consent-description">
                I agree to receive pricing updates and promotional texts from
                Plymouth Poultry.
              </span>{" "}
              See our{" "}
              <a
                href="https://www.plymouthinc.com/Privay-Policy"
                target="_blank"
                rel="noopener noreferrer"
                className="break-words text-primary underline underline-offset-4"
              >
                Privacy Policy
              </a>
              {" and "}
              <a
                href="https://www.plymouthinc.com/sms-terms"
                target="_blank"
                rel="noopener noreferrer"
                className="break-words text-primary underline underline-offset-4"
              >
                Terms
              </a>
              .
              <p className="mt-2 text-xs leading-5">
                Note: Message and data rates may apply.
              </p>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>

          {status && isError && (
            <p role="alert" className="text-center text-sm text-destructive">
              {status}
            </p>
          )}
        </form>
      </section>
      )}
    </main>
  )
}
