{/*  واجهة محادثة الشات بوت يسأل ويرشح الموديل المناسب > شات بوت*/}
 
import React, { useState } from 'react';
import './ChatInterface.css'
import LumiaMascot from '../assets/Lumia-mascot.png';
 
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
 
function RecommenderChat() {
 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
 
  const [step, setStep] = useState('useCase');
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
 
    const userText = input;
    setInput('');
 
    fetch("http://127.0.0.1:8000/chatbot/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ use_case: userText })
    })
      .then(res => res.json())
      .then(data => {
        setMessages(prev => [...prev,
          { text: userText, sender: "user" },
          { text: data.recommended_model, sender: "bot" }
        ]);
      })
      .catch(() => {
        setMessages(prev => [...prev,
          { text: userText, sender: "user" },
          { text: "Could not connect to the server.", sender: "bot", isError: true }
        ]);
      });
  };
 
  const handleUseCaseClick = (label) => {
    setMessages(prev => [...prev,
      { text: label, sender: "user" },
      { text: "What's your budget?", sender: "bot" }
    ]);
    setStep('budget');
  };
 
  const handleBudgetClick = (label, value) => {
    fetch("http://127.0.0.1:8000/chatbot/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ use_case: value })
    })
      .then(res => res.json())
      .then(data => {
        setMessages(prev => [...prev,
          { text: label, sender: "user" },
          { text: data.recommended_model, sender: "bot" }
        ]);
        setStep('done');
      })
      .catch(() => {
        setMessages(prev => [...prev,
          { text: label, sender: "user" },
          { text: "Could not connect to the server.", sender: "bot", isError: true }
        ]);
        setStep('done');
      });
  };
 
  const handleRestart = () => {
    setMessages([]);
    setStep('useCase');
  };
 
  return (
  <div className="ChatInterface">
    <div className='chat-header'>
      <div className='head-info'>
        <img src={LumiaMascot} alt="Lumia" className="Sparkle" />
        <h2 className='logo-text'>ChatBot</h2>
      </div>
    </div>
 
    <div className="Chat-box">
      <div className='AimessageAppear'>
        <img src={LumiaMascot} alt="Lumia" className="Sparkle" />
        <p className='messageAi'>Hey! I'll help you choose the AI you want to use.</p>
      </div>
 
      {messages.map((msg, i) => (
        <div key={i} className={msg.sender === 'user' ? 'usermessage' : 'AimessageAppear'}>
          {msg.sender === 'bot' && <img src={LumiaMascot} alt="Lumia" className="Sparkle" />}
          <p
            className={msg.sender === 'user' ? 'usermessage' : 'messageAi'}
            style={msg.isError ? { display: "flex", alignItems: "center", gap: "6px" } : undefined}
          >
            {msg.isError && <WarningIcon />}
            {msg.text}
          </p>
        </div>
      ))}
 
      {step === 'useCase' && (
        <div className='quick-options'>
          <button onClick={() => handleUseCaseClick('Code')}>Code</button>
          <button onClick={() => handleUseCaseClick('Translation')}>Translation</button>
          <button onClick={() => handleUseCaseClick('Images')}>Images</button>
          <button onClick={() => handleUseCaseClick('Chat')}>Chat</button>
        </div>
      )}
 
      {step === 'budget' && (
        <div className='quick-options'>
          <button onClick={() => handleBudgetClick('Free', 'مجاني')}>Free</button>
          <button onClick={() => handleBudgetClick('Medium', 'متوسط')}>Medium</button>
          <button onClick={() => handleBudgetClick('High', 'عالي')}>High</button>
        </div>
      )}
 
      {step === 'done' && (
        <div className='quick-options'>
          <button onClick={handleRestart}>Try a new recommendation</button>
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
        <button className='send' type="submit">Send</button>
      </form>
    </div>
  </div>
);
    }
    export default RecommenderChat;