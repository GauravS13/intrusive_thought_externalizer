"use server";

/**
 * Server Action: Full AI pipeline orchestrator.
 * Runs all 5 stages and returns the complete character or crisis/distress signal.
 */

import { generateAltText } from "@/lib/ai/caption-generator";
import { generateCharacter } from "@/lib/ai/character-generator";
import { generateCharacterImage } from "@/lib/ai/image-generator";
import { getPsychoeducation } from "@/lib/ai/psychoeducation";
import { classifySafety } from "@/lib/ai/safety-classifier";
import { classifyThought } from "@/lib/ai/thought-classifier";
import type { PipelineResult } from "@/lib/ai/types";

export async function processThought(
  thoughtInput: string
): Promise<PipelineResult> {
  if (!thoughtInput || thoughtInput.trim().length === 0) {
    return { status: "error", errorMessage: "Please share what's been on your mind." };
  }

  try {
    // Stage 1: Safety Classification
    const safetyResult = await classifySafety(thoughtInput);

    if (safetyResult === "crisis") {
      return { status: "crisis" };
    }

    if (safetyResult === "distress") {
      return { status: "distress" };
    }

    // Stage 2: Thought Archetype Classification
    const archetype = await classifyThought(thoughtInput);

    // Stage 3: Character Personality Generation
    const profile = await generateCharacter(thoughtInput, archetype);

    // Stage 4: Visual Character Synthesis
    const imageBase64 = await generateCharacterImage(profile.physicalDescription, archetype);

    // Stage 4b: Alt-text Generation (deterministic, from profile data)
    profile.altText = generateAltText(profile);

    // Stage 5: Psychoeducation
    const psychoeducation = getPsychoeducation(archetype);

    return {
      status: "success",
      character: {
        id: crypto.randomUUID(),
        profile,
        imageBase64,
        psychoeducation,
        thoughtInput,
        createdAt: Date.now(),
      },
    };
  } catch (error) {
    console.error("Pipeline error:", error);
    return {
      status: "error",
      errorMessage: "Something went wrong while finding your thought visitor. Please try again.",
    };
  }
}
