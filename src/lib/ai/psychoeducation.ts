/**
 * Stage 5: Psychoeducation Templates
 * Static, clinically-appropriate content keyed to the 8 thought archetypes.
 * NOT AI-generated — ensures accuracy and safety.
 */

import type { PsychoeducationContent, ThoughtArchetype } from "./types";

const TEMPLATES: Record<ThoughtArchetype, PsychoeducationContent> = {
  catastrophiser: {
    technique:
      "This is cognitive defusion through externalisation. By giving your catastrophising thought a name and a face, you've separated it from yourself. You are not the catastrophe — you are the person observing the catastrophiser.",
    normalization:
      "Catastrophic thinking is one of the most common intrusive thought patterns, experienced by over 80% of people. Your brain is trying to protect you by imagining worst-case scenarios — it's an overeager security system, not a crystal ball.",
    copingStrategy:
      "When this character appears, try saying: 'Oh, it's you again.' Notice the thought without engaging with its content. You don't need to argue with it, fix it, or believe it. Just notice it, name it, and let it pass.",
    archetype: "catastrophiser",
  },
  contaminator: {
    technique:
      "Externalisation helps you see contamination fears as a separate visitor, not a reflection of reality. The character you've created is the worry itself — not evidence that something is actually contaminated.",
    normalization:
      "Contamination-related intrusive thoughts are extremely common and do not indicate that you are at risk. Research shows these thoughts are a normal byproduct of your brain's threat-detection system being slightly over-calibrated.",
    copingStrategy:
      "Practice sitting with the discomfort for 30 seconds without performing any cleaning or checking rituals. The anxiety peaks and then naturally decreases — this is called habituation. Your character will get bored and wander off.",
    archetype: "contaminator",
  },
  imposter: {
    technique:
      "By turning your imposter feelings into a character, you can see them for what they are — a nervous little creature with no actual evidence, not a legitimate assessment of your abilities.",
    normalization:
      "Imposter syndrome affects an estimated 70% of people at some point. It is particularly common among high-achievers, which means having these thoughts may actually be a sign you're doing well.",
    copingStrategy:
      "When this character shows up, ask it: 'What specific evidence do you have?' You'll find it stutters and changes the subject. Keep a record of your actual accomplishments to counter its claims.",
    archetype: "imposter",
  },
  intrude: {
    technique:
      "The most important thing: having a disturbing thought does NOT mean you want it to happen. By giving this thought a bumbling, harmless character, you're breaking the false equivalence between thought and intention.",
    normalization:
      "Unwanted, disturbing intrusive thoughts are experienced by 90%+ of the population. They are the brain's random firing pattern, not your desires. Research consistently shows that the people MOST disturbed by violent or taboo thoughts are the LEAST likely to act on them.",
    copingStrategy:
      "Don't try to suppress the thought — suppression makes thoughts more frequent (the 'white bear effect'). Instead, label it: 'That's just my brain generating random noise.' Then redirect your attention gently, without urgency.",
    archetype: "intrude",
  },
  perfectionist: {
    technique:
      "Your perfectionist thought is now a tiny character obsessively rearranging things that don't need rearranging. This separation lets you see that 'it must be perfect' is a voice, not a truth.",
    normalization:
      "Perfectionist intrusive thoughts are your brain confusing 'good enough' with 'not enough.' This pattern is extremely common, especially in people who care deeply about quality — which is a strength.",
    copingStrategy:
      "Try the 'good enough' experiment: intentionally leave something at 80% completion and observe what happens. Spoiler: nothing catastrophic occurs. Your character will panic, but reality won't.",
    archetype: "perfectionist",
  },
  detacher: {
    technique:
      "Depersonalisation and derealisation thoughts are frightening, but by giving them a foggy, confused character, you can see them as temporary visitors rather than permanent states.",
    normalization:
      "Feeling disconnected from yourself or reality is a surprisingly common experience, especially during periods of stress or anxiety. It is a protective mechanism — your brain briefly 'turns down the volume' when overwhelmed.",
    copingStrategy:
      "Ground yourself using the 5-4-3-2-1 technique: name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste. This pulls you back to the present while your character continues to wander in its fog.",
    archetype: "detacher",
  },
  relationshipist: {
    technique:
      "Your relationship anxiety now has a name and a dramatic personality. It writes farewell letters to people who haven't gone anywhere. Seeing it as a character lets you distinguish between genuine relationship signals and anxious noise.",
    normalization:
      "Fear of abandonment and relationship anxiety are among the most universal human experiences. These thoughts don't mean your relationships are failing — they mean you care about them.",
    copingStrategy:
      "Before acting on the urge to seek reassurance, wait 20 minutes. Most relationship-anxiety spikes naturally decrease within this window. Your character will have moved on to its next dramatic farewell by then.",
    archetype: "relationshipist",
  },
  spiralist: {
    technique:
      "The spiral feels infinite, but your character reveals the truth: it's spinning on a flat surface, going nowhere. Doom spirals are loops, not descents. Naming the spiral breaks the loop.",
    normalization:
      "Generalised anxiety spirals are one of the most common intrusive thought patterns. The feeling that 'everything is connected and getting worse' is an anxiety illusion — a cognitive distortion called 'overgeneralisation.'",
    copingStrategy:
      "Interrupt the spiral with a concrete, time-limited action: set a 5-minute timer and do something with your hands (stretch, hold ice, organise one small thing). Spirals need abstract thinking to survive — concrete action starves them.",
    archetype: "spiralist",
  },
};

export function getPsychoeducation(
  archetype: ThoughtArchetype
): PsychoeducationContent {
  return TEMPLATES[archetype];
}
