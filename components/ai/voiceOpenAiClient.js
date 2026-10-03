"use client";
import { buildApiUrl } from "@/lib/api/apiClient"

import { DEFAULT_AUTHORIZATION_TOKEN } from "@/lib/api/apiClient";
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

function parseAiResponse(data, transcript = "") {
  try {
    const result = typeof data === "string" ? JSON.parse(data) : data;
    const rawAction = (result.action || "search").toLowerCase();
    const lowerTranscript = (transcript || "").toLowerCase();

    let action = rawAction;
    let quantity = Number(result.quantity) || 1;
    let searchText = result.searchText || "";

    // Parse explicit numbers from transcript if not set or default
    const numberWords = {
      one: 1, two: 2, three: 3, four: 4, five: 5,
      six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    };
    const match = lowerTranscript.match(/\d+/);
    if (match) {
      quantity = Math.max(1, parseInt(match[0], 10));
    } else {
      for (const [word, num] of Object.entries(numberWords)) {
        if (lowerTranscript.includes(word)) {
          quantity = num;
          break;
        }
      }
    }

    // Intent refinement: if transcript explicitly requests adding to cart or increasing item count
    if (
      action === "search" &&
      (lowerTranscript.includes("add") ||
        lowerTranscript.includes("cart") ||
        lowerTranscript.includes("buy") ||
        lowerTranscript.includes("put"))
    ) {
      action = "add";
      if (!searchText || searchText.toLowerCase().includes("add to cart")) {
        searchText = lowerTranscript
          .replace(/add\s+(to\s+cart\s+)?/gi, "")
          .replace(/put\s+in\s+cart\s+/gi, "")
          .trim();
      }
    }

    return {
      action,
      productId: result.productId ? String(result.productId) : "",
      searchText,
      quantity,
      productNumbers: Array.isArray(result.productNumbers)
        ? result.productNumbers.map(Number).filter(Boolean)
        : [],
    };
  } catch {
    const lowerTranscript = (transcript || "").toLowerCase();
    const isAddIntent =
      lowerTranscript.includes("add") ||
      lowerTranscript.includes("cart") ||
      lowerTranscript.includes("buy") ||
      lowerTranscript.includes("put");

    return {
      action: isAddIntent ? "add" : "search",
      productId: "",
      searchText: typeof data === "string" ? data : transcript || "",
      quantity: 1,
      productNumbers: [],
    };
  }
}

export async function askVoiceAi({ transcript, products }) {
  // 1. Try backend voice API first
  try {
    const response = await fetch(buildApiUrl("/voice/command"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: DEFAULT_AUTHORIZATION_TOKEN,
      },
      body: JSON.stringify({ transcript }),
    });

    if (response.ok) {
      const data = await response.json();
      return parseAiResponse(data, transcript);
    }
  } catch (err) {
    console.warn("Backend voice command API failed, attempting OpenAI fallback:", err);
  }

  // 2. Fallback to OpenAI API if available
  if (OPENAI_API_KEY && OPENAI_API_KEY !== "PASTE_OPENAI_API_KEY_HERE") {
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

    return parseAiResponse(data.choices?.[0]?.message?.content || "", transcript);
  }

  throw new Error("Voice API request failed and no OpenAI fallback available.");
}
