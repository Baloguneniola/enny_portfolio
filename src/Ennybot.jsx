import React, { useState, useRef, useEffect } from 'react';

// ── SYSTEM PROMPT — edit this with your real info ──────────────────────────
const ENNY_SYSTEM_PROMPT = `You are ENNYBOT, a friendly and witty AI assistant embedded in Eniola Gilgal Balogun's personal portfolio website. Your job is to answer questions about Eniola in a conversational, helpful, and occasionally charming way. Keep answers concise (2-4 sentences unless a longer answer is clearly needed). Use light tech humour when appropriate. Never make up information — if you don't know something, say so politely.

Here is everything you know about Eniola:

NAME: Balogun Eniola Gilgal
NICKNAME: Ennysticks
LOCATION: Lagos, Nigeria
EMAIL: beniola589@gmail.com
PHONE: +234 810 847 4435
LINKEDIN: linkedin.com/in/enny2580
Gender:Female
GITHUB: github.com/Baloguneniola

Hobbies: Playing drums, Playing football, coding.

EDUCATION:
- B.Sc. Software Engineering, Babcock University, Ilishan-Remo, Nigeria (Oct 2023 – Present)
- GPA: 4.30 / 5.0 (Progressively improving)
- Relevant courses: Software Engineering, Data Structures, Artificial Intelligence, Machine Learning, OOP & Design, Digital Logic, C/C++, Java, Systems Analysis & Design
- Languages spoken: English, Yoruba

WORK EXPERIENCE:
1. Software Engineering Intern — Ecobank Software Centre, eProcess (Jan 2026 – Present)
   - Working in enterprise fintech environment
   - Exposure to enterprise-level systems, dev workflows, professional software practices
   - Collaborating with team on technical tasks and real-world problem-solving

2. Founder & Developer — One Drop AI Blood Donation App (Jan 2025 – Present)
   - Building an AI-powered blood donation app using geolocation to connect donors and recipients in real time
   - Features: donor-recipient matching, health tracking, emergency alert system
   - Tech: React Native, AI/ML, Geolocation API
   - Conducted user research to validate product-market fit

3. AI Content Evaluator — CrowdGen (Appen) (May 2024 – Present, Remote)
   - Evaluating online content for misinformation using structured guidelines
   - Analyzing posts for accuracy and credibility with written justifications
   - Contributing to AI model training for content moderation

4. Assistant Coding Instructor — In-depth Computers (Jul 2024 – Aug 2024)
   - Taught basic programming to children at a summer tech bootcamp
   - Covered HTML, CSS, JavaScript through hands-on activities
   - Trained 30+ children in foundational coding skills

PROJECTS:
1. One Drop — AI-powered blood donation app (in development)
   - React Native, AI/ML, Geolocation API
2. Student Management System (SMS)
   - Web app for managing student records, courses, grades
   - React frontend, Java backend, PostgreSQL database
   - Features: user auth, role-based access, responsive design
   - GitHub: github.com/Baloguneniola

TECHNICAL SKILLS:
- Front-End: HTML, CSS, JavaScript, React, Tailwind CSS, Bootstrap
- Back-End & Database: PHP, Node.js, Java, MySQL, PostgreSQL
- Mobile: Flutter, Dart, React Native, Android Studio
- Languages: C, C++, Java, JavaScript, Python, PHP, Dart
- Dev Tools: Git, GitHub, VS Code, XAMPP, Android Studio
- Design & Productivity: Figma, Canva, Microsoft Office, AI Annotation, Data Labeling

PERSONALITY & INTERESTS:
- Passionate about AI-powered products, clean code, and technology that makes a real difference
- Works independently, follows detailed guidelines, always looking to improve
- Interested in full-stack development, AI/ML, and mobile development
- Open to internships, collaborations, freelance projects, and tech conversations
- Fun fact: balances academics (4.30 GPA) with real-world internship and startup building simultaneously

AVAILABILITY: Open to work and new opportunities.

When asked about contacting Eniola, direct people to beniola589@gmail.com or LinkedIn.
When asked what you are, say you are ENNYBOT, Eniola's personal AI assistant.
`;


const GEMINI_API_KEY = process.env.REACT_APP_API_KEY; 
const GEMINI_MODEL = process.env.REACT_APP_API_MODEL;

async function callGemini(messages) {
 
  const chatHistory = messages.slice(1); 

  const contents = chatHistory.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  if (contents.length === 0) return 'No response received.';

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: ENNY_SYSTEM_PROMPT }],
        },
        contents,
        generationConfig: {
          maxOutputTokens: 400,
          temperature: 0.7,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'There is no response. Please try a different question.';
}

const SUGGESTIONS = [
  "What's Eniola's tech stack?",
  'Tell me about One Drop',
  'Is Eniola open to work?',
  'What is her GPA?',
  'What are her hobbies?',
  'What experience does she have with AI?',
  'what programming languages does she know?',
  'What projects has she worked on?',
  'What is her work experience?',
  'Who is eniola?',
];

