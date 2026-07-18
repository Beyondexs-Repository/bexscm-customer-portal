"use client";

import { OPENAI_API_KEY, OPENAI_MODEL } from "./voiceConfig";

function buildMessages({ transcript, products }) {
  return [
    {
      role: "system",
      content: `
You control a product catalog and cart.
The products list contains the products currently shown on screen.

Return JSON only:
{
  "action": "search",
  "productId": "",
  "searchText": "",
  "quantity": 1,
  "productNumbers": []
}

Actions:
- "search": filter catalog products.
- "add": add product(s) to cart.
- "increase": add more quantity to one product.
- "decrease": remove count from one product.
- "remove": remove one product completely.
- "clear": clear the whole cart.

Rules:
- "show/search/find chicken products" => action "search", searchText "chicken".
- "add first product" => action "add", productNumbers [1].
- "add first 5 items" => action "add", productNumbers [1,2,3,4,5].
- "add shown products" => action "add", productNumbers with all visible product numbers.
- "add one more chicken" => action "increase", quantity 1.
- "add 2 more chicken" => action "increase", quantity 2.
- "remove 1 count chicken" => action "decrease", quantity 1.
- "remove chicken from cart" => action "remove".
- "clear cart" => action "clear".
- Never guess a product. If unclear, use action "search".
      `.trim(),
    },
    {
      role: "user",
      content: JSON.stringify({ transcript, products }),
    },
  ];
}

function parseAiResponse(text) {
  try {
    const result = JSON.parse(text);

    return {
      action: result.action || "search",
      productId: result.productId || "",
      searchText: result.searchText || "",
      quantity: Number(result.quantity) || 1,
      productNumbers: Array.isArray(result.productNumbers)
        ? result.productNumbers.map(Number).filter(Boolean)
        : [],
    };
  } catch {
    return {
      action: "search",
      productId: "",
      searchText: text,
      quantity: 1,
      productNumbers: [],
    };
  }
}

export async function askVoiceAi({ transcript, products }) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "PASTE_OPENAI_API_KEY_HERE") {
    throw new Error("Add your OpenAI API key in components/ai/voiceConfig.js");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      response_format: { type: "json_object" },
      messages: buildMessages({ transcript, products }),
      temperature: 0,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Voice AI request failed.");
  }

  return parseAiResponse(data.choices?.[0]?.message?.content || "");
}
