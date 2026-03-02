/**
 * Stage 3: Character Personality Generation
 * Uses Mistral-7B-Instruct via the OpenAI-compatible chat endpoint.
 * The character is always warm, ineffectual, slightly absurd — never threatening.
 */

import { callHFChatCompletion } from "./hf-client";
import type { CharacterProfile, ThoughtArchetype } from "./types";

const MODEL_ID = "meta-llama/Llama-3.2-3B-Instruct";

const ARCHETYPE_FLAVOURS: Record<ThoughtArchetype, string> = {
  catastrophiser: "a chronic worrier who predicts absurd worst-case scenarios that never happen",
  contaminator: "a paranoid neat freak who sees invisible threats everywhere but is completely harmless",
  imposter: "a self-doubting creature with a clipboard who checks credentials nobody asked for",
  intrude: "a shocking little gremlin who tries to be scary but trips over its own shoelaces",
  perfectionist: "an obsessive organiser who rearranges everything but never finishes",
  detacher: "a foggy, confused entity who wanders between dimensions and forgets where it is",
  relationshipist: "a clingy creature who writes dramatic farewell letters to people still in the room",
  spiralist: "a dizzy creature trapped on an imaginary downward spiral that's actually a flat surface",
};

const SYSTEM_PROMPT = `You are a creative character designer for a therapeutic app that helps people externalise intrusive thoughts as harmless, slightly ridiculous cartoon characters.

Create a character that personifies the user's intrusive thought. The character must be:
- Warm, non-threatening, and slightly comedic
- Fundamentally ineffectual — it tries to cause worry but always fails
- Small (under 6 inches tall), physically absurd, cartoonish
- Never dangerous, powerful, or accurate in its predictions

Respond with ONLY a JSON object (no markdown, no explanation):
{
  "name": "A real human first name — warm and slightly old-fashioned",
  "height": "Physical height, always under 6 inches, be specific and funny",
  "physicalDescription": "Detailed physical appearance: clothing, features, quirks. Must be cartoon-like and non-threatening. 2-3 sentences.",
  "personality": ["adjective1", "adjective2", "adjective3"],
  "originStory": "One sentence origin story. Slightly absurd. Include a specific year.",
  "worries": ["worry1", "worry2", "worry3"],
  "catchphrase": "A signature phrase the character says when appearing. Should be slightly ridiculous."
}

JSON only. No extra text.`;

function buildUserMessage(
  thoughtSummary: string,
  archetype: ThoughtArchetype
): string {
  const flavour = ARCHETYPE_FLAVOURS[archetype];
  return `The user had this intrusive thought: "${thoughtSummary}"
Thought archetype: ${archetype} — ${flavour}

Generate the character JSON.`;
}

export async function generateCharacter(
  thoughtInput: string,
  archetype: ThoughtArchetype
): Promise<CharacterProfile> {
  try {
    const raw = await callHFChatCompletion(
      MODEL_ID,
      SYSTEM_PROMPT,
      buildUserMessage(thoughtInput, archetype),
      {
        maxTokens: 500,
        temperature: 0.75,
        topP: 0.9,
      }
    );

    // Extract JSON from response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return getFallbackCharacter(archetype);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      name: parsed.name || getFallbackCharacter(archetype).name,
      height: parsed.height || "3.2 inches",
      physicalDescription: parsed.physicalDescription || "A small, round creature with oversized glasses and a slightly too-big overcoat.",
      personality: Array.isArray(parsed.personality) ? parsed.personality.slice(0, 3) : ["anxious", "bumbling", "well-meaning"],
      originStory: parsed.originStory || `Has been worrying since approximately ${1980 + Math.floor(Math.random() * 30)}.`,
      worries: Array.isArray(parsed.worries) ? parsed.worries.slice(0, 3) : ["Everything", "Nothing specific", "The concept of worry itself"],
      catchphrase: parsed.catchphrase || "But have you considered the WORST possible outcome?",
      archetype,
    };
  } catch (error) {
    console.error("Character generation failed, using fallback:", error);
    return getFallbackCharacter(archetype);
  }
}

