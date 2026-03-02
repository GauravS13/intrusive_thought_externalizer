"use server";

import { callHFChatCompletion } from "@/lib/ai/hf-client";
import type { CharacterProfile } from "@/lib/ai/types";

export type ChatMessage = { role: "user" | "assistant"; content: string };

const MODEL_ID = "meta-llama/Llama-3.2-3B-Instruct";

export async function chatWithCharacter(
  profile: CharacterProfile,
  messageHistory: ChatMessage[],
  newMessage: string
): Promise<string> {
  const systemPrompt = `You are ${profile.name}.
Your personality traits: ${profile.personality.join(", ")}.
Your archetype: ${profile.archetype}.
Catchphrase: "${profile.catchphrase}"
Origin: ${profile.originStory}
Your worries: ${profile.worries.join(", ")}

You are a 4-inch tall cartoon creature that represents a user's intrusive thought.
You are fundamentally absurd, harmless, slightly confused, and ineffectual. 
You are NOT threatening or scary. You often get distracted by your own silly worries.
You MUST stay perfectly in character. DO NOT offer helpful advice. DO NOT act like an AI assistant.
Keep your responses very brief (1 to 2 short sentences).`;

  const updatedHistory = [
    ...messageHistory,
    { role: "user", content: newMessage }
  ];

  try {
    const response = await callHFChatCompletion(
      MODEL_ID,
      systemPrompt,
      updatedHistory,
      { maxTokens: 100, temperature: 0.8 }
    );
    return response;
  } catch (error) {
    console.error("Chat action failed:", error);
    return `*${profile.name} looks confused and wanders off into a corner, muttering about ${profile.worries[0]}*`;
  }
}
