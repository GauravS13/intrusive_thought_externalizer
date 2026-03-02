/**
 * HuggingFace Inference API client with retry logic and cold start handling.
 * Uses the new router.huggingface.co endpoint (the old api-inference endpoint is deprecated).
 *
 * Two endpoints:
 * - hf-inference/models: For task-specific models (classification, embeddings, etc.)
 * - v1/chat/completions: OpenAI-compatible endpoint for LLM text generation
 */

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
const REQUEST_TIMEOUT_MS = 60000; // 60s timeout per request

// Task-specific models (classification, image generation)
const HF_BASE_URL = "https://router.huggingface.co/hf-inference/models";
// OpenAI-compatible chat endpoint for LLMs
const HF_CHAT_URL = "https://router.huggingface.co/v1/chat/completions";

interface HFClassificationResponse {
  sequence: string;
  labels: string[];
  scores: number[];
}

interface HFCaptioningResponse {
  generated_text: string;
}

/**
 * Fetch with timeout using AbortController
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = REQUEST_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Check if an error status code is retriable (cold starts, rate limits, server errors)
 */
function isRetriable(status: number): boolean {
  return status === 429 || status === 503 || status === 504 || status >= 500;
}

/**
 * OpenAI-compatible chat completions endpoint.
 * Use this for LLMs (Mistral, Llama, etc.) — the hf-inference path doesn't support them.
 */
export async function callHFChatCompletion(
  modelId: string,
  systemPrompt: string,
  userMessageOrHistory: string | { role: string; content: string }[],
  options: {
    maxTokens?: number;
    temperature?: number;
    topP?: number;
  } = {}
): Promise<string> {
  const {
    maxTokens = 500,
    temperature = 0.7,
    topP = 0.9,
  } = options;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const messagesToIterate = typeof userMessageOrHistory === "string" 
        ? [{ role: "user", content: userMessageOrHistory }] 
        : userMessageOrHistory;

      const response = await fetchWithTimeout(HF_CHAT_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: "system", content: systemPrompt },
            ...messagesToIterate,
          ],
          max_tokens: maxTokens,
          temperature,
          top_p: topP,
        }),
      });

      if (isRetriable(response.status)) {
        const delay = RETRY_DELAY_MS * (attempt + 1);
        console.warn(`HF Chat ${response.status} (attempt ${attempt + 1}/${MAX_RETRIES}), retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        const shortError = errorBody.slice(0, 200);
        console.error(`HF Chat error ${response.status}: ${shortError}`);
        if (attempt === MAX_RETRIES - 1)
          throw new Error(`HF Chat error: ${response.status}`);
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content ?? "";
      return cleanOutput(content);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.warn(`HF Chat timeout (attempt ${attempt + 1}/${MAX_RETRIES})`);
      }
      if (attempt === MAX_RETRIES - 1) throw error;
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
    }
  }
  throw new Error("HF Chat API failed after retries");
}

export async function callHFZeroShotClassification(
  modelId: string,
  text: string,
  candidateLabels: string[]
): Promise<HFClassificationResponse> {
  const url = `${HF_BASE_URL}/${modelId}`;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
          "x-wait-for-model": "true",
        },
        body: JSON.stringify({
          inputs: text,
          parameters: { candidate_labels: candidateLabels },
        }),
      });

      if (isRetriable(response.status)) {
        const delay = RETRY_DELAY_MS * (attempt + 1);
        console.warn(`HF Classification ${response.status} (attempt ${attempt + 1}/${MAX_RETRIES}), retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        const shortError = errorBody.slice(0, 200);
        console.error(`HF Classification error ${response.status}: ${shortError}`);
        if (attempt === MAX_RETRIES - 1)
          throw new Error(`HF Classification error: ${response.status}`);
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }

      return (await response.json()) as HFClassificationResponse;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.warn(`HF Classification timeout (attempt ${attempt + 1}/${MAX_RETRIES})`);
      }
      if (attempt === MAX_RETRIES - 1) throw error;
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
    }
  }
  throw new Error("HF Classification API failed after retries");
}

export async function callHFImageGeneration(
  modelId: string,
  prompt: string,
  negativePrompt?: string
): Promise<string> {
  const url = `${HF_BASE_URL}/${modelId}`;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
          "x-wait-for-model": "true",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: negativePrompt,
          },
        }),
      }, 90000); // 90s timeout for image generation (it's slower)

      if (isRetriable(response.status)) {
        const delay = RETRY_DELAY_MS * (attempt + 1);
        console.warn(`HF Image ${response.status} (attempt ${attempt + 1}/${MAX_RETRIES}), retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        const shortError = errorBody.slice(0, 200);
        console.error(`HF Image error ${response.status}: ${shortError}`);
        if (attempt === MAX_RETRIES - 1)
          throw new Error(`HF Image error: ${response.status}`);
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }

      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.warn(`HF Image timeout (attempt ${attempt + 1}/${MAX_RETRIES})`);
      }
      if (attempt === MAX_RETRIES - 1) throw error;
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
    }
  }
  throw new Error("HF Image API failed after retries");
}

export async function callHFImageCaptioning(
  modelId: string,
  imageBlob: Blob
): Promise<string> {
  const url = `${HF_BASE_URL}/${modelId}`;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/octet-stream",
          "x-wait-for-model": "true",
        },
        body: imageBlob,
      });

      if (isRetriable(response.status)) {
        const delay = RETRY_DELAY_MS * (attempt + 1);
        console.warn(`HF Captioning ${response.status} (attempt ${attempt + 1}/${MAX_RETRIES}), retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        const shortError = errorBody.slice(0, 200);
        console.error(`HF Captioning error ${response.status}: ${shortError}`);
        if (attempt === MAX_RETRIES - 1)
          throw new Error(`HF Captioning error: ${response.status}`);
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }

      const data = (await response.json()) as HFCaptioningResponse[];
      return data[0]?.generated_text ?? "An illustrated character";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.warn(`HF Captioning timeout (attempt ${attempt + 1}/${MAX_RETRIES})`);
      }
      if (attempt === MAX_RETRIES - 1) throw error;
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
    }
  }
  throw new Error("HF Captioning API failed after retries");
}

function cleanOutput(raw: string): string {
  return raw
    .replace(/^\s*(Here is|Here's|Below is|The following is)[^:\n]*[:]\s*/i, "")
    .replace(/\[\/INST\]/g, "")
    .replace(/\[INST\]/g, "")
    .replace(/^(Sure|Certainly|Of course)[,!.][^\n]*\n/i, "")
    .trim();
}
