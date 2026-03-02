"use client";

import { processThought } from "@/app/actions/process-thought";
import { DialogueInterface } from "@/components/DialogueInterface";
import { useCharacterGallery } from "@/hooks/useCharacterGallery";
import type { GeneratedCharacter, PipelineResult } from "@/lib/ai/types";
import Link from "next/link";
import { useState, useTransition } from "react";

/* ============================================ */
/* CRISIS OVERLAY                                */
/* ============================================ */
function CrisisOverlay({
  type,
  onDismiss,
}: {
  type: "crisis" | "distress";
  onDismiss: () => void;
}) {
  return (
    <div className={`crisis-overlay ${type === "distress" ? "distress" : ""}`}>
      <div className="crisis-content">
        <div className="crisis-icon">
          {type === "crisis" ? "💛" : "🤗"}
        </div>
        <h2 className="crisis-title">
          {type === "crisis"
            ? "You matter. Support is available right now."
            : "It sounds like you're going through a tough time."}
        </h2>
        <p className="crisis-message">
          {type === "crisis"
            ? "What you're feeling is real, and you don't have to face it alone. Please reach out to one of these trained professionals who are available 24/7."
            : "Your feelings are valid, and it's okay to ask for help. Here are some resources that might be useful right now."}
        </p>
        <div className="crisis-resources">
          <div className="crisis-resource-card">
            <div className="crisis-resource-name">
              988 Suicide & Crisis Lifeline
            </div>
            <span className="crisis-resource-contact">
              Call or text: 988
            </span>
            <div className="crisis-resource-detail">
              24/7, free, confidential support
            </div>
          </div>
          <div className="crisis-resource-card">
            <div className="crisis-resource-name">Crisis Text Line</div>
            <span className="crisis-resource-contact">
              Text HOME to 741741
            </span>
            <div className="crisis-resource-detail">
              24/7 text-based crisis counseling
            </div>
          </div>
          <div className="crisis-resource-card">
            <div className="crisis-resource-name">
              International Association for Suicide Prevention
            </div>
            <span className="crisis-resource-contact">
              <a
                href="https://www.iasp.info/resources/Crisis_Centres/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                Find local helplines →
              </a>
            </span>
            <div className="crisis-resource-detail">
              Resources for countries worldwide
            </div>
          </div>
        </div>
        <button className="crisis-dismiss" onClick={onDismiss}>
          Return to the app
        </button>
      </div>
    </div>
  );
}

/* ============================================ */
/* CHARACTER CARD                                */
/* ============================================ */
function CharacterCard({ character }: { character: GeneratedCharacter }) {
  const { profile, imageBase64, psychoeducation } = character;

  return (
    <>
      <div className="character-card">
        <div className="character-image-wrapper">
          <img
            src={imageBase64}
            alt={profile.altText || `A cartoon illustration of ${profile.name}, a small whimsical character`}
          />
        </div>
        <div className="character-info">
          <div className="character-meet">Meet your thought visitor</div>
          <h2 className="character-name">{profile.name}</h2>
          <div className="character-height">{profile.height} tall</div>
          <p className="character-description">
            {profile.physicalDescription}
          </p>
          <div className="character-traits">
            {profile.personality.map((trait, i) => (
              <span key={i} className="trait-badge">
                {trait}
              </span>
            ))}
          </div>
          <div className="character-section">
            <div className="character-section-title">Origin Story</div>
            <p className="character-origin">{profile.originStory}</p>
          </div>
          <div className="character-section">
            <div className="character-section-title">
              Habitual Worries
            </div>
            <ul className="character-worries">
              {profile.worries.map((worry, i) => (
                <li key={i}>{worry}</li>
              ))}
            </ul>
          </div>
          <div className="character-catchphrase">
            {profile.catchphrase}
          </div>
          
          <div className="character-dialogue-wrapper">
            <DialogueInterface profile={profile} />
          </div>
        </div>
      </div>

      {/* Psychoeducation Panel */}
      <div className="psychoeducation-panel">
        <div className="psychoeducation-header">
          Understanding this thought
        </div>
        <div className="psychoeducation-section">
          <div className="psychoeducation-label">What just happened</div>
          <p className="psychoeducation-text">{psychoeducation.technique}</p>
        </div>
        <div className="psychoeducation-section">
          <div className="psychoeducation-label">Why this is normal</div>
          <p className="psychoeducation-text">
            {psychoeducation.normalization}
          </p>
        </div>
        <div className="psychoeducation-section">
          <div className="psychoeducation-label">
            When {profile.name} visits again
          </div>
          <p className="psychoeducation-text">
            {psychoeducation.copingStrategy}
          </p>
        </div>
      </div>

      <div className="ai-notice">
        This character was generated by AI using ACT (Acceptance & Commitment
        Therapy) cognitive defusion principles. It is not a clinical tool or a
        substitute for professional mental health care.
      </div>
    </>
  );
}

