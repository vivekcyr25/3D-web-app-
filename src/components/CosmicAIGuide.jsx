import { useState, useRef, useEffect, useCallback } from "react";

const KNOWLEDGE_BASE = {
  mercury: "Mercury is the smallest planet in our solar system and closest to the Sun. Despite being closest to the solar furnace, Venus is actually hotter due to its runaway greenhouse effect. Mercury has a metallic core comprising about 85% of its radius!",
  venus: "Venus possesses a crushing atmosphere of carbon dioxide and clouds of sulfuric acid. Surface atmospheric pressure is 92 times that of Earth — equivalent to being 900 meters underwater. Its retrograde rotation means the Sun rises in the west and sets in the east.",
  earth: "Earth orbits inside the Sun's habitable goldilocks zone, where liquid surface water can endure for billions of years. Its active magnetosphere, produced by a churning liquid iron outer core, shields the biosphere from energetic coronal mass ejections.",
  mars: "Mars is home to Olympus Mons, an ancient shield volcano rising 22 km into the thin atmosphere — nearly three times the height of Everest. Evidence from rovers reveals ancient river valleys, delta formations, and vast subterranean water ice deposits.",
  jupiter: "Jupiter is a colossal gas giant with more mass than all other planets combined (318 Earth masses). Its Great Red Spot is an anticyclonic storm larger than Earth that has persisted for centuries. Jupiter possesses an immense magnetic field and 95 known moons.",
  saturn: "Saturn's iconic ring system spans up to 282,000 kilometers across, yet is astoundingly thin — typically only 10 to 30 meters thick! The rings consist of billions of chunks of water ice ranging from micro-dust to boulder-sized icebergs.",
  uranus: "Uranus is an ice giant tilted by an unprecedented 97.8 degrees, meaning it rotates almost parallel to its orbital plane. Its pale cyan coloration stems from methane in the upper atmosphere absorbing red wavelengths of solar illumination.",
  neptune: "Neptune is battered by supersonic winds exceeding 2,100 km/h, the most violent recorded in our planetary neighborhood. Voyager 2 detected giant dark storm vortices similar to Jupiter's spots, driven by internal heat escaping from its mantle.",
  sun: "The Sun accounts for 99.86% of the solar system's total mass. In its core, thermonuclear fusion converts 600 million tons of hydrogen into helium every single second, radiating energy that powers life across our planetary system.",
  default: "Cosmic transmission online. Ask any question about planetary geology, orbital mechanics, solar wind, or atmospheric compositions to initiate deep-space telemetry analysis."
};

const SUGGESTIONS = [
  "Explain Earth's protective magnetosphere",
  "How thick are Saturn's rings?",
  "Why is Venus hotter than Mercury?",
  "What creates supersonic winds on Neptune?"
];

