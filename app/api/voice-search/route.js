import OpenAI from "openai";
import homeData from "../../../data/data.json";
import { NextResponse } from "next/server";
import { requireAnyPageAccess } from "@/lib/security/server-role-access";
 
const openai = new OpenAI({
  apiKey: "REMOVED_OPENAI_API_KEY"
});
 
export async function POST(req) {
  try {
    const permissionError = await requireAnyPageAccess(req, [
      "/catalog",
      "/backoffice/catalog",
    ]);
    if (permissionError) return permissionError;

    const { text } = await req.json();
 
    const categories = homeData.map((cat) => cat.slug);
 
    const subcategories = homeData.flatMap((cat) =>
      cat.subcategories.map((sub) => sub.slug)
    );
 
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: `
Available Categories:
${categories.join(", ")}
 
Available Subcategories:
${subcategories.join(", ")}
 
Return JSON only.
 
For category:
{
  "type": "category",
  "slug": "chicken"
}
 
For subcategory:
{
  "type": "subcategory",
  "slug": "chicken-breast"
}
 
If not found:
{
  "type": null,
  "slug": null
}
`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });
 
    const result = JSON.parse(
      completion.choices[0].message.content
    );
 
    let products = [];
 
    // CATEGORY MATCH
    if (result.type === "category") {
      const category = homeData.find(
        (cat) => cat.slug === result.slug
      );
 
      products =
        category?.subcategories.flatMap(
          (sub) => sub.products
        ) || [];
    }
 
    // SUBCATEGORY MATCH
    if (result.type === "subcategory") {
      const subcategory = homeData
        .flatMap((cat) => cat.subcategories)
        .find((sub) => sub.slug === result.slug);
 
      products = subcategory?.products || [];
    }
 
    return NextResponse.json({
      success: true,
      type: result.type,
      slug: result.slug,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);
 
    return NextResponse.json(
      {
        success: false,
        products: [],
      },
      { status: 500 }
    );
  }
}
