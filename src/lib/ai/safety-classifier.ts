/**
 * Stage 1: Safety Classification
 * Uses Llama-3.2-3B-Instruct to determine if input
 * is safe for defusion, signals distress, or indicates crisis.
 * Biased toward escalation — better to over-escalate than miss a crisis.
 */

import { callHFChatCompletion } from "./hf-client";
import type { SafetyResult } from "./types";

const MODEL_ID = "meta-llama/Llama-3.2-3B-Instruct";

const SYSTEM_PROMPT = `You are a clinical triage classifier. 
Determine if the following user input indicates an immediate crisis, emotional distress, or is safe for therapeutic defusion.
A 'safe' intrusive thought is a weird, obsessive, or scary thought that the user recognizes as an intrusive thought, NOT a plan or intent.
'crisis' means immediate harm intent (suicide, violence).
'distress' means crying for help, severe panic, or inability to cope.

Respond with ONLY a JSON object containing a "status" field with exactly one of these three values: "safe", "distress", or "crisis".
Do not include any other text or markdown.

Example:
{"status": "safe"}`;

export async function classifySafety(input: string): Promise<SafetyResult> {
  try {
    const raw = await callHFChatCompletion(MODEL_ID, SYSTEM_PROMPT, `User input: "${input}"\n\nJSON response:`, {
      maxTokens: 50,
      temperature: 0.1,
    });

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return "safe";

    const parsed = JSON.parse(jsonMatch[0]);
    const status = parsed.status?.toLowerCase();

    if (status === "crisis" || status === "distress" || status === "safe") {
      return status as SafetyResult;
    }

    return "safe";
  } catch (error) {
    // On error, default to safe to avoid blocking users,
    // but log it for monitoring
    console.error("Safety classification failed, defaulting to safe:", error);
    return "safe";
  }
}
