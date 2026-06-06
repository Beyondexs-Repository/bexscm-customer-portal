"use client";

import { BookOpen, CalendarDays, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WelcomeCard() {

	

  return (
    <section className="relative overflow-hidden rounded-xl border bg-primary/10 dark:bg-background p-6 shadow-sm">
      <div className="relative z-10">
        <p className="text-lg font-semibold">Welcome back,</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Company Name<span>👋</span>
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your account today.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="py-5">
            <Link href="/quick-order">
              <ShoppingCart className="size-4" />
              Start Quick Order
            </Link>
          </Button>

          <Button asChild variant="outline" className="py-5">
            <Link href="/catalog">
              <BookOpen className="size-4" />
              Browse Catalog
            </Link>
          </Button>

          <Button asChild variant="outline" className="py-5">
            <Link href="/my-orders">
              <CalendarDays className="size-4" />
              View Orders
            </Link>
          </Button>
        </div>
      </div>

      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-200/40 blur-2xl" />
      <div className="absolute -bottom-12 right-20 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
    </section>
  );
}
