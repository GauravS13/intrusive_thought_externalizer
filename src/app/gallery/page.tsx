"use client";

import { DialogueInterface } from "@/components/DialogueInterface";
import { useCharacterGallery } from "@/hooks/useCharacterGallery";
import type { GeneratedCharacter } from "@/lib/ai/types";
import Link from "next/link";
import { useState } from "react";

/* ============================================ */
/* CHARACTER DETAIL MODAL                        */
/* ============================================ */
function CharacterModal({
  character,
  onClose,
  onDelete,
}: {
  character: GeneratedCharacter;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  const { profile, imageBase64, psychoeducation } = character;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <button className="modal-close" onClick={onClose} aria-label="Close">
        ✕
      </button>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="character-card">
          <div className="character-image-wrapper">
            <img
              src={imageBase64}
              alt={profile.altText || `Cartoon illustration of ${profile.name}`}
            />
          </div>
          <div className="character-info">
            <div className="character-meet">Your thought visitor</div>
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
              <div className="character-section-title">Habitual Worries</div>
              <ul className="character-worries">
                {profile.worries.map((worry, i) => (
                  <li key={i}>{worry}</li>
                ))}
              </ul>
            </div>
            <div className="character-catchphrase">{profile.catchphrase}</div>

            <div className="character-dialogue-wrapper" style={{ marginTop: "1.5rem" }}>
              <DialogueInterface profile={profile} />
            </div>
          </div>
        </div>

        <div className="psychoeducation-panel">
          <div className="psychoeducation-header">
            Understanding this thought
          </div>
          <div className="psychoeducation-section">
            <div className="psychoeducation-label">What happened</div>
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

        <div className="actions-bar" style={{ paddingBottom: "2rem" }}>
          <button
            className="action-btn action-btn-secondary"
            onClick={() => {
              onDelete(character.id);
              onClose();
            }}
            style={{ color: "#FF6B6B" }}
          >
            Remove from gallery
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================ */
/* GALLERY PAGE                                  */
/* ============================================ */
export default function GalleryPage() {
  const { characters, count, loading, removeCharacter, clearGallery } =
    useCharacterGallery();
  const [selected, setSelected] = useState<GeneratedCharacter | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (loading) {
    return (
      <>
        <nav className="nav">
          <Link href="/" className="nav-logo">
            <span className="nav-logo-icon">✦</span>
            Thought Externalizer
          </Link>
          <div className="nav-links">
            <Link href="/gallery" className="nav-link active">
              Gallery
            </Link>
          </div>
        </nav>
        <main className="generation-screen">
          <div className="generation-orb" aria-hidden="true" />
          <p className="generation-text">Loading your visitors...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <span className="nav-logo-icon">✦</span>
          Thought Externalizer
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link">
            New Thought
          </Link>
          <Link href="/gallery" className="nav-link active">
            Gallery
            {count > 0 && (
              <span className="nav-gallery-count">{count}</span>
            )}
          </Link>
        </div>
      </nav>

      <main className="gallery-page">
        <div className="gallery-header">
          <h1 className="gallery-title">
            {count > 0 ? "Your Thought Visitors" : "Gerald's Gallery"}
          </h1>
          <p className="gallery-subtitle">
            {count > 0
              ? `${count} bumbling, ineffectual visitor${count !== 1 ? "s" : ""} — none of them as powerful as they think.`
              : "Your collection of externalised thoughts will appear here."}
          </p>
        </div>

        {count > 0 && (
          <div className="gallery-actions">
            <Link href="/" className="action-btn action-btn-primary">
              + Externalise a new thought
            </Link>
            {count > 1 && (
              <button
                className="action-btn action-btn-secondary"
                onClick={() => setShowClearConfirm(true)}
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {count === 0 ? (
          <div className="gallery-empty">
            <div className="gallery-empty-icon">✦</div>
            <p className="gallery-empty-text">
              No thought visitors yet. When you externalise your first
              intrusive thought, your visitor will appear here.
            </p>
            <Link href="/" className="action-btn action-btn-primary">
              Meet your first visitor →
            </Link>
          </div>
        ) : (
          <div className="gallery-grid">
            {characters.map((character) => (
              <div
                key={character.id}
                className="gallery-card"
                onClick={() => setSelected(character)}
                role="button"
                tabIndex={0}
                aria-label={`View ${character.profile.name}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(character);
                  }
                }}
              >
                <button
                  className="gallery-card-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCharacter(character.id);
                  }}
                  aria-label={`Delete ${character.profile.name}`}
                >
                  ✕
                </button>
                <div className="gallery-card-image">
                  <img
                    src={character.imageBase64}
                    alt={character.profile.altText || character.profile.name}
                  />
                </div>
                <div className="gallery-card-info">
                  <div className="gallery-card-name">
                    {character.profile.name}
                  </div>
                  <div className="gallery-card-archetype">
                    {character.profile.archetype}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clear Confirmation */}
        {showClearConfirm && (
          <div className="modal-overlay" onClick={() => setShowClearConfirm(false)}>
            <div
              className="crisis-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="crisis-icon">🗑️</div>
              <h2 className="crisis-title">Clear all visitors?</h2>
              <p className="crisis-message">
                This will remove all {count} thought visitors from your gallery.
                This action cannot be undone.
              </p>
              <div className="actions-bar">
                <button
                  className="action-btn action-btn-secondary"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Keep them
                </button>
                <button
                  className="action-btn action-btn-primary"
                  onClick={() => {
                    clearGallery();
                    setShowClearConfirm(false);
                  }}
                  style={{ background: "#FF6B6B" }}
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Character Detail Modal */}
        {selected && (
          <CharacterModal
            character={selected}
            onClose={() => setSelected(null)}
            onDelete={removeCharacter}
          />
        )}
      </main>
    </>
  );
}
