/**
 * Stage 2: Thought Archetype Classification
 * Uses Llama-3.2-3B-Instruct to categorise
 * intrusive thoughts into one of eight thematic archetypes.
 */

import { callHFChatCompletion } from "./hf-client";
import type { ThoughtArchetype } from "./types";

const MODEL_ID = "meta-llama/Llama-3.2-3B-Instruct";

const SYSTEM_PROMPT = `You are a clinical psychology assistant.
Categorize the user's intrusive thought into exactly one of these 8 archetypes:

- catastrophiser: predicting worst-case outcomes
- contaminator: fear of contamination, germs, or causing illness/harm
- imposter: feeling like a fraud, questioning self-worth
- intrude: unwanted violent, disturbing, or shocking imagery
- perfectionist: fear of making mistakes, asymmetry, needing exactness
- detacher: dissociation, feeling disconnected from reality
- relationshipist: fears of abandonment, losing loved ones
- spiralist: generalized spiralling anxiety and doom

Respond with ONLY a JSON object containing an "archetype" field with exactly one of those 8 string values.

Example:
{"archetype": "contaminator"}`;

export async function classifyThought(input: string): Promise<ThoughtArchetype> {
  try {
    const raw = await callHFChatCompletion(MODEL_ID, SYSTEM_PROMPT, `User input: "${input}"\n\nJSON response:`, {
      maxTokens: 50,
      temperature: 0.1,
    });

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return "spiralist";

    const parsed = JSON.parse(jsonMatch[0]);
    const archetype = parsed.archetype?.toLowerCase();

    const validArchetypes = [
      "catastrophiser", "contaminator", "imposter", "intrude", 
      "perfectionist", "detacher", "relationshipist", "spiralist"
    ];

    if (validArchetypes.includes(archetype)) {
      return archetype as ThoughtArchetype;
    }

    return "spiralist";
  } catch (error) {
    console.error("Thought classification failed, defaulting to spiralist:", error);
    return "spiralist";
  }
}
