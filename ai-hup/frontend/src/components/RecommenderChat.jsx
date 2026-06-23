import React, { useState } from 'react';
import './ChatInterface.css';
import LumiaMascot from '../assets/Lumia-mascot.png';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api.js';

function WarningIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
        stroke="var(--magenta)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RecommenderChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState('useCase');
  const [recommendedModel, setRecommendedModel] = useState(null);

  const sendRequest = (text, displayText) => {
    apiRequest("/chatbot/recommend", {
      method: "POST",
      body: { use_case: text },
    })
      .then((data) => {
        setRecommendedModel(data.recommended_model);
        setMessages((prev) => [...prev,
          { text: displayText || text, sender: "user" },
          {
            text: data.recommended_model,
            reason: data.reason || "",
            sender: "bot",
            isRecommendation: true,
          },
        ]);
      })
      .catch(() => {
        setMessages((prev) => [...prev,
          { text: displayText || text, sender: "user" },
          { text: "Could not connect to the server.", sender: "bot", isError: true },
        ]);
      });
  };

const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userText = input;
    setInput('');
    sendRequest(userText);
    setStep('done');  
};

  const handleUseCaseClick = (label) => {
    setMessages((prev) => [...prev,
      { text: label, sender: "user" },
      { text: "What's your budget?", sender: "bot" },
    ]);
    setStep('budget');
  };

  const handleBudgetClick = (label) => {
    sendRequest(label, label);
    setStep('done');
  };

  const handleRestart = () => {
    setMessages([]);
    setStep('useCase');
    setRecommendedModel(null);
  };

  const handleTryInPlayground = () => {
    navigate('/playground', { state: { preselect: recommendedModel } });
  };

  return (
    <div className="ChatInterface">
      <div className='chat-header'>
        <div className='head-info'>
          <img src={LumiaMascot} alt="Lumia" className="Sparkle" />
          <h2 className='logo-text'>Chat Bot</h2>
        </div>
      </div>

      <div className="Chat-box">
        <div className='AimessageAppear'>
          <img src={LumiaMascot} alt="Lumia" className="Sparkle" />
          <p className='messageAi'>Hey! Tell me what you need and I'll recommend the best AI model for you.</p>
        </div>

        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === 'user' ? 'usermessage' : 'AimessageAppear'}>
            {msg.sender === 'bot' && <img src={LumiaMascot} alt="Lumia" className="Sparkle" />}
            <div>
              <p
                className={msg.sender === 'user' ? 'usermessage' : 'messageAi'}
                style={msg.isError ? { display: "flex", alignItems: "center", gap: "6px" } : undefined}
              >
                {msg.isError && <WarningIcon />}
                {msg.isRecommendation ? `We recommend: ${msg.text}` : msg.text}
              </p>

              {msg.isRecommendation && msg.reason && (
                <p style={{ fontSize: "12px", color: "var(--text-lo)", margin: "4px 0 8px" }}>
                  {msg.reason}
                </p>
              )}

              {msg.isRecommendation && (
                <button
                  onClick={handleTryInPlayground}
                  style={{
                    marginTop: "4px",
                    background: "var(--grad-primary)",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Try in Playground →
                </button>
              )}
            </div>
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
            <button onClick={() => handleBudgetClick('Free budget, looking for open-source')}>Free</button>
            <button onClick={() => handleBudgetClick('Medium budget')}>Medium</button>
            <button onClick={() => handleBudgetClick('High budget, best quality')}>High</button>
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
            placeholder='Describe what you need...'
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