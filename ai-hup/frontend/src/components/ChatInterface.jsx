import React, { useState } from 'react';
import './ChatInterface.css';
import LumiaMascot from '../assets/Lumia-mascot.png';
 
// تغيير: شلنا الاعتماد على gemini.png / poe.png / gbt4.png - هذي
// الملفات فُقدت من مجلد assets وكانت تسبب طيحان كامل الموقع (Vite ما
// يقدر يشتغل لو ملف مستورد مفقود). الحين شخصية لوميا هي الأيقونة
// الوحيدة المستخدمة، بكل الحالات (قبل وبعد اختيار الموديل).
function WarningIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
        stroke="var(--magenta)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
 
function ChatInterface({ model }) {
  const modelName = model?.name || null;
 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
 
    const userText = input;
    setInput('');
    setLoading(true);
 
    fetch("http://127.0.0.1:8000/playground/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText, model: modelName || "AI" })
    })
      .then(res => res.json())
      .then(data => {
        setMessages(prev => [...prev,
          { text: userText, sender: "user" },
          { text: data.reply, sender: "bot" }
        ]);
      })
      .catch(() => {
        setMessages(prev => [...prev,
          { text: userText, sender: "user" },
          { text: "تعذر الاتصال بالسيرفر، تأكدي إنه شغال.", sender: "bot", isError: true }
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
              style={msg.isError ? { display: "flex", alignItems: "center", gap: "6px" } : undefined}
            >
              {msg.isError && <WarningIcon />}
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
        <form className='chat-form' onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder='Message...'
            className='messageInput'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className='send' type="submit" disabled={loading}>Send</button>
        </form>
      </div>
 
    </div>
  );
}
 
export default ChatInterface;