"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function ItemReview({ item }) {
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");
  return (
    <article className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-3">
        <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-md border bg-muted">
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image}
              alt={item.name}
              className="size-full object-cover"
            />
          ) : (
            <ImageIcon className="size-5 text-muted-foreground" />
          )}
        </div>
        <p className="min-w-0 flex-1 text-sm font-semibold">{item.name}</p>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Like ${item.name}`}
            aria-pressed={rating === "up"}
            onClick={() => setRating(rating === "up" ? null : "up")}
            className={cn(
              "rounded-full",
              rating === "up"
                ? "bg-green-600 text-white hover:bg-green-700 hover:text-white"
                : "bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:text-green-600",
            )}
          >
            <ThumbsUp className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Dislike ${item.name}`}
            aria-pressed={rating === "down"}
            onClick={() => setRating(rating === "down" ? null : "down")}
            className={cn(
              "rounded-full",
              rating === "down"
                ? "bg-red-600 text-white hover:bg-red-700 hover:text-white"
                : "bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-600",
            )}
          >
            <ThumbsDown className="size-4" />
          </Button>
        </div>
      </div>
      {rating === "down" && (
        <div className="mt-3 space-y-3 border-t pt-3">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Review
            <textarea
              rows={3}
              value={review}
              onChange={(event) => setReview(event.target.value)}
              placeholder="Tell us what could be better…"
              className="block w-full resize-y rounded-sm border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Upload image
            <Input type="file" accept="image/*" className="rounded-sm" />
          </label>
        </div>
      )}
    </article>
  );
}

export default function OrderItemRatings({ open, onOpenChange, items }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85svh] flex-col sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Rate your items</DialogTitle>
          <DialogDescription>
            How were the products in your order?
          </DialogDescription>
        </DialogHeader>
        <div className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pr-2">
          {items.map((item, index) => (
            <ItemReview key={`${item.id ?? item.sku}-${index}`} item={item} />
          ))}
          {!items.length && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No items to rate.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
