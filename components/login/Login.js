"use client"

import Image from "next/image"
import { useEffect, useId, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  CheckIcon,
  LanguagesIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react"
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js/min"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { locales } from "@/lib/i18n"

const localeLabels = {
  en: "English",
  es: "Spanish",
}

const countryNameFormatter =
  typeof Intl !== "undefined" && Intl.DisplayNames
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null

const preferredCountries = ["US", "IN", "GB", "AE", "CA", "AU"]

function getCountryName(country) {
  return countryNameFormatter?.of(country) ?? country
}

function getFlagEmoji(country) {
  return country
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0)),
    )
}

const countries = getCountries()
  .map((country) => ({
    country,
    callingCode: getCountryCallingCode(country),
    flag: getFlagEmoji(country),
    name: getCountryName(country),
  }))
  .sort((first, second) => {
    const firstPreferred = preferredCountries.indexOf(first.country)
    const secondPreferred = preferredCountries.indexOf(second.country)

    if (firstPreferred !== -1 || secondPreferred !== -1) {
      return (
        (firstPreferred === -1 ? 999 : firstPreferred) -
        (secondPreferred === -1 ? 999 : secondPreferred)
      )
    }

    return first.name.localeCompare(second.name)
  })

function getPhoneError(phone, selectedCountry, t) {
  const digits = phone.replace(/\D/g, "")

  if (!digits) {
    return t("phoneRequired")
  }

  const parsedPhone = parsePhoneNumberFromString(digits, selectedCountry)

  if (!parsedPhone || parsedPhone.country !== selectedCountry) {
    return t("countryMismatch")
  }

  if (!parsedPhone.isPossible()) {
    return t("lengthMismatch")
  }

  if (!parsedPhone.isValid()) {
    return t("validPhone")
  }

  return ""
}

