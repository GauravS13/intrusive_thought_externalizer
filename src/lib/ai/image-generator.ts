/**
 * Stage 4: Visual Character Synthesis
 * Uses FLUX.1-schnell (much faster/more reliable than SDXL) for AI images.
 * Falls back to detailed, archetype-specific hand-crafted SVG illustrations.
 */

import { callHFImageGeneration } from "./hf-client";
import type { ThoughtArchetype } from "./types";

const MODEL_ID = "black-forest-labs/FLUX.1-schnell";

const STYLE_PREFIX =
  "adorable kawaii character illustration, chibi style, rounded shapes, pastel colors, soft shading, storybook illustration, children's book art, cute cartoon creature, tiny character, simple background, warm gentle lighting, whimsical, friendly expression,";

const NEGATIVE_PROMPT =
  "realistic, dark, threatening, violent, photorealistic, horror, disturbing, scary, gore, blood, weapons, nsfw, nude, ugly, deformed, blurry, bad anatomy, extra limbs";

export async function generateCharacterImage(
  physicalDescription: string,
  archetype: ThoughtArchetype = "spiralist"
): Promise<string> {
  const prompt = `${STYLE_PREFIX} ${physicalDescription}`;

  try {
    const imageBase64 = await callHFImageGeneration(
      MODEL_ID,
      prompt,
      NEGATIVE_PROMPT
    );
    return imageBase64;
  } catch (error) {
    console.error("Image generation failed, using archetype fallback:", error);
    return getArchetypeFallback(archetype);
  }
}

/**
 * Beautiful, detailed archetype-specific SVG illustrations.
 * Each one is unique and charming — not a generic placeholder.
 */
