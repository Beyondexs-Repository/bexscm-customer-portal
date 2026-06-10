"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { BookOpen, CalendarDays, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function WelcomeCard() {
  const t = useTranslations("welcomeCard")

  return (
    <section className="relative overflow-hidden rounded-xl border bg-primary/10 p-6 shadow-sm dark:bg-background">
      <div className="relative z-10">
        <p className="text-lg font-semibold">{t("welcomeBack")}</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Crate Inc.<span>👋</span>
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {t("todaySummary")}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
          <Button asChild className="col-span-2 w-full py-5 sm:w-auto">
            <Link href="/order-guide">
              <ShoppingCart className="size-4" />
              {t("startOrderGuide")}
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full py-5 sm:w-auto">
            <Link href="/catalog">
              <BookOpen className="size-4" />
              {t("browseCatalog")}
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full py-5 sm:w-auto">
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
