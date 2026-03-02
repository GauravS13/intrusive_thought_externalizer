/**
 * Stage 4b: Alt-Text Generation
 * Generates descriptive alt-text for the generated character image.
 *
 * We use the character's own profile data (physical description, name, archetype)
 * to compose a rich, screen-reader-friendly alt-text. This is deterministic,
 * instant, and doesn't depend on any external API.
 */

import type { CharacterProfile } from "./types";

export function generateAltText(profile: CharacterProfile): string {
  const traits = profile.personality?.join(", ") || "whimsical";
  return `A cartoon illustration of ${profile.name}, a tiny ${profile.height} tall ${traits} creature. ${profile.physicalDescription}`;
}
