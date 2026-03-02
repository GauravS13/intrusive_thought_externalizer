import Link from "next/link";

export default function PrivacyPage() {
  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <span className="nav-logo-icon">✦</span>
          Thought Externalizer
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/gallery" className="nav-link">
            Gallery
          </Link>
          <Link href="/privacy" className="nav-link active">
            Privacy
          </Link>
        </div>
      </nav>

      <main
        className="gallery-page"
        style={{ maxWidth: "640px", margin: "0 auto" }}
      >
        <div className="gallery-header">
          <h1 className="gallery-title">Your Privacy</h1>
          <p className="gallery-subtitle">
            Written in plain language, not legalese.
          </p>
        </div>

        <div style={{ lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
          <div className="character-section">
            <div
              className="character-section-title"
              style={{ color: "var(--color-accent-teal)" }}
            >
              What we store
            </div>
            <p className="psychoeducation-text">
              <strong style={{ color: "var(--color-text-primary)" }}>
                Nothing on any server.
              </strong>{" "}
              Your intrusive thoughts are sent to AI models for processing and
              immediately discarded. They are never logged, saved, or associated
              with any identifier. The characters you create are stored entirely
              in your browser&apos;s local storage (IndexedDB) and never leave your
              device.
            </p>
          </div>

          <div className="character-section">
            <div
              className="character-section-title"
              style={{ color: "var(--color-accent-teal)" }}
            >
              No accounts. No tracking.
            </div>
            <p className="psychoeducation-text">
              There are no user accounts, no cookies, no analytics, and no
              third-party tracking scripts. We don&apos;t know who you are, and we
              like it that way.
            </p>
          </div>

          <div className="character-section">
            <div
              className="character-section-title"
              style={{ color: "var(--color-accent-teal)" }}
            >
              AI processing
            </div>
            <p className="psychoeducation-text">
              Your text input is sent to open-source AI models hosted on
              HuggingFace&apos;s Inference API for safety classification, thought
              analysis, character generation, and image creation. These calls
              are made through our server as a proxy (to protect the API key)
              but your text is never stored, logged, or retained at any point
              in the pipeline.
            </p>
          </div>

          <div className="character-section">
            <div
              className="character-section-title"
              style={{ color: "var(--color-accent-teal)" }}
            >
              Deleting your data
            </div>
            <p className="psychoeducation-text">
              You can delete individual characters from your gallery, or clear
              your entire gallery with one action. Since all data lives in your
              browser, clearing your browser data will also remove everything.
            </p>
          </div>

          <div className="character-section">
            <div
              className="character-section-title"
              style={{ color: "var(--color-accent-teal)" }}
            >
              Not a clinical tool
            </div>
            <p className="psychoeducation-text">
              This application is a mental wellness support tool, not a clinical
              intervention. It is not a substitute for professional mental health
              care, not diagnostic in any capacity, and not appropriate as a
              primary treatment for clinical OCD, PTSD, or other conditions.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
