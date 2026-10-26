"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export const MAX_QUANTITY = 9999;

/**
 * Editable quantity field. Lets the user type freely (including clearing the
 * field) and only commits a valid, clamped number on blur / Enter.
 * Escape discards the edit.
 */
export function QuantityInput({ value, onCommit, disabled = false, label, className }) {
  const [draft, setDraft] = useState(null); // null = not editing, show `value`

  function commit() {
    if (draft === null) return;
    const parsed = parseInt(draft, 10);
    setDraft(null);
    if (!Number.isFinite(parsed)) return; // empty -> revert to current value
    const next = Math.min(MAX_QUANTITY, Math.max(1, parsed));
    if (next !== value) onCommit(next);
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
      aria-label={label}
      disabled={disabled}
      value={draft ?? String(value)}
      onFocus={(event) => event.target.select()}
      onChange={(event) => setDraft(event.target.value.replace(/\D/g, "").slice(0, String(MAX_QUANTITY).length))}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        } else if (event.key === "Escape") {
          setDraft(null);
          event.currentTarget.blur();
        }
      }}
      className={cn(
        "h-full min-w-0 border-0 bg-muted/50 px-0 text-center text-xs font-normal text-foreground outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:opacity-50",
        className,
      )}
    />
  );
}