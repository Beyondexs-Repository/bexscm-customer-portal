"use client"

import { useId, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheckIcon, SmartphoneIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const countryCodes = [
  { label: "India", value: "+91" },
  { label: "United States", value: "+111" },
  { label: "United Kingdom", value: "+44" },
  { label: "United Arab Emirates", value: "+971" },
]

export default function Login() {
  const router = useRouter()
  const phoneId = useId()
  const otpLabelId = useId()
  const [countryCode, setCountryCode] = useState("+91")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [step, setStep] = useState("phone")
  const [message, setMessage] = useState("")
  const otpRefs = useRef([])

  const digitsOnlyPhone = phone.replace(/\D/g, "")
  const otpValue = otp.join("")
  const maskedPhone = useMemo(() => {
    if (digitsOnlyPhone.length <= 4) {
      return `${countryCode} ${digitsOnlyPhone}`
    }

    return `${countryCode} ******${digitsOnlyPhone.slice(-4)}`
  }, [countryCode, digitsOnlyPhone])

  function handleSendOtp(event) {
    event.preventDefault()

    if (digitsOnlyPhone.length < 7 || digitsOnlyPhone.length > 15) {
      setMessage("Enter a valid phone number before requesting an OTP.")
      return
    }

    setStep("otp")
    setMessage(`A 6 digit OTP has been sent to ${maskedPhone}.`)
    window.setTimeout(() => otpRefs.current[0]?.focus(), 0)
  }

  function handleOtpChange(index, value) {
    const nextValue = value.replace(/\D/g, "").slice(-1)
    const nextOtp = [...otp]
    nextOtp[index] = nextValue
    setOtp(nextOtp)

    if (nextValue && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  function handleOtpKeyDown(index, event) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  function handleVerifyOtp(event) {
    event.preventDefault()

    if (otpValue.length !== 6) {
      setMessage("Enter the 6 digit OTP to continue.")
      return
    }

    setMessage("Phone number verified.")
    window.sessionStorage.setItem("aloha-login-verified", "true")
    document.cookie =
      "aloha-login-verified=true; path=/; max-age=604800; SameSite=Lax"
    router.replace("/")
  }

  function handleChangePhone() {
    setStep("phone")
    setOtp(["", "", "", "", "", ""])
    setMessage("")
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-sm rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheckIcon className="size-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight">
              Secure login
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in with your phone number and OTP.
            </p>
          </div>
        </div>

        {step === "phone" ? (
          <form className="space-y-4" onSubmit={handleSendOtp}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor={phoneId}>
                Phone number
              </label>
              <div className="grid grid-cols-[6.5rem_1fr] gap-2">
                <select
                  aria-label="Country code"
                  className="h-9 rounded-lg border border-input bg-background px-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  value={countryCode}
                  onChange={(event) => setCountryCode(event.target.value)}
                >
                  {countryCodes.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.value}
                    </option>
                  ))}
                </select>
                <Input
                  autoComplete="tel-national"
                  className="h-9"
                  id={phoneId}
                  inputMode="numeric"
                  maxLength={15}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value.replace(/[^\d\s-]/g, ""))
                  }
                />
              </div>
            </div>
            <Button className="w-full" size="lg" type="submit">
              <SmartphoneIcon className="size-4" />
              Send OTP
            </Button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleVerifyOtp}>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium" id={otpLabelId}>
                  Enter OTP
                </label>
                <button
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  type="button"
                  onClick={handleChangePhone}
                >
                  Change
                </button>
              </div>
              <div
                aria-labelledby={otpLabelId}
                className="grid grid-cols-6 gap-2"
                role="group"
              >
                {otp.map((digit, index) => (
                  <Input
                    aria-label={`OTP digit ${index + 1}`}
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    className="h-11 px-0 text-center text-lg font-semibold"
                    inputMode="numeric"
                    key={index}
                    maxLength={1}
                    ref={(element) => {
                      otpRefs.current[index] = element
                    }}
                    value={digit}
                    onChange={(event) =>
                      handleOtpChange(index, event.target.value)
                    }
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  />
                ))}
              </div>
            </div>
            <Button className="w-full" size="lg" type="submit">
              Verify and continue
            </Button>
          </form>
        )}

        {message && (
          <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
            {message}
          </p>
        )}
      </section>
    </main>
  )
}