function getFallbackCharacter(archetype: ThoughtArchetype): CharacterProfile {
  const fallbacks: Record<ThoughtArchetype, CharacterProfile> = {
    catastrophiser: {
      name: "Gerald",
      height: "4.1 inches",
      physicalDescription: "A round, pear-shaped creature wearing a tiny overcoat three sizes too big. Has enormous eyes that are always darting around nervously, and carries a miniature clipboard covered in illegible doom predictions.",
      personality: ["dramatic", "exhausting", "secretly cowardly"],
      originStory: "Has been catastrophising since 1987, when a slightly overcast sky convinced him the sun was dying.",
      worries: ["The structural integrity of literally everything", "Whether he locked the imaginary door", "The eventual heat death of the universe"],
      catchphrase: "Oh no, oh no, OH NO — this is EXACTLY how it starts!",
      archetype,
    },
    contaminator: {
      name: "Mildred",
      height: "2.8 inches",
      physicalDescription: "A tiny creature wrapped head to toe in miniature bubble wrap, wearing rubber gloves over rubber gloves. Walks on tiptoe everywhere and flinches if a dust particle comes within three feet.",
      personality: ["hyper-vigilant", "squeamish", "oddly fastidious"],
      originStory: "Emerged in 1996 after misreading an article about bacteria on kitchen sponges.",
      worries: ["Doorknobs", "Other people's sneezes", "That weird smudge on the counter"],
      catchphrase: "DON'T TOUCH THAT — do you know where that's BEEN?",
      archetype,
    },
    imposter: {
      name: "Reginald",
      height: "3.5 inches",
      physicalDescription: "A perpetually sweating creature wearing an oversized graduation cap that keeps falling over his eyes. Carries a fake diploma that he nervously shows to everyone while mumbling about his qualifications.",
      personality: ["insecure", "over-explaining", "apologetic"],
      originStory: "Appeared in 2003 after someone asked 'so what do you actually DO?' at a party.",
      worries: ["Being found out", "Someone checking his references", "Whether he's qualified to worry"],
      catchphrase: "They're ALL going to figure out you don't belong here!",
      archetype,
    },
    intrude: {
      name: "Bartholomew",
      height: "2.3 inches",
      physicalDescription: "A tiny, spiky-haired gremlin trying desperately to look scary but keeps tripping over its own shoelaces. Wears a miniature leather jacket with 'SCARY' written in crayon on the back.",
      personality: ["attention-seeking", "clumsy", "surprisingly shy"],
      originStory: "Tried to be terrifying since 1991 but once cried because a butterfly startled him.",
      worries: ["Not being taken seriously", "Running out of shocking material", "Loud noises"],
      catchphrase: "WHAT IF — wait, sorry, what was I saying? Oh yes — WHAT IF—",
      archetype,
    },
    perfectionist: {
      name: "Eunice",
      height: "3.9 inches",
      physicalDescription: "An impossibly tidy creature with a ruler perpetually in hand, wearing a perfectly pressed tiny lab coat. Spends more time arranging than doing, and has colour-coded her colour codes.",
      personality: ["meticulous", "paralysed", "quietly frantic"],
      originStory: "Came into existence in 2001 after spending four hours aligning a picture frame to within 0.001 degrees.",
      worries: ["Asymmetry", "Typos in texts already sent", "Whether this worry list is properly formatted"],
      catchphrase: "No no NO, start over — it has to be PERFECT.",
      archetype,
    },
    detacher: {
      name: "Fogsworth",
      height: "4.0 inches",
      physicalDescription: "A translucent, slightly blurry creature who looks like a watercolour painting left in the rain. Constantly walks into walls because he forgets they're there, and speaks in a dreamy, disconnected mumble.",
      personality: ["vague", "forgetful", "peacefully confused"],
      originStory: "Drifted into existence sometime around 2009, probably. Or was it 2012? He can't quite remember.",
      worries: ["Whether anything is real", "If he left the oven on in another dimension", "What was the question again?"],
      catchphrase: "Am I here? Are you here? Is 'here' even here?",
      archetype,
    },
    relationshipist: {
      name: "Clementine",
      height: "3.1 inches",
      physicalDescription: "A teary-eyed creature carrying a stack of handwritten farewell letters, wearing a tiny scarf that she dramatically tosses over her shoulder every few seconds. Has a locket containing a photo of someone she met once at a bus stop.",
      personality: ["theatrical", "clingy", "catastrophically romantic"],
      originStory: "Appeared in 1999 after texting someone 'hi' and not receiving a reply within eleven minutes.",
      worries: ["That silence means abandonment", "Everyone secretly hates her", "Being forgotten by people who are literally standing next to her"],
      catchphrase: "They haven't texted back in FOUR MINUTES. This is THE END.",
      archetype,
    },
    spiralist: {
      name: "Douglas",
      height: "3.4 inches",
      physicalDescription: "A dizzy, perpetually spinning creature wearing a tiny tin-foil hat. Has spiral-shaped eyes and leaves a trail of confetti-like anxiety wherever he walks. Carries a megaphone but only whispers into it.",
      personality: ["doom-laden", "circular", "exhaustingly energetic"],
      originStory: "Started spiralling in 2005 and has never quite found the bottom — mainly because there isn't one.",
      worries: ["Everything leading to everything else leading to doom", "The spiral getting faster", "Running out of things to spiral about"],
      catchphrase: "AND ANOTHER THING — this is all connected, you know!",
      archetype,
    },
  };

  return fallbacks[archetype];
}
