"use client"
import { getCustomerNumber } from "@/lib/customer"

import * as React from "react"
import {
  FileSpreadsheetIcon,
  FileTextIcon,
  ImageIcon,
  CheckCircle2Icon,
  Loader2Icon,
  Trash2Icon,
  UploadCloudIcon,
  ShoppingCartIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCart } from "@/app/context/app-context"

interface FileItem {
  id: string
  file: File
  name: string
  size: string
  extension: string
  progress: number
  status: "pending" | "uploading" | "completed" | "error"
}

interface UploadModalCart {
  importDocumentCartApi: (params: { file: File; custnmbr?: string }) => Promise<unknown>
  fetchCustomerCart: (custnmbr?: string) => Promise<unknown>
}

export function GlobalUploadModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { importDocumentCartApi, fetchCustomerCart } = (useCart() as unknown) as UploadModalCart
  const [dragActive, setDragActive] = React.useState(false)
  const [files, setFiles] = React.useState<FileItem[]>([])
  const [isUploading, setIsUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const handleFiles = (incomingFiles: FileList | File[]) => {
    const fileList = Array.from(incomingFiles)
    if (fileList.length === 0) return

    const newItems: FileItem[] = fileList.map((f) => {
      const ext = (f.name.split(".").pop() || "").toLowerCase()
      return {
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        name: f.name,
        size: formatFileSize(f.size),
        extension: ext,
        progress: 0,
        status: "pending",
      }
    })

    setFiles((prev) => [...prev, ...newItems])
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const startUpload = async () => {
    if (files.length === 0 || isUploading) return
    setIsUploading(true)

    const selectedFile = files[0]?.file

    // Progress animation
    for (let p = 25; p <= 100; p += 35) {
      await new Promise((resolve) => setTimeout(resolve, 120))
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          progress: p,
          status: p === 100 ? "completed" : "uploading",
        }))
      )
    }

    try {
      // 1. Exclusively call POST https://crateapi.bexlgems.com/api/cartimport/import-document with CustNmbr: "400001" and File
      const response = await importDocumentCartApi({
        file: selectedFile,
        custnmbr: getCustomerNumber(),
      })
      console.log("Import document API response:", response)

      // 2. Immediately call GET Cart API (/cart/customer/400001) to fetch updated items from backend cart table!
      await fetchCustomerCart(getCustomerNumber())

      toast.success("Document imported successfully into cart!")
    } catch (error: unknown) {
      console.error("Import document API error:", error)
      const errorMsg = error instanceof Error ? error.message : "Failed to import document"
      toast.error(`Import Document Failed: ${errorMsg}`)
    } finally {
      setIsUploading(false)
      setFiles([])
      onOpenChange(false)
    }
  }

  const getFileIcon = (ext: string) => {
    if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) {
      return <ImageIcon className="size-4 text-primary" />
    }
    if (["csv", "xls", "xlsx"].includes(ext)) {
      return <FileSpreadsheetIcon className="size-4 text-emerald-600" />
    }
    return <FileTextIcon className="size-4 text-sky-600" />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden sm:max-w-xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            <UploadCloudIcon className="size-6 text-primary" />
            Import Document & Add to Cart
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition-all ${
              dragActive
                ? "border-primary bg-primary/5 scale-[0.99]"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".csv,.xlsx,.xls,.pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={handleInputChange}
              className="hidden"
            />
            <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
              <UploadCloudIcon className="size-7" />
            </div>
            <p className="text-base font-semibold text-foreground">
              Click to browse or drag & drop document file here
            </p>
            <p className="text-xs text-muted-foreground mt-1.5 max-w-md leading-relaxed">
              Supports Image (PNG/JPG), PDF, Word Document, CSV or Excel files (up to 25MB). Data reader automatically extracts items to add to your cart.
            </p>
          </div>

          {/* Selected File List */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium px-1">
                <span>Selected Files ({files.length})</span>
                <button
                  type="button"
                  onClick={() => setFiles([])}
                  className="text-destructive hover:underline text-[11px]"
                >
                  Clear All
                </button>
              </div>

              {files.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg border bg-card text-card-foreground shadow-2xs"
                >
                  <div className="size-9 rounded-md bg-muted flex items-center justify-center shrink-0">
                    {getFileIcon(item.extension)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold truncate text-foreground">
                        {item.name}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {item.size}
                      </span>
                    </div>

                    {item.status === "uploading" && (
                      <div className="mt-1.5 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-200"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {item.status === "completed" ? (
                    <CheckCircle2Icon className="size-4 text-emerald-500 shrink-0" />
                  ) : item.status === "uploading" ? (
                    <Loader2Icon className="size-4 text-primary animate-spin shrink-0" />
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(item.id)
                      }}
                      className="size-7 text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="m-0 p-4 sm:px-6 sm:py-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t bg-muted/30 rounded-b-xl">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={startUpload}
            disabled={files.length === 0 || isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Reading & Importing...
              </>
            ) : (
              <>
                <ShoppingCartIcon className="size-4" />
                Import & Add to Cart ({files.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
