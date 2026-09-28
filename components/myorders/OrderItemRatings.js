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

function ItemReview({ item, feedback = {}, onChange, onImageLoading }) {
  const { rating = null, review = "", image = "" } = feedback;
  const [readingImage, setReadingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  function uploadImage(event) {
    const file = event.target.files?.[0];
    setImageError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Please select an image.");
      return;
    }
    setReadingImage(true);
    onImageLoading(1);
    const reader = new FileReader();
    reader.onload = () => {
       onChange({ image: reader.result, imageFile: file }) 
      setReadingImage(false);
      onImageLoading(-1);
    };
    reader.onerror = () => {
      setImageError("Could not read this image. Please try again.");
      setReadingImage(false);
      onImageLoading(-1);
    };
    reader.readAsDataURL(file);
  }
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
            onClick={() => onChange({ rating: rating === "up" ? null : "up" })}
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
            onClick={() => onChange({ rating: rating === "down" ? null : "down" })}
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
              onChange={(event) => onChange({ review: event.target.value })}
              placeholder="Tell us what could be better…"
              className="block w-full resize-y rounded-sm border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Upload image
            <Input type="file" accept="image/*" className="rounded-sm" onChange={uploadImage} disabled={readingImage} />
          </label>
          {readingImage && <p className="text-xs text-muted-foreground" role="status">Loading image…</p>}
          {imageError && <p className="text-xs text-destructive" role="alert">{imageError}</p>}
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={`Feedback for ${item.name}`} className="h-20 w-28 rounded-md object-cover" />
          )}
        </div>
      )}
    </article>
  );
}
export function buildRatingsFormData(items, ratings) {
  const formData = new FormData()
  let index = 0

  items.forEach((item) => {
    const fb = ratings[item.id]
    if (!fb?.rating) return // neither liked nor disliked → skip

    const isPositive = fb.rating === "up"
    const prefix = `items[${index}]`
    // "item-5650" → "5650"
    const orderDetailId = String(item.orderDetailID ?? item.id).replace(/^item-/, "")
    formData.append(`${prefix}.OrderDetailID`, orderDetailId)
    // formData.append(`${prefix}.OrderDetailID`, String(item.orderDetailID ?? item.id))
    formData.append(`${prefix}.IsPositive`, String(isPositive))

    if (!isPositive) {
      if (fb.review?.trim()) formData.append(`${prefix}.Review`, fb.review.trim())
      if (fb.imageFile) formData.append(`${prefix}.ReviewImageFile`, fb.imageFile, fb.imageFile.name)
    }
    index++
  })

  return { formData, count: index }
}

export default function OrderItemRatings({ open, onOpenChange, items, ratings, onSubmit }) {
  const [drafts, setDrafts] = useState(ratings);
  const [loadingImages, setLoadingImages] = useState(0);


const [submitting, setSubmitting] = useState(false);

async function handleSubmit() {
  setSubmitting(true);
  const ok = await onSubmit(drafts);
  setSubmitting(false);
  if (ok !== false) onOpenChange(false);
}
  
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
            <ItemReview
              key={`${item.id ?? item.sku}-${index}`}
              item={item}
              feedback={drafts[item.id]}
              onImageLoading={(change) => setLoadingImages((count) => count + change)}
              onChange={(changes) => setDrafts((current) => ({
                ...current,
                [item.id]: { ...current[item.id], ...changes, date: new Date().toISOString() },
              }))}
            />
          ))}
          {!items.length && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No items to rate.
            </p>
          )}
        </div>
        <DialogFooter>
          {/* <Button disabled={loadingImages > 0} onClick={() => { onSubmit(drafts); onOpenChange(false); }}>
            Submit
          </Button> */}
          <Button disabled={loadingImages > 0 || submitting} onClick={handleSubmit}>
  {submitting ? "Submitting…" : "Submit"}
</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
