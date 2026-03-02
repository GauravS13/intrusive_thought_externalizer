"use client";

import { chatWithCharacter, type ChatMessage } from "@/app/actions/chat-action";
import type { CharacterProfile } from "@/lib/ai/types";
import { useEffect, useRef, useState } from "react";

export function DialogueInterface({ profile }: { profile: CharacterProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg = inputValue;
    setInputValue("");
    
    // Optimistic UI update
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const reply = await chatWithCharacter(profile, messages, userMsg);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "... (lost in thought) ..." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        className="action-btn action-btn-secondary" 
        onClick={() => setIsOpen(true)}
        style={{ marginTop: "1rem", width: "100%" }}
      >
        Talk to {profile.name}
      </button>
    );
  }

  return (
    <div className="dialogue-interface">
      <div className="dialogue-header">
        <span>Chatting with {profile.name}</span>
        <button onClick={() => setIsOpen(false)} aria-label="Close chat">✕</button>
      </div>
      
      <div className="dialogue-messages" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="dialogue-empty">
            <p>Say hello! Remember, they're just a harmless, confused visitor.</p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`dialogue-message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        
        {isTyping && (
          <div className="dialogue-message assistant typing">
            <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
          </div>
        )}
      </div>

      <div className="dialogue-input-area">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Say something to them..."
          disabled={isTyping}
        />
        <button onClick={handleSend} disabled={!inputValue.trim() || isTyping}>
          Send
        </button>
      </div>
    </div>
  );
}