export default function Login() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("auth")
  const phoneId = useId()
  const otpLabelId = useId()
  const countrySearchId = useId()
  const [selectedCountry, setSelectedCountry] = useState("IN")
  const [countryPickerOpen, setCountryPickerOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  const [phone, setPhone] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [step, setStep] = useState("phone")
  const [message, setMessage] = useState("")
  const [selectedLocale, setSelectedLocale] = useState(locale)
  const otpRefs = useRef([])
  const countryPickerRef = useRef(null)

  const selectedCountryData = countries.find(
    (country) => country.country === selectedCountry,
  )
  const otpValue = otp.join("")
  const parsedPhone = useMemo(
    () => parsePhoneNumberFromString(phone.replace(/\D/g, ""), selectedCountry),
    [phone, selectedCountry],
  )
  const formattedPhone = parsedPhone?.formatInternational()
  const maskedPhone = useMemo(() => {
    const digits = phone.replace(/\D/g, "")

    if (!digits || !selectedCountryData) {
      return ""
    }

    return `+${selectedCountryData.callingCode} ******${digits.slice(-4)}`
  }, [phone, selectedCountryData])

  const filteredCountries = useMemo(() => {
    const query = countrySearch.trim().toLowerCase()

    if (!query) return countries

    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.country.toLowerCase().includes(query) ||
        `+${country.callingCode}`.includes(query),
    )
  }, [countrySearch])

  useEffect(() => {
	function handleClickOutside(event) {
		if (
			countryPickerRef.current &&
			!countryPickerRef.current.contains(event.target)
		) {
			setCountryPickerOpen(false)
		}
	}

	document.addEventListener("mousedown", handleClickOutside)
	document.addEventListener("touchstart", handleClickOutside)

	return () => {
		document.removeEventListener("mousedown", handleClickOutside)
		document.removeEventListener("touchstart", handleClickOutside)
	}
}, [])

  function handleSendOtp(event) {
    event.preventDefault()

    const nextError = getPhoneError(phone, selectedCountry, t)

    if (nextError) {
      setPhoneError(nextError)
      setMessage("")
      return
    }

    setPhoneError("")
    setMessage("")
    setStep("otp")
    setMessage(t("otpSent", { phone: formattedPhone ?? maskedPhone }))
    window.setTimeout(() => otpRefs.current[0]?.focus(), 0)
  }

  function handlePhoneChange(event) {
    setPhone(event.target.value.replace(/[^\d\s().-]/g, ""))
    if (phoneError) setPhoneError("")
  }

  function handleCountryChange(country) {
    setSelectedCountry(country.country)
    setCountryPickerOpen(false)
    setCountrySearch("")
    setPhoneError("")
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

  function handleOtpPaste(event) {
    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)

    if (!pastedDigits) return

    event.preventDefault()
    const nextOtp = ["", "", "", "", "", ""]

    pastedDigits.split("").forEach((digit, index) => {
      nextOtp[index] = digit
    })

    setOtp(nextOtp)
    otpRefs.current[Math.min(pastedDigits.length, 6) - 1]?.focus()
  }

  function handleOtpKeyDown(index, event) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  function handleVerifyOtp(event) {
    event.preventDefault()

    if (otpValue.length !== 6) {
      setMessage(t("enterOtp"))
      return
    }

    setMessage(t("phoneVerified"))
    router.replace("/")
  }

  function handleChangePhone() {
    setStep("phone")
    setOtp(["", "", "", "", "", ""])
    setMessage("")
    window.setTimeout(() => document.getElementById(phoneId)?.focus(), 0)
  }

  function handleLocaleChange(nextLocale) {
    setSelectedLocale(nextLocale)
  }

  return (
	<main className="relative h-svh overflow-hidden bg-[radial-gradient(circle_at_top_left,#e8f8d8,transparent_30%),linear-gradient(135deg,#fffaf1,#fff2dc)] text-[#071936]">
		{/* Logo */}
		<div className="absolute left-6 top-6 z-30 flex items-center gap-3 sm:left-10 lg:left-14">
			<Image
				src="/logo/logo.png"
				alt="Crate Inc."
				width={80}
				height={80}
				className="size-16 object-contain"
				priority
			/>
			<div>
				<p className="text-2xl font-black tracking-tight">CRATE INC.</p>
				<p className="mt-1 text-sm font-semibold text-slate-500">
					{t("tagline")}
				</p>
			</div>
		</div>

		<section className="absolute inset-0 z-20 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center gap-8 px-6 pb-0 pt-8 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-14 lg:pt-0">
			{/* Left Content - hidden text on mobile */}
			<div className="relative flex w-full flex-col items-center lg:items-start">
				<div className="hidden lg:block">
					<p className="text-lg font-extrabold text-orange-500">
						{t("welcomeTo")}
					</p>
					<h1 className="mt-2 text-1xl font-black tracking-tight xl:text-3xl">
						Crate Inc.
					</h1>
					<p className=" max-w-md text-base font-semibold leading-7 text-slate-500">
						{t("trustMessage")}
					</p>
				</div>

				<Image
					src="/placeholder.png"
					alt={t("freshBoxAlt")}
					width={720}
					height={460}
					className="pointer-events-none fixed md:right-0 -bottom-4 -right-4 z-0 w-[115%] max-w-none object-contain drop-shadow-2xl lg:static lg:mt-6 lg:w-full "
					priority
				/>
			</div>

			{/* Login Card */}
			<section className="absolute left-1/2 top-1/2 z-30 w-[calc(100%-2rem)] max-w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/70 bg-white/95 p-5 shadow-2xl shadow-orange-950/10 backdrop-blur sm:max-w-md sm:p-6 lg:left-auto lg:right-14 lg:w-full lg:max-w-[380px] lg:translate-x-0 lg:p-7 xl:right-20">
				<div className="absolute right-3 top-3 z-40">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-white/95 px-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
								aria-label={t("language")}
							>
								<LanguagesIcon className="size-4" />
								<span>{localeLabels[selectedLocale] ?? "English"}</span>
								<ChevronDownIcon className="size-3.5" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-36">
							{locales.map((item) => (
								<DropdownMenuItem
									key={item}
									onSelect={() => handleLocaleChange(item)}
									className="justify-between"
								>
									<span>{localeLabels[item]}</span>
									{selectedLocale === item ? <CheckIcon className="size-4" /> : null}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="mx-auto flex size-14 items-center justify-center rounded-full bg-orange-100 text-orange-500">
					{step === "phone" ? (
						<PhoneIcon className="size-7" />
					) : (
						<ShieldCheckIcon className="size-7" />
					)}
				</div>

				<div className="mt-4 text-center">
					<h2 className="text-xl font-black tracking-tight sm:text-2xl">
						{step === "phone" ? t("enterMobile") : t("enterOtpTitle")}
					</h2>
					<p className="mx-auto mt-2 max-w-sm text-xs font-semibold leading-5 text-slate-500">
							{step === "phone"
								? t("secureSignIn")
								: t("useCode", { phone: formattedPhone ?? maskedPhone })}
					</p>
				</div>

				{step === "phone" ? (
					<form className="mt-5 space-y-4" onSubmit={handleSendOtp}>
						<div className="space-y-2">

							<div className="grid grid-cols-[6.5rem_1fr] overflow-visible rounded-lg border border-slate-200 bg-white shadow-sm focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100 sm:grid-cols-[7.5rem_1fr]">
								<div className="relative" ref={countryPickerRef}>
									<button
										type="button"
										aria-expanded={countryPickerOpen}
										className="flex h-12 w-full items-center justify-between gap-2 border-r border-slate-200 px-3 text-sm font-bold"
										onClick={() => setCountryPickerOpen((open) => !open)}
									>
										<span className="flex min-w-0 items-center gap-2">
											<span>{selectedCountryData?.country}</span>
											<span>+{selectedCountryData?.callingCode}</span>
										</span>
										<ChevronDownIcon className="size-4 shrink-0 text-slate-400" />
									</button>

									{countryPickerOpen && (
										<div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-xl border bg-white shadow-xl">
											<div className="border-b p-2">
												<Input
													id={countrySearchId}
													value={countrySearch}
													onChange={(event) =>
														setCountrySearch(event.target.value)
													}
													placeholder={t("searchCountry")}
													className="h-9"
												/>
											</div>

											<div className="max-h-52 overflow-y-auto p-1">
												{filteredCountries.map((country) => (
													<button
														key={country.country}
														type="button"
														className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-orange-50"
														onClick={() => handleCountryChange(country)}
													>
														<span className="text-lg">{country.flag}</span>
														<span className="min-w-0 flex-1 truncate font-semibold">
															{country.name}
														</span>
														<span className="text-xs font-bold text-slate-500">
															+{country.callingCode}
														</span>
													</button>
												))}
											</div>
										</div>
									)}
								</div>

								<Input
									id={phoneId}
									inputMode="tel"
									autoComplete="tel-national"
									placeholder={t("enterPhone")}
									value={phone}
									onChange={handlePhoneChange}
									className="h-12 rounded-none border-0 px-3 text-sm shadow-none focus-visible:ring-0"
								/>
							</div>

							{phoneError && (
								<p className="text-sm font-semibold text-destructive">
									{phoneError}
								</p>
							)}
						</div>

						<div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
							<ShieldCheckIcon className="size-5 text-green-500" />
							{t("secureData")}
						</div>

						<Button
							className="h-12 w-full rounded-lg bg-orange-500 text-base font-extrabold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600"
							size="lg"
							type="submit"
						>
							{t("sendOtp")}
							<ArrowRightIcon className="size-5" />
						</Button>
					</form>
				) : (
					<form className="mt-5 space-y-5" onSubmit={handleVerifyOtp}>
						<div className="space-y-3">
							<div className="flex items-center justify-between gap-3">
								<label className="text-sm font-bold" id={otpLabelId}>
									{t("otpCode")}
								</label>

								<button
									className="flex items-center gap-1 text-sm font-bold text-orange-600 underline-offset-4 hover:underline"
									type="button"
									onClick={handleChangePhone}
								>
									<ArrowLeftIcon className="size-4" />
									{t("changeNumber")}
								</button>
							</div>

							<div
								aria-labelledby={otpLabelId}
								className="grid grid-cols-6 gap-2"
								role="group"
							>
								{otp.map((digit, index) => (
									<Input
										key={index}
										aria-label={t("otpDigit", { index: index + 1 })}
										autoComplete={index === 0 ? "one-time-code" : "off"}
										className="h-11 rounded-lg px-0 text-center text-lg font-black border-2 border-slate-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
										inputMode="numeric"
										maxLength={1}
										ref={(element) => {
											otpRefs.current[index] = element
										}}
										value={digit}
										onChange={(event) =>
											handleOtpChange(index, event.target.value)
										}
										onKeyDown={(event) => handleOtpKeyDown(index, event)}
										onPaste={handleOtpPaste}
									/>
								))}
							</div>
						</div>

						<Button
							className="h-12 w-full rounded-lg bg-orange-500 text-base font-extrabold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600"
							size="lg"
							type="submit"
						>
							{t("verifyContinue")}
							<ArrowRightIcon className="size-5" />
						</Button>
					</form>
				)}

				{message && (
					<p className="mt-4 rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-slate-600">
						{message}
					</p>
				)}

				<div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
					<SparklesIcon className="size-4 text-orange-400" />
					{t("footerNote")}
				</div>
			</section>
		</section>
	</main>
);
}
