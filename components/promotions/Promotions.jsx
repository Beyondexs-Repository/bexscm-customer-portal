"use client"

import Link from "next/link"
import { useState } from "react"
import { CalendarDays, ImageIcon, Megaphone, Plus, Tag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { initialPromotions } from "@/data/promotions"

export default function Promotions({ createdPromotion }) {
  const [promotions, setPromotions] = useState(
    createdPromotion
      ? [createdPromotion, ...initialPromotions]
      : initialPromotions,
  )

  function changeStatus(id, active) {
    const updatedPromotions = promotions.map((promotion) =>
      promotion.id === id ? { ...promotion, active } : promotion,
    )

    setPromotions(updatedPromotions)
  }

  const activeCount = promotions.filter((promotion) => promotion.active).length

  return (
    <main className="space-y-4 p-2 sm:p-4">
      <section className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Total Promotions",
            value: promotions.length,
            icon: Megaphone,
            color: "bg-blue-500/10 text-blue-600",
          },
          {
            label: "Active Now",
            value: activeCount,
            icon: Tag,
            color: "bg-emerald-500/10 text-emerald-600",
          },
          {
            label: "Home Page Ads",
            value: promotions.filter(
              (promotion) => promotion.placement === "Home Hero",
            ).length,
            icon: ImageIcon,
            color: "bg-violet-500/10 text-violet-600",
          },
        ].map((item) => {
          const Icon = item.icon

          return (
            <Card key={item.label} size="sm">
              <CardContent className="flex items-center gap-3">
                <span
                  className={`grid size-10 place-items-center rounded-full ${item.color}`}
                >
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-medium">{item.label}</p>
                  <p className="mt-1 text-2xl font-bold">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <Card className="py-0">
        <CardHeader className="border-b py-4">
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Promotions and Ads</CardTitle>
            <Button asChild>
              <Link href="/backoffice/promotions/create">
                <Plus />
                Create Promotion
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Campaign</th>
                  <th className="px-4 py-3 font-medium">Banner Content</th>
                  <th className="px-4 py-3 font-medium">Schedule</th>
                  <th className="px-4 py-3 font-medium">Action Button</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {promotions.map((promotion) => (
                  <tr key={promotion.id} className="hover:bg-muted/30">
                    <td className="px-5 py-4">
                      <p className="font-semibold">{promotion.name}</p>
                    </td>
                    <td className="max-w-sm px-4 py-4">
                      <p className="font-medium">{promotion.headline}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {promotion.description || "Image-Only Banner"}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-2 whitespace-nowrap text-muted-foreground">
                        <CalendarDays className="size-4" />
                        {promotion.schedule}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {promotion.actionLabel ? (
                        <>
                          <p className="font-medium">
                            {promotion.actionLabel}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {promotion.actionUrl}
                          </p>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No Button
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={promotion.active}
                          aria-label={`Toggle ${promotion.name}`}
                          onCheckedChange={(active) =>
                            changeStatus(promotion.id, active)
                          }
                        />
                        <Badge
                          variant="secondary"
                          className={
                            promotion.active
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : "bg-red-500/15 text-red-700 dark:text-red-300"
                          }
                        >
                          {promotion.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