export function CosmicAIGuide({ selectedPlanet, isOpen, onToggle }) {
  const [messages, setMessages] = useState([
    {
      id: "init",
      role: "assistant",
      text: "Greetings explorer. I am your Cosmic AI Guide. Select any celestial body or transmit a query below to receive real-time astrophysical telemetry."
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const streamTimerRef = useRef(null);
  const stopButtonRef = useRef(null);
  const launcherRef = useRef(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus management when opening/closing
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onToggle(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onToggle]);

  // Stream text token-by-token
  const startStreamingResponse = useCallback((fullText) => {
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);

    const messageId = `msg-${Date.now()}`;
    const words = fullText.split(" ");
    let index = 0;

    setIsStreaming(true);
    setMessages((prev) => [...prev, { id: messageId, role: "assistant", text: "" }]);

    streamTimerRef.current = setInterval(() => {
      index++;
      if (index <= words.length) {
        const currentSlice = words.slice(0, index).join(" ");
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, text: currentSlice } : msg))
        );
      } else {
        clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
        setIsStreaming(false);
      }
    }, 45);
  }, []);

  const handleStop = useCallback(() => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    setIsStreaming(false);
    inputRef.current?.focus();
  }, []);

  const handleSend = useCallback((textToSend) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isStreaming) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", text: query }
    ]);
    setInputQuery("");

    // Determine AI response from knowledge base
    const lower = query.toLowerCase();
    let response = KNOWLEDGE_BASE.default;
    for (const key of Object.keys(KNOWLEDGE_BASE)) {
      if (lower.includes(key)) {
        response = KNOWLEDGE_BASE[key];
        break;
      }
    }
    if (response === KNOWLEDGE_BASE.default && selectedPlanet) {
      response = `Analyzing ${selectedPlanet.name}: ${selectedPlanet.fact} Classified as a ${selectedPlanet.type} body with an orbital velocity factor of ${selectedPlanet.speed}x.`;
    }

    startStreamingResponse(response);
  }, [inputQuery, isStreaming, selectedPlanet, startStreamingResponse]);

  return (
    <>
      {/* Floating launcher button */}
      <button
        ref={launcherRef}
        type="button"
        className="ai-guide-launcher"
        onClick={() => onToggle(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="cosmic-ai-panel"
        aria-label={isOpen ? "Close Cosmic AI Guide" : "Open Cosmic AI Guide assistant"}
      >
        <span className="ai-guide-launcher__icon" aria-hidden="true">📡</span>
        <span className="ai-guide-launcher__text">Cosmic AI Guide</span>
        {isStreaming && (
          <span className="ai-guide-launcher__pulse" aria-hidden="true" />
        )}
      </button>

      {/* AI Guide Drawer Panel */}
      {isOpen && (
        <aside
          id="cosmic-ai-panel"
          className="ai-guide-panel"
          role="region"
          aria-label="Cosmic AI Telemetry Guide"
        >
          {/* Header */}
          <div className="ai-guide-panel__header">
            <div className="ai-guide-panel__title-group">
              <span className="ai-guide-panel__icon" aria-hidden="true">🌌</span>
              <div>
                <h2 className="ai-guide-panel__title">Cosmic AI Guide</h2>
                <span className="ai-guide-panel__status" aria-label="Status: Telemetry link active">
                  ● Telemetry Link Active
                </span>
              </div>
            </div>
            <button
              type="button"
              className="ai-guide-panel__close"
              onClick={() => onToggle(false)}
              aria-label="Close Cosmic AI Guide panel"
            >
              ✕
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="ai-guide-panel__suggestions" role="group" aria-label="Suggested cosmic inquiries">
            {SUGGESTIONS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="ai-guide-panel__suggestion-btn"
                onClick={() => handleSend(prompt)}
                disabled={isStreaming}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat transcript */}
          <div
            className="ai-guide-panel__messages"
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
            aria-label="Cosmic AI conversation transcript"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`ai-guide-msg ai-guide-msg--${msg.role}`}
              >
                <span className="ai-guide-msg__sender">
                  {msg.role === "assistant" ? "Cosmic AI:" : "Explorer:"}
                </span>
                <p className="ai-guide-msg__text">{msg.text}</p>
              </div>
            ))}

            {/* Polite live streaming announcer for screen readers */}
            <div
              className="sr-only"
              role="status"
              aria-live="polite"
              aria-atomic="false"
            >
              {isStreaming && "Cosmic AI is streaming a transmission..."}
            </div>

            <div ref={chatEndRef} />
          </div>

          {/* Active Streaming Controls: Stop Button */}
          {isStreaming && (
            <div className="ai-guide-panel__stream-controls">
              <button
                ref={stopButtonRef}
                type="button"
                className="ai-guide-stop-btn"
                onClick={handleStop}
                aria-label="Stop generating cosmic transmission"
              >
                <span aria-hidden="true">⏹</span> Stop Transmission
              </button>
            </div>
          )}

          {/* Input form */}
          <form
            className="ai-guide-panel__form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <label htmlFor="cosmic-ai-input" className="sr-only">
              Enter inquiry for Cosmic AI Guide
            </label>
            <input
              ref={inputRef}
              id="cosmic-ai-input"
              type="text"
              className="ai-guide-panel__input"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                selectedPlanet
                  ? `Ask about ${selectedPlanet.name}…`
                  : "Ask about planets, orbits, or stars…"
              }
              disabled={isStreaming}
              autoComplete="off"
            />
            <button
              type="submit"
              className="ai-guide-panel__send-btn"
              disabled={isStreaming || !inputQuery.trim()}
              aria-label="Transmit cosmic question"
            >
              Send
            </button>
          </form>
        </aside>
      )}
    </>
  );
}
