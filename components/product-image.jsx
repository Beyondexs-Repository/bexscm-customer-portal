"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { GetItems } from "@/redux/slices/getSlice"
import { getCustomerNumber } from "@/lib/customer"
import { getProductImage } from "@/lib/product-images"

function ImageSource({ image, fallback, alt, ...props }) {
  const [failed, setFailed] = useState(false)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      src={failed ? fallback : image}
      alt={alt}
      onError={() => {
        if (image !== fallback) setFailed(true)
      }}
    />
  )
}

export default function ProductImage({ item, src = "", alt = "", ...props }) {
  const dispatch = useDispatch()
  const items = useSelector(state => state.getSlice.itemsData)
  const status = useSelector(state => state.getSlice.itemsStatus)

  // Also handles opening orders or invoices before visiting the catalog.
  useEffect(() => {
    if (status === "idle" && getCustomerNumber()) dispatch(GetItems())
  }, [dispatch, status])

  const { image, fallback } = getProductImage(item, items, src)
  return (
    <ImageSource
      key={`${image}:${fallback}`}
      image={image}
      fallback={fallback}
      alt={alt || item.name || item.itemDescription || "Product"}
      {...props}
    />
  )
}
