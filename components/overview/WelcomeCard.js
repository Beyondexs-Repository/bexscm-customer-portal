"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { BookOpen, CalendarDays, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function WelcomeCard() {
  const t = useTranslations("welcomeCard")

  return (
    <section className="relative overflow-hidden rounded-xl border bg-primary/10 p-4 shadow-sm sm:p-6 dark:bg-background">
      <div className="relative z-10">
        <p className="text-base font-semibold sm:text-lg">{t("welcomeBack")}</p>

        <h1 className="mt-1 max-w-full text-2xl font-bold leading-tight tracking-tight text-balance sm:text-3xl">
          Crate Inc.<span aria-hidden="true">👋</span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("todaySummary")}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3 lg:flex lg:flex-row lg:items-center lg:gap-3">
          <Button asChild className="w-full h-10 !justify-start gap-2 !text-left sm:col-span-2 lg:h-9 lg:w-fit lg:flex-none lg:whitespace-nowrap lg:px-4">
            <Link href="/order-guide">
              <ShoppingCart className="size-4" />
              {t("startOrderGuide")}
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full h-10 !justify-start gap-2 !text-left lg:h-9 lg:w-fit lg:flex-none lg:whitespace-nowrap lg:px-4">
            <Link href="/catalog">
              <BookOpen className="size-4" />
              {t("browseCatalog")}
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full h-10 !justify-start gap-2 !text-left lg:h-9 lg:w-fit lg:flex-none lg:whitespace-nowrap lg:px-4">
            <Link href="/my-orders">
              <CalendarDays className="size-4" />
              {t("viewOrders")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-200/40 blur-2xl" />
      <div className="absolute -bottom-12 right-20 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
    </section>
  )
}
