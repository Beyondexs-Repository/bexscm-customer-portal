import Promotions from "@/components/promotions/Promotions"

export default async function Page({ searchParams }) {
  const { created } = await searchParams
  let createdPromotion = null

  try {
    createdPromotion = created ? JSON.parse(created) : null
  } catch {
    createdPromotion = null
  }

  return <Promotions createdPromotion={createdPromotion} />
}