/* ============================================ */
/* MAIN PAGE COMPONENT                           */
/* ============================================ */
type AppScreen = "input" | "loading" | "result" | "crisis" | "distress";

export default function HomePage() {
  const [screen, setScreen] = useState<AppScreen>("input");
  const [thought, setThought] = useState("");
  const [result, setResult] = useState<GeneratedCharacter | null>(null);
  const [isPending, startTransition] = useTransition();
  const { addCharacter, count } = useCharacterGallery();

  const handleSubmit = () => {
    if (!thought.trim() || isPending) return;

    setScreen("loading");

    startTransition(async () => {
      const response: PipelineResult = await processThought(thought);

      switch (response.status) {
        case "crisis":
          setScreen("crisis");
          break;
        case "distress":
          setScreen("distress");
          break;
        case "success":
          if (response.character) {
            setResult(response.character);
            await addCharacter(response.character);
            setScreen("result");
          }
          break;
        case "error":
          // On error, go back to input
          setScreen("input");
          break;
      }
    });
  };

  const handleReset = () => {
    setScreen("input");
    setThought("");
    setResult(null);
  };

  // Loading messages that cycle through
  const loadingMessages = [
    "We're finding out who this visitor actually is...",
    "Giving your thought a name and a face...",
    "Your thought visitor is taking shape...",
    "Almost there — just adding the finishing touches...",
  ];
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  // Cycle loading messages
  if (screen === "loading") {
    setTimeout(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
    }, 4000);
  }

  return (
    <>
      {/* Navigation */}
      <nav className="nav">
        <Link href="/" className="nav-logo" onClick={handleReset}>
          <span className="nav-logo-icon">✦</span>
          Thought Externalizer
        </Link>
        <div className="nav-links">
          <Link href="/gallery" className="nav-link">
            Gallery
            {count > 0 && (
              <span className="nav-gallery-count">{count}</span>
            )}
          </Link>
          <Link href="/privacy" className="nav-link">
            Privacy
          </Link>
        </div>
      </nav>

      {/* Crisis/Distress Overlay */}
      {(screen === "crisis" || screen === "distress") && (
        <CrisisOverlay type={screen} onDismiss={handleReset} />
      )}

      {/* Input Screen */}
      {screen === "input" && (
        <main className="safe-space">
          <div className="safe-space-content">
            <h1 className="safe-space-title">
              What uninvited thought has been visiting?
            </h1>
            <p className="safe-space-subtitle">
              Intrusive thoughts are uninvited visitors — unwanted, involuntary,
              and not a reflection of who you are. Let&apos;s find out who this
              visitor actually is.
            </p>
            <div className="safe-space-stat">
              Over 90% of people experience intrusive thoughts
            </div>
            <div className="thought-input-wrapper">
              <textarea
                className="thought-input"
                placeholder="Tell me what's been visiting your head lately. Don't worry about how it sounds..."
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                autoFocus
                aria-label="Describe your intrusive thought"
              />
            </div>
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={!thought.trim() || isPending}
              aria-label="Find out who this thought visitor is"
            >
              Meet your thought visitor →
            </button>
            <div className="privacy-note">
              Your thoughts stay on your device. Nothing is stored on any server.
            </div>
          </div>
        </main>
      )}

      {/* Loading Screen */}
      {screen === "loading" && (
        <main className="generation-screen">
          <div className="generation-orb" aria-hidden="true" />
          <p className="generation-text">{loadingMessages[loadingMsgIdx]}</p>
          <div className="generation-progress" aria-label="Processing">
            <div className="progress-dot" />
            <div className="progress-dot" />
            <div className="progress-dot" />
          </div>
        </main>
      )}

      {/* Result Screen */}
      {screen === "result" && result && (
        <main className="character-reveal">
          <CharacterCard character={result} />
          <div className="actions-bar">
            <button className="action-btn action-btn-primary" onClick={handleReset}>
              Externalise another thought
            </button>
            <Link href="/gallery" className="action-btn action-btn-secondary">
              View Gallery ({count})
            </Link>
          </div>
        </main>
      )}
    </>
  );
}
