import React, { useState, useEffect, useContext } from 'react';
import './ChatInterface.css';
import LumiaMascot from '../assets/Lumia-mascot.png';
import { AuthContext } from '../AuthContext.jsx';
import { apiRequest } from '../api.js';

const MESSAGE_LIMIT = 10;

function WarningIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
        stroke="var(--magenta)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChatInterface({ model }) {
  const { token } = useContext(AuthContext);
  const modelName = model?.name || null;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(MESSAGE_LIMIT);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    if (!model?.id) {
      setRemaining(MESSAGE_LIMIT);
      setLimitReached(false);
      return;
    }
    if (!token) return;

    apiRequest(`/playground/usage/${model.id}`, { token })
      .then((data) => {
        setRemaining(data.remaining ?? MESSAGE_LIMIT);
        setLimitReached((data.remaining ?? MESSAGE_LIMIT) <= 0);
      })
      .catch(() => {});
  }, [model?.id, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || limitReached) return;

    const userText = input;
    setInput('');
    setLoading(true);

    // نستخدم fetch هنا بشكل مباشر لأننا نحتاج نتحقق من status 429
    // قبل ما نحوّل الرد لـ JSON — apiRequest يرمي error على أي رد مو 2xx
    fetch("http://127.0.0.1:8000/playground/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        message: userText,
        model: modelName || "AI",
        model_id: model?.id,
      }),
    })
      .then((res) => {
        if (res.status === 429) {
          setLimitReached(true);
          setRemaining(0);
          setMessages((prev) => [...prev,
            { text: userText, sender: "user" },
            {
              text: `You've reached the ${MESSAGE_LIMIT}-message limit for this model. Try exploring other models!`,
              sender: "bot",
              isLimit: true,
            },
          ]);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setMessages((prev) => [...prev,
          { text: userText, sender: "user" },
          { text: data.reply, sender: "bot" },
        ]);
        if (data.remaining !== undefined) {
          setRemaining(data.remaining);
          if (data.remaining <= 0) setLimitReached(true);
        }
      })
      .catch(() => {
        setMessages((prev) => [...prev,
          { text: userText, sender: "user" },
          { text: "Could not connect to server.", sender: "bot", isError: true },
        ]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="ChatInterface">
      <div className='chat-header'>
        <div className='head-info'>
          <img src={LumiaMascot} alt={modelName || 'PlayGround'} className="Sparkle" />
          <h2 className='logo-text'>{modelName || 'PlayGround'}</h2>
        </div>
        {modelName && (
          <span style={{
            fontSize: "12px",
            color: remaining <= 3 ? "var(--magenta)" : "var(--text-lo)",
            marginInlineStart: "auto",
            paddingInlineEnd: "4px",
          }}>
            {remaining}/{MESSAGE_LIMIT} messages left
          </span>
        )}
      </div>

      <div className="Chat-box">
        {modelName ? (
          <div className='AimessageAppear'>
            <img src={LumiaMascot} className="Sparkle" alt={modelName} />
            <p className='messageAi'>Hey! I'm {modelName}</p>
          </div>
        ) : (
          <div className='AimessageAppear'>
            <img src={LumiaMascot} className="Sparkle" alt="Lumia" />
            <p className='messageAi'>Hey! Choose The Ai you want to use</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === 'user' ? 'usermessage' : 'AimessageAppear'}>
            <p
              className={msg.sender === 'user' ? 'usermessage' : 'messageAi'}
              style={(msg.isError || msg.isLimit) ? { display: "flex", alignItems: "center", gap: "6px" } : undefined}
            >
              {(msg.isError || msg.isLimit) && <WarningIcon />}
              {msg.text}
            </p>
          </div>
        ))}

        {loading && (
          <div className='AimessageAppear'>
            <p className='messageAi'>…</p>
          </div>
        )}
      </div>

      <div className='Chatfooter'>
        {limitReached ? (
          <p style={{ textAlign: "center", color: "var(--magenta)", fontSize: "13px", padding: "8px 0" }}>
            Limit reached — try another model!
          </p>
        ) : (
          <form className='chat-form' onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={modelName ? 'Message...' : 'Choose a model first'}
              className='messageInput'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!modelName || loading}
            />
            <button className='send' type="submit" disabled={!modelName || loading || limitReached}>
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ChatInterface;