export default function EnnyBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hey! I'm **ENNYBOT** — Eniola's personal AI assistant. Ask me anything about her skills, projects, or experience!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, open]);

  const send = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    setShowSuggestions(false);
    setInput('');
    setError(null);

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const reply = await callGemini(newMessages);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const renderText = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');

  return (
    <>
      {/* ── FLOATING BUTTON ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '32px',
          zIndex: 200,
          background: 'var(--accent)',
          border: 'none',
          borderRadius: '50px',
          padding: '0 20px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          boxShadow: '0 0 0 0 rgba(0,212,255,0.4)',
          animation: open ? 'none' : 'botPulse 2s ease-in-out infinite',
          transition: 'all 0.2s',
          color: 'var(--bg)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: '13px',
          letterSpacing: '0.05em',
        }}
        aria-label="Open ENNYBOT"
      >
        <span style={{ fontSize: '20px', lineHeight: 1 }}></span>
        <span>{open ? 'CLOSE' : 'ENNYBOT'}</span>
        {!open && (
          <span
            style={{
              background: 'rgba(10,14,23,0.25)',
              borderRadius: '10px',
              fontSize: '10px',
              padding: '2px 6px',
              color: 'var(--bg)',
              fontWeight: 400,
            }}
          >
            AI
          </span>
        )}
      </button>

      {/* ── CHAT WINDOW ── */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '158px',
            right: '32px',
            width: '360px',
            maxHeight: '520px',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--surface)',
            border: '1px solid var(--border-glow)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,212,255,0.08)',
            zIndex: 200,
            animation: 'botSlideUp 0.25s ease both',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'var(--surface2)',
              borderBottom: '1px solid var(--border)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0,
              }}
            >
              👾
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  letterSpacing: '0.06em',
                }}
              >
                ENNYBOT
              </div>
              <div style={{ fontSize: '11px', color: 'var(--accent3)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--accent3)',
                    display: 'inline-block',
                    animation: 'botPulse 1.5s ease-in-out infinite',
                  }}
                />
                Online · Eniola's AI Assistant
              </div>
            </div>
            <button
              onClick={() => {
                setMessages([
                  {
                    role: 'assistant',
                    content:
                      "Hey! I'm **ENNYBOT** — Eniola's personal AI assistant. Ask me anything about her skills, projects, or experience!",
                  },
                ]);
                setShowSuggestions(true);
              }}
              title="Clear chat"
              style={{
                marginLeft: 'auto',
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                borderRadius: '6px',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              ↺
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--accent) transparent',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'botFadeIn 0.2s ease both',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background:
                      msg.role === 'user'
                        ? 'var(--accent)'
                        : 'var(--surface2)',
                    border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                    color: msg.role === 'user' ? 'var(--bg)' : 'var(--text-dim)',
                    fontSize: '13px',
                    lineHeight: 1.65,
                    fontWeight: msg.role === 'user' ? 600 : 400,
                  }}
                  dangerouslySetInnerHTML={{ __html: renderText(msg.content) }}
                />
              </div>
            ))}

            {/* Suggestions */}
            {showSuggestions && messages.length === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>
                  try asking:
                </div>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--text-dim)',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-mono)',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = 'var(--accent)';
                      e.target.style.color = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.color = 'var(--text-dim)';
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', animation: 'botFadeIn 0.2s ease both' }}>
                <div
                  style={{
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    borderRadius: '14px 14px 14px 4px',
                    padding: '12px 18px',
                    display: 'flex',
                    gap: '5px',
                    alignItems: 'center',
                  }}
                >
                  {[0, 1, 2].map((n) => (
                    <span
                      key={n}
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        display: 'block',
                        animation: `botDot 1s ${n * 0.15}s ease-in-out infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div
                style={{
                  background: 'rgba(244,63,94,0.1)',
                  border: '1px solid rgba(244,63,94,0.3)',
                  color: '#f43f5e',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                ⚠ {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            style={{
              borderTop: '1px solid var(--border)',
              padding: '12px',
              display: 'flex',
              gap: '8px',
              background: 'var(--surface2)',
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask about Eniola..."
              disabled={loading}
              style={{
                flex: 1,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '9px 14px',
                color: 'var(--text)',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              style={{
                background: input.trim() && !loading ? 'var(--accent)' : 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                width: '38px',
                height: '38px',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: input.trim() && !loading ? 'var(--bg)' : 'var(--text-muted)',
                fontSize: '14px',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
              aria-label="Send"
            >
              ➤
            </button>
          </div>

          {/* Powered by */}
          <div
            style={{
              textAlign: 'center',
              padding: '6px',
              fontSize: '10px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              background: 'var(--surface2)',
              borderTop: '1px solid var(--border)',
              letterSpacing: '0.04em',
            }}
          >
            powered by Gemini · built by Enny
          </div>
        </div>
      )}

      {/* ── KEYFRAMES injected via style tag ── */}
      <style>{`
        @keyframes botPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,212,255,0.4); }
          50% { box-shadow: 0 0 0 10px rgba(0,212,255,0); }
        }
        @keyframes botSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes botFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes botDot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%            { transform: scale(1.1); opacity: 1; }
        }
        @media (max-width: 500px) {
          /* chatbot window becomes full-width on mobile */
        }
      `}</style>
    </>
  );
}