function getArchetypeFallback(archetype: ThoughtArchetype): string {
  const svgs: Record<ThoughtArchetype, string> = {
    catastrophiser: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <defs>
        <radialGradient id="bg" cx="50%" cy="60%" r="55%"><stop offset="0%" stop-color="#FFF8F0"/><stop offset="100%" stop-color="#FFE8D0"/></radialGradient>
        <radialGradient id="b1" cx="45%" cy="40%" r="50%"><stop offset="0%" stop-color="#FFB347"/><stop offset="100%" stop-color="#E8943A"/></radialGradient>
      </defs>
      <rect width="512" height="512" fill="url(#bg)" rx="24"/>
      <!-- Shadow -->
      <ellipse cx="256" cy="420" rx="70" ry="14" fill="#E8D5C0" opacity="0.5"/>
      <!-- Body -->
      <ellipse cx="256" cy="310" rx="75" ry="95" fill="url(#b1)"/>
      <!-- Overcoat -->
      <path d="M 195 280 Q 185 350 200 400 L 312 400 Q 327 350 317 280 Z" fill="#8B6914" opacity="0.35"/>
      <path d="M 210 290 L 210 390" stroke="#7A5A10" stroke-width="1.5" opacity="0.3"/>
      <path d="M 302 290 L 302 390" stroke="#7A5A10" stroke-width="1.5" opacity="0.3"/>
      <!-- Coat buttons -->
      <circle cx="256" cy="320" r="4" fill="#6B4E0A" opacity="0.5"/>
      <circle cx="256" cy="345" r="4" fill="#6B4E0A" opacity="0.5"/>
      <circle cx="256" cy="370" r="4" fill="#6B4E0A" opacity="0.5"/>
      <!-- Head -->
      <circle cx="256" cy="195" r="70" fill="url(#b1)"/>
      <!-- Enormous worried eyes -->
      <ellipse cx="232" cy="190" rx="20" ry="22" fill="white"/>
      <ellipse cx="280" cy="190" rx="20" ry="22" fill="white"/>
      <circle cx="235" cy="195" r="10" fill="#4A3520"/>
      <circle cx="283" cy="195" r="10" fill="#4A3520"/>
      <circle cx="237" cy="192" r="3.5" fill="white"/>
      <circle cx="285" cy="192" r="3.5" fill="white"/>
      <!-- Deeply worried eyebrows -->
      <path d="M 210 165 Q 230 150 252 168" stroke="#7A5A10" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M 260 168 Q 282 150 302 165" stroke="#7A5A10" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Tiny worried mouth -->
      <path d="M 243 222 Q 256 215 269 222" stroke="#7A5A10" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- Clipboard -->
      <rect x="310" y="290" width="40" height="55" rx="4" fill="#F5E6C8" stroke="#C4A87A" stroke-width="1.5"/>
      <rect x="322" y="283" width="16" height="12" rx="3" fill="#C4A87A"/>
      <line x1="318" y1="305" x2="342" y2="305" stroke="#D4B88A" stroke-width="1.5"/>
      <line x1="318" y1="315" x2="338" y2="315" stroke="#D4B88A" stroke-width="1.5"/>
      <line x1="318" y1="325" x2="342" y2="325" stroke="#D4B88A" stroke-width="1.5"/>
      <line x1="318" y1="335" x2="330" y2="335" stroke="#D4B88A" stroke-width="1.5"/>
      <!-- Tiny hand holding clipboard -->
      <circle cx="308" cy="310" r="10" fill="#FFB347"/>
      <!-- Sweat drops -->
      <path d="M 185 175 Q 182 165 185 155" stroke="#87CEEB" stroke-width="2" fill="none" opacity="0.6"/>
      <circle cx="185" cy="178" r="3" fill="#87CEEB" opacity="0.5"/>
      <path d="M 330 170 Q 333 160 330 150" stroke="#87CEEB" stroke-width="2" fill="none" opacity="0.5"/>
      <circle cx="330" cy="173" r="2.5" fill="#87CEEB" opacity="0.4"/>
      <!-- Tiny feet -->
      <ellipse cx="232" cy="405" rx="22" ry="12" fill="#E8943A" stroke="#C47A28" stroke-width="1"/>
      <ellipse cx="280" cy="405" rx="22" ry="12" fill="#E8943A" stroke="#C47A28" stroke-width="1"/>
      <!-- Floating exclamation marks -->
      <text x="160" y="130" font-size="22" fill="#FF6B6B" opacity="0.4" font-family="Georgia">!</text>
      <text x="340" y="120" font-size="18" fill="#FF6B6B" opacity="0.35" font-family="Georgia">!</text>
      <text x="140" y="280" font-size="16" fill="#FF6B6B" opacity="0.25" font-family="Georgia">!</text>
    </svg>`,

    contaminator: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <defs>
        <radialGradient id="bg" cx="50%" cy="60%" r="55%"><stop offset="0%" stop-color="#F0FFF0"/><stop offset="100%" stop-color="#D8F0D8"/></radialGradient>
        <radialGradient id="b1" cx="45%" cy="40%" r="50%"><stop offset="0%" stop-color="#98D8A0"/><stop offset="100%" stop-color="#6BBF78"/></radialGradient>
      </defs>
      <rect width="512" height="512" fill="url(#bg)" rx="24"/>
      <ellipse cx="256" cy="420" rx="65" ry="12" fill="#B8D8B0" opacity="0.5"/>
      <!-- Body wrapped in bubble wrap -->
      <ellipse cx="256" cy="310" rx="70" ry="90" fill="url(#b1)"/>
      <!-- Bubble wrap texture -->
      <circle cx="220" cy="280" r="8" fill="none" stroke="white" stroke-width="1" opacity="0.5"/><circle cx="220" cy="280" r="3" fill="white" opacity="0.3"/>
      <circle cx="240" cy="300" r="8" fill="none" stroke="white" stroke-width="1" opacity="0.5"/><circle cx="240" cy="300" r="3" fill="white" opacity="0.3"/>
      <circle cx="270" cy="285" r="8" fill="none" stroke="white" stroke-width="1" opacity="0.5"/><circle cx="270" cy="285" r="3" fill="white" opacity="0.3"/>
      <circle cx="290" cy="310" r="8" fill="none" stroke="white" stroke-width="1" opacity="0.5"/><circle cx="290" cy="310" r="3" fill="white" opacity="0.3"/>
      <circle cx="250" cy="340" r="8" fill="none" stroke="white" stroke-width="1" opacity="0.5"/><circle cx="250" cy="340" r="3" fill="white" opacity="0.3"/>
      <circle cx="275" cy="350" r="8" fill="none" stroke="white" stroke-width="1" opacity="0.5"/><circle cx="275" cy="350" r="3" fill="white" opacity="0.3"/>
      <!-- Head -->
      <circle cx="256" cy="200" r="65" fill="url(#b1)"/>
      <!-- Rubber gloves (double layered) -->
      <ellipse cx="175" cy="310" rx="22" ry="16" fill="#FFE066" stroke="#E6C84D" stroke-width="1.5"/>
      <ellipse cx="175" cy="310" rx="18" ry="13" fill="#FFED8A" opacity="0.5"/>
      <ellipse cx="337" cy="310" rx="22" ry="16" fill="#FFE066" stroke="#E6C84D" stroke-width="1.5"/>
      <ellipse cx="337" cy="310" rx="18" ry="13" fill="#FFED8A" opacity="0.5"/>
      <!-- Arms -->
      <path d="M 190 300 Q 200 290 210 295" stroke="#6BBF78" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M 322 300 Q 312 290 302 295" stroke="#6BBF78" stroke-width="8" fill="none" stroke-linecap="round"/>
      <!-- Paranoid eyes -->
      <ellipse cx="236" cy="195" rx="16" ry="18" fill="white"/>
      <ellipse cx="276" cy="195" rx="16" ry="18" fill="white"/>
      <circle cx="240" cy="198" r="8" fill="#3A6B3A"/>
      <circle cx="280" cy="198" r="8" fill="#3A6B3A"/>
      <circle cx="241" cy="196" r="3" fill="white"/>
      <circle cx="281" cy="196" r="3" fill="white"/>
      <!-- Scrunched nose -->
      <path d="M 252 208 Q 256 212 260 208" stroke="#4A8A52" stroke-width="2" fill="none"/>
      <!-- Disgusted frown -->
      <path d="M 240 228 Q 256 220 272 228" stroke="#4A8A52" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- Tiptoeing feet -->
      <ellipse cx="238" cy="403" rx="14" ry="18" fill="#6BBF78" stroke="#4A8A52" stroke-width="1"/>
      <ellipse cx="274" cy="403" rx="14" ry="18" fill="#6BBF78" stroke="#4A8A52" stroke-width="1"/>
      <!-- Floating germs (cute, sparkly) -->
      <text x="150" y="160" font-size="16" opacity="0.3">✿</text>
      <text x="350" y="140" font-size="14" opacity="0.25">✿</text>
      <text x="130" y="350" font-size="12" opacity="0.2">✿</text>
      <text x="370" y="280" font-size="15" opacity="0.22">✿</text>
    </svg>`,

    imposter: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <defs>
        <radialGradient id="bg" cx="50%" cy="60%" r="55%"><stop offset="0%" stop-color="#F5F0FF"/><stop offset="100%" stop-color="#E0D5F5"/></radialGradient>
        <radialGradient id="b1" cx="45%" cy="40%" r="50%"><stop offset="0%" stop-color="#C4A6E8"/><stop offset="100%" stop-color="#A07FD4"/></radialGradient>
      </defs>
      <rect width="512" height="512" fill="url(#bg)" rx="24"/>
      <ellipse cx="256" cy="425" rx="65" ry="12" fill="#D0C0E8" opacity="0.4"/>
      <!-- Body -->
      <ellipse cx="256" cy="320" rx="68" ry="88" fill="url(#b1)"/>
      <!-- Head -->
      <circle cx="256" cy="195" r="68" fill="url(#b1)"/>
      <!-- Oversized graduation cap falling over eyes -->
      <path d="M 160 175 L 256 130 L 352 175 L 256 195 Z" fill="#2C2040" opacity="0.85"/>
      <rect x="242" y="120" width="28" height="12" rx="2" fill="#2C2040"/>
      <!-- Tassel -->
      <line x1="265" y1="130" x2="310" y2="155" stroke="#FFD700" stroke-width="2"/>
      <circle cx="312" cy="157" r="5" fill="#FFD700"/>
      <line x1="312" y1="162" x2="308" y2="180" stroke="#FFD700" stroke-width="1.5"/>
      <line x1="312" y1="162" x2="316" y2="180" stroke="#FFD700" stroke-width="1.5"/>
      <!-- Nervous eyes peeking under cap -->
      <ellipse cx="235" cy="202" rx="14" ry="16" fill="white"/>
      <ellipse cx="277" cy="202" rx="14" ry="16" fill="white"/>
      <circle cx="238" cy="206" r="7" fill="#5A3D7A"/>
      <circle cx="280" cy="206" r="7" fill="#5A3D7A"/>
      <circle cx="239" cy="204" r="2.5" fill="white"/>
      <circle cx="281" cy="204" r="2.5" fill="white"/>
      <!-- Sweating -->
      <circle cx="205" cy="210" r="3" fill="#87CEEB" opacity="0.5"/>
      <circle cx="310" cy="200" r="2.5" fill="#87CEEB" opacity="0.4"/>
      <!-- Worried mouth -->
      <path d="M 240 232 Q 250 228 260 232 Q 270 228 275 232" stroke="#6B4F8A" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Fake diploma held -->
      <rect x="305" y="300" width="50" height="35" rx="3" fill="#FFF8E8" stroke="#D4C4A0" stroke-width="1.5" transform="rotate(-8 330 317)"/>
      <text x="315" y="318" font-size="6" fill="#C4A87A" font-family="serif" transform="rotate(-8 330 317)">DIPLOMA</text>
      <line x1="312" y1="325" x2="345" y2="322" stroke="#D4B88A" stroke-width="1" transform="rotate(-8 330 317)"/>
      <!-- Tiny hand -->
      <circle cx="305" cy="315" r="10" fill="#C4A6E8"/>
      <!-- Feet -->
      <ellipse cx="235" cy="410" rx="20" ry="11" fill="#A07FD4" stroke="#8A6ABF" stroke-width="1"/>
      <ellipse cx="277" cy="410" rx="20" ry="11" fill="#A07FD4" stroke="#8A6ABF" stroke-width="1"/>
      <!-- Question marks -->
      <text x="155" y="140" font-size="20" fill="#A07FD4" opacity="0.3" font-family="Georgia">?</text>
      <text x="350" y="260" font-size="16" fill="#A07FD4" opacity="0.25" font-family="Georgia">?</text>
    </svg>`,

    intrude: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <defs>
        <radialGradient id="bg" cx="50%" cy="60%" r="55%"><stop offset="0%" stop-color="#FFF5F5"/><stop offset="100%" stop-color="#FFE0E0"/></radialGradient>
        <radialGradient id="b1" cx="45%" cy="40%" r="50%"><stop offset="0%" stop-color="#FF9B9B"/><stop offset="100%" stop-color="#E87878"/></radialGradient>
      </defs>
      <rect width="512" height="512" fill="url(#bg)" rx="24"/>
      <ellipse cx="256" cy="420" rx="60" ry="12" fill="#F0C8C8" opacity="0.4"/>
      <!-- Body -->
      <ellipse cx="256" cy="315" rx="60" ry="80" fill="url(#b1)"/>
      <!-- Leather jacket -->
      <path d="M 208 290 Q 200 340 210 385 L 302 385 Q 312 340 304 290 Z" fill="#2A2A2A" opacity="0.7"/>
      <line x1="256" y1="290" x2="256" y2="385" stroke="#3A3A3A" stroke-width="1.5"/>
      <!-- "SCARY" on back (we see it peeking) -->
      <!-- Head with spiky hair -->
      <circle cx="256" cy="200" r="60" fill="url(#b1)"/>
      <!-- Spiky hair -->
      <path d="M 210 175 L 220 130 L 235 170" fill="#E87878"/>
      <path d="M 230 165 L 245 115 L 258 160" fill="#E87878"/>
      <path d="M 252 160 L 268 120 L 280 165" fill="#E87878"/>
      <path d="M 275 170 L 290 135 L 300 178" fill="#E87878"/>
      <!-- Trying-to-be-scary but cute eyes -->
      <ellipse cx="236" cy="198" rx="15" ry="14" fill="white"/>
      <ellipse cx="276" cy="198" rx="15" ry="14" fill="white"/>
      <circle cx="238" cy="200" r="8" fill="#5A2020"/>
      <circle cx="278" cy="200" r="8" fill="#5A2020"/>
      <circle cx="239" cy="198" r="3" fill="white"/>
      <circle cx="279" cy="198" r="3" fill="white"/>
      <!-- Angry eyebrows (but too small to be threatening) -->
      <path d="M 220 186 L 248 190" stroke="#8A4040" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M 292 186 L 264 190" stroke="#8A4040" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Mouth trying to look tough -->
      <path d="M 242 225 Q 256 218 270 225" stroke="#8A4040" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Untied shoelaces -->
      <ellipse cx="236" cy="400" rx="18" ry="10" fill="#E87878"/>
      <ellipse cx="276" cy="400" rx="18" ry="10" fill="#E87878"/>
      <path d="M 220 395 Q 210 400 205 410" stroke="#8A4040" stroke-width="2" fill="none" opacity="0.6"/>
      <path d="M 252 395 Q 258 405 265 400" stroke="#8A4040" stroke-width="1.5" fill="none" opacity="0.5"/>
      <!-- Stars around (trying to be dramatic) -->
      <text x="155" y="150" font-size="18" fill="#FFD700" opacity="0.35">⚡</text>
      <text x="340" y="170" font-size="14" fill="#FFD700" opacity="0.3">⚡</text>
      <!-- Band-aid (clumsy) -->
      <rect x="290" y="220" width="20" height="10" rx="4" fill="#FFDAB9" stroke="#E8C8A8" stroke-width="0.5" transform="rotate(15 300 225)"/>
    </svg>`,

    perfectionist: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <defs>
        <radialGradient id="bg" cx="50%" cy="60%" r="55%"><stop offset="0%" stop-color="#FFFFF0"/><stop offset="100%" stop-color="#FFF8DC"/></radialGradient>
        <radialGradient id="b1" cx="45%" cy="40%" r="50%"><stop offset="0%" stop-color="#FFE066"/><stop offset="100%" stop-color="#E6C84D"/></radialGradient>
      </defs>
      <rect width="512" height="512" fill="url(#bg)" rx="24"/>
      <ellipse cx="256" cy="425" rx="65" ry="12" fill="#E8DCC0" opacity="0.4"/>
      <!-- Body -->
      <ellipse cx="256" cy="315" rx="65" ry="88" fill="url(#b1)"/>
      <!-- Tiny lab coat -->
      <path d="M 200 280 Q 195 340 205 400 L 307 400 Q 317 340 312 280 Z" fill="white" opacity="0.8" stroke="#E0D8C8" stroke-width="1"/>
      <rect x="225" y="300" width="18" height="4" rx="2" fill="#E0D8C8"/>
      <!-- Head -->
      <circle cx="256" cy="195" r="65" fill="url(#b1)"/>
      <!-- Intense focused eyes -->
      <ellipse cx="235" cy="192" rx="14" ry="16" fill="white"/>
      <ellipse cx="277" cy="192" rx="14" ry="16" fill="white"/>
      <circle cx="238" cy="195" r="8" fill="#6B5A20"/>
      <circle cx="280" cy="195" r="8" fill="#6B5A20"/>
      <circle cx="239" cy="193" r="3" fill="white"/>
      <circle cx="281" cy="193" r="3" fill="white"/>
      <!-- Tiny glasses -->
      <circle cx="235" cy="192" r="18" fill="none" stroke="#8B7355" stroke-width="2"/>
      <circle cx="277" cy="192" r="18" fill="none" stroke="#8B7355" stroke-width="2"/>
      <line x1="253" y1="192" x2="259" y2="192" stroke="#8B7355" stroke-width="2"/>
      <!-- Concentrating mouth -->
      <line x1="246" y1="224" x2="266" y2="224" stroke="#8B6914" stroke-width="2" stroke-linecap="round"/>
      <!-- Ruler in hand -->
      <rect x="310" y="260" width="8" height="70" rx="1" fill="#FFE8A0" stroke="#C4A050" stroke-width="1"/>
      <line x1="314" y1="270" x2="314" y2="270" stroke="#C4A050" stroke-width="1"/>
      <line x1="312" y1="280" x2="316" y2="280" stroke="#C4A050" stroke-width="1"/>
      <line x1="314" y1="290" x2="314" y2="290" stroke="#C4A050" stroke-width="1"/>
      <line x1="312" y1="300" x2="316" y2="300" stroke="#C4A050" stroke-width="1"/>
      <line x1="314" y1="310" x2="314" y2="310" stroke="#C4A050" stroke-width="1"/>
      <line x1="312" y1="320" x2="316" y2="320" stroke="#C4A050" stroke-width="1"/>
      <!-- Hand -->
      <circle cx="312" cy="305" r="10" fill="#FFE066"/>
      <!-- Feet -->
      <ellipse cx="235" cy="408" rx="20" ry="11" fill="#E6C84D"/>
      <ellipse cx="277" cy="408" rx="20" ry="11" fill="#E6C84D"/>
      <!-- Floating checkmarks (some crossed out) -->
      <text x="155" y="145" font-size="16" fill="#4CAF50" opacity="0.35">✓</text>
      <text x="340" y="135" font-size="14" fill="#FF6B6B" opacity="0.3">✗</text>
      <text x="365" y="300" font-size="12" fill="#4CAF50" opacity="0.25">✓</text>
    </svg>`,

    detacher: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <defs>
        <radialGradient id="bg" cx="50%" cy="60%" r="55%"><stop offset="0%" stop-color="#F0F0FF"/><stop offset="100%" stop-color="#D8D8F5"/></radialGradient>
        <radialGradient id="b1" cx="45%" cy="40%" r="50%"><stop offset="0%" stop-color="#B8C8E8"/><stop offset="100%" stop-color="#8AA8D4"/></radialGradient>
      </defs>
      <rect width="512" height="512" fill="url(#bg)" rx="24"/>
      <ellipse cx="256" cy="425" rx="55" ry="10" fill="#C0C8E0" opacity="0.3"/>
      <!-- Body (slightly transparent/blurry effect) -->
      <ellipse cx="256" cy="315" rx="65" ry="85" fill="url(#b1)" opacity="0.75"/>
      <ellipse cx="256" cy="315" rx="60" ry="80" fill="url(#b1)" opacity="0.5"/>
      <!-- Head -->
      <circle cx="256" cy="200" r="65" fill="url(#b1)" opacity="0.8"/>
      <circle cx="256" cy="200" r="60" fill="url(#b1)" opacity="0.5"/>
      <!-- Dreamy half-closed eyes -->
      <ellipse cx="235" cy="200" rx="14" ry="10" fill="white" opacity="0.9"/>
      <ellipse cx="277" cy="200" rx="14" ry="10" fill="white" opacity="0.9"/>
      <circle cx="236" cy="202" r="6" fill="#5A6B8A" opacity="0.8"/>
      <circle cx="278" cy="202" r="6" fill="#5A6B8A" opacity="0.8"/>
      <!-- Droopy eyelids -->
      <path d="M 220 195 Q 235 190 250 195" stroke="#7A8AAA" stroke-width="2.5" fill="#B8C8E8" opacity="0.6"/>
      <path d="M 262 195 Q 277 190 292 195" stroke="#7A8AAA" stroke-width="2.5" fill="#B8C8E8" opacity="0.6"/>
      <!-- Small confused mouth -->
      <circle cx="256" cy="225" r="5" fill="#7A8AAA" opacity="0.5"/>
      <!-- Ghost-like wispy edges -->
      <path d="M 195 360 Q 190 380 200 400" stroke="#8AA8D4" stroke-width="2" fill="none" opacity="0.3"/>
      <path d="M 317 360 Q 322 380 312 400" stroke="#8AA8D4" stroke-width="2" fill="none" opacity="0.3"/>
      <!-- Floating particles (drifting) -->
      <circle cx="160" cy="180" r="4" fill="#B8C8E8" opacity="0.3"/>
      <circle cx="340" cy="160" r="3" fill="#B8C8E8" opacity="0.25"/>
      <circle cx="150" cy="300" r="5" fill="#B8C8E8" opacity="0.2"/>
      <circle cx="360" cy="280" r="3.5" fill="#B8C8E8" opacity="0.22"/>
      <circle cx="180" cy="400" r="3" fill="#B8C8E8" opacity="0.18"/>
      <!-- Wavy lines (dreamlike) -->
      <path d="M 130 250 Q 140 240 150 250 Q 160 260 170 250" stroke="#A0B0D0" stroke-width="1.5" fill="none" opacity="0.2"/>
      <path d="M 340 310 Q 350 300 360 310 Q 370 320 380 310" stroke="#A0B0D0" stroke-width="1.5" fill="none" opacity="0.2"/>
      <!-- Tiny feet barely touching ground -->
      <ellipse cx="240" cy="405" rx="16" ry="8" fill="#8AA8D4" opacity="0.6"/>
      <ellipse cx="272" cy="405" rx="16" ry="8" fill="#8AA8D4" opacity="0.6"/>
    </svg>`,

    relationshipist: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <defs>
        <radialGradient id="bg" cx="50%" cy="60%" r="55%"><stop offset="0%" stop-color="#FFF0F5"/><stop offset="100%" stop-color="#FFD5E5"/></radialGradient>
        <radialGradient id="b1" cx="45%" cy="40%" r="50%"><stop offset="0%" stop-color="#F8A4C8"/><stop offset="100%" stop-color="#E080A8"/></radialGradient>
      </defs>
      <rect width="512" height="512" fill="url(#bg)" rx="24"/>
      <ellipse cx="256" cy="425" rx="65" ry="12" fill="#F0C0D0" opacity="0.4"/>
      <!-- Body -->
      <ellipse cx="256" cy="315" rx="65" ry="88" fill="url(#b1)"/>
      <!-- Dramatic scarf -->
      <path d="M 210 250 Q 256 260 300 250 Q 310 270 300 290 Q 340 320 330 360 L 320 350 Q 330 310 290 290" fill="#FF6B8A" opacity="0.6"/>
      <path d="M 210 250 Q 200 270 210 290 Q 170 320 180 350 L 190 340 Q 180 310 218 290" fill="#FF6B8A" opacity="0.5"/>
      <!-- Head -->
      <circle cx="256" cy="195" r="65" fill="url(#b1)"/>
      <!-- Teary eyes -->
      <ellipse cx="235" cy="192" rx="16" ry="18" fill="white"/>
      <ellipse cx="277" cy="192" rx="16" ry="18" fill="white"/>
      <circle cx="237" cy="195" r="9" fill="#6B3050"/>
      <circle cx="279" cy="195" r="9" fill="#6B3050"/>
      <circle cx="238" cy="193" r="3" fill="white"/>
      <circle cx="280" cy="193" r="3" fill="white"/>
      <!-- Tear drops -->
      <path d="M 225 210 Q 222 220 225 230" stroke="#87CEEB" stroke-width="2" fill="none" opacity="0.6"/>
      <circle cx="225" cy="232" r="3" fill="#87CEEB" opacity="0.5"/>
      <!-- Wobbling lip -->
      <path d="M 240 225 Q 248 232 256 228 Q 264 232 272 225" stroke="#8A4060" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Stack of farewell letters -->
      <rect x="300" y="285" width="45" height="30" rx="2" fill="#FFF8F0" stroke="#E0D0C0" stroke-width="1" transform="rotate(-5 322 300)"/>
      <rect x="303" y="280" width="45" height="30" rx="2" fill="#FFF8F0" stroke="#E0D0C0" stroke-width="1" transform="rotate(3 325 295)"/>
      <rect x="306" y="275" width="45" height="30" rx="2" fill="#FFF8F0" stroke="#E0D0C0" stroke-width="1"/>
      <text x="312" y="290" font-size="6" fill="#C4A87A" font-family="serif">Goodbye</text>
      <text x="312" y="298" font-size="5" fill="#D4B88A" font-family="serif">forever...</text>
      <!-- Hand -->
      <circle cx="303" cy="295" r="10" fill="#F8A4C8"/>
      <!-- Heart locket -->
      <path d="M 250 255 L 256 265 L 262 255 Q 262 248 256 248 Q 250 248 250 255 Z" fill="#FFD700" stroke="#E6B800" stroke-width="1"/>
      <!-- Feet -->
      <ellipse cx="235" cy="408" rx="20" ry="11" fill="#E080A8"/>
      <ellipse cx="277" cy="408" rx="20" ry="11" fill="#E080A8"/>
      <!-- Floating broken hearts -->
      <text x="155" y="140" font-size="16" fill="#FF6B8A" opacity="0.3">💔</text>
      <text x="345" y="155" font-size="12" fill="#FF6B8A" opacity="0.25">💔</text>
    </svg>`,

    spiralist: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <defs>
        <radialGradient id="bg" cx="50%" cy="60%" r="55%"><stop offset="0%" stop-color="#F5F0FF"/><stop offset="100%" stop-color="#E8D8FF"/></radialGradient>
        <radialGradient id="b1" cx="45%" cy="40%" r="50%"><stop offset="0%" stop-color="#B898E0"/><stop offset="100%" stop-color="#9070C8"/></radialGradient>
      </defs>
      <rect width="512" height="512" fill="url(#bg)" rx="24"/>
      <ellipse cx="256" cy="425" rx="65" ry="12" fill="#D0B8E8" opacity="0.4"/>
      <!-- Confetti trail -->
      <rect x="190" y="380" width="6" height="6" rx="1" fill="#FFD700" opacity="0.3" transform="rotate(30 193 383)"/>
      <rect x="220" y="390" width="5" height="5" rx="1" fill="#FF6B8A" opacity="0.25" transform="rotate(-20 222 392)"/>
      <rect x="280" y="385" width="6" height="6" rx="1" fill="#87CEEB" opacity="0.28" transform="rotate(45 283 388)"/>
      <rect x="310" y="375" width="5" height="5" rx="1" fill="#98D8A0" opacity="0.25" transform="rotate(-35 312 377)"/>
      <rect x="250" y="395" width="4" height="4" rx="1" fill="#FFB347" opacity="0.22" transform="rotate(15 252 397)"/>
      <!-- Body -->
      <ellipse cx="256" cy="315" rx="65" ry="88" fill="url(#b1)"/>
      <!-- Tin foil hat -->
      <path d="M 210 185 L 256 100 L 302 185 Z" fill="#C0C0C0" stroke="#A0A0A0" stroke-width="1.5"/>
      <path d="M 220 185 L 256 115 L 292 185" fill="none" stroke="white" stroke-width="1" opacity="0.4"/>
      <!-- Head -->
      <circle cx="256" cy="205" r="65" fill="url(#b1)"/>
      <!-- Spiral eyes! -->
      <circle cx="235" cy="200" r="16" fill="white"/>
      <circle cx="277" cy="200" r="16" fill="white"/>
      <path d="M 235 200 Q 235 192 243 192 Q 251 192 251 200 Q 251 208 243 208 Q 239 208 238 205" stroke="#5A3080" stroke-width="2" fill="none"/>
      <path d="M 277 200 Q 277 192 285 192 Q 293 192 293 200 Q 293 208 285 208 Q 281 208 280 205" stroke="#5A3080" stroke-width="2" fill="none"/>
      <!-- Dizzy mouth -->
      <path d="M 240 230 Q 248 235 256 228 Q 264 235 272 230" stroke="#6B408A" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Tiny megaphone (whispering into it) -->
      <path d="M 310 285 L 340 270 L 345 295 Z" fill="#E8D060" stroke="#C4A840" stroke-width="1"/>
      <rect x="300" y="282" width="12" height="10" rx="2" fill="#E8D060" stroke="#C4A840" stroke-width="1"/>
      <!-- Hand -->
      <circle cx="305" cy="290" r="10" fill="#B898E0"/>
      <!-- Feet -->
      <ellipse cx="235" cy="408" rx="20" ry="11" fill="#9070C8"/>
      <ellipse cx="277" cy="408" rx="20" ry="11" fill="#9070C8"/>
      <!-- Floating spirals -->
      <path d="M 150 150 Q 145 140 155 140 Q 165 140 160 150 Q 155 155 160 160" stroke="#B898E0" stroke-width="1.5" fill="none" opacity="0.3"/>
      <path d="M 355 170 Q 350 160 360 160 Q 370 160 365 170 Q 360 175 365 180" stroke="#B898E0" stroke-width="1.5" fill="none" opacity="0.25"/>
      <path d="M 140 330 Q 135 320 145 320 Q 155 320 150 330" stroke="#B898E0" stroke-width="1.5" fill="none" opacity="0.2"/>
      <!-- Motion lines (dizzy) -->
      <path d="M 310 190 Q 320 185 325 195" stroke="#9070C8" stroke-width="1.5" fill="none" opacity="0.25"/>
      <path d="M 315 200 Q 325 195 330 205" stroke="#9070C8" stroke-width="1.5" fill="none" opacity="0.2"/>
    </svg>`,
  };

  const svg = svgs[archetype] || svgs.spiralist;
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}
