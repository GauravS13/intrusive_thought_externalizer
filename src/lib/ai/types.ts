/**
 * Core types for the Intrusive Thought Externalizer AI pipeline.
 */

export type SafetyResult = "safe" | "distress" | "crisis";

export type ThoughtArchetype =
  | "catastrophiser"
  | "contaminator"
  | "imposter"
  | "intrude"
  | "perfectionist"
  | "detacher"
  | "relationshipist"
  | "spiralist";

export interface CharacterProfile {
  name: string;
  height: string;
  physicalDescription: string;
  personality: string[];
  originStory: string;
  worries: string[];
  catchphrase: string;
  archetype: ThoughtArchetype;
  altText?: string;
}

export interface GeneratedCharacter {
  id: string;
  profile: CharacterProfile;
  imageBase64: string;
  psychoeducation: PsychoeducationContent;
  thoughtInput: string;
  createdAt: number;
}

export interface PsychoeducationContent {
  technique: string;
  normalization: string;
  copingStrategy: string;
  archetype: ThoughtArchetype;
}

export interface PipelineResult {
  status: "success" | "crisis" | "distress" | "error";
  character?: GeneratedCharacter;
  errorMessage?: string;
}
