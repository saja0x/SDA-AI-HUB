import React, { useState } from 'react';
import './ChatInterface.css';
import Sparkle from '../assets/Sparkle.png';
import GeminiImg from '../assets/gemini.png';
import PoeImg from '../assets/poe.png';
import Gbt4Img from '../assets/gbt4.png';

function ChatInterface({ model }) { 
   
  // قمنا بتغطية كل الاحتمالات للحروف الكبيرة والصغيرة لضمان ظهور الصورة دائماً
  const modelImages = {
    Gemini: GeminiImg,
    Gemenai: GeminiImg,  // لو ضغط زر Gemenai بالـ e يشتغل
    Poe: PoeImg,
    'Gbt-4': Gbt4Img,
    'GPT-4': Gbt4Img    // لو جاء الاسم كذا يشتغل
  };

  // كود حماية: إذا كان الموديل المختار موجود وله صورة نضعها، وإذا لم يجدها يضع صورة Sparkle الاحتياطية تلقائياً
  const currentImg = (model && modelImages[model]) ? modelImages[model] : Sparkle;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    fetch("http://127.0.0.1:8000/playground/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, model: model || "AI" })
    })
      .then(res => res.json())
      .then(data => {
        setMessages([...messages,
          { text: input, sender: "user" },
          { text: data.reply, sender: "bot" }
        ]);
        setInput('');
      });
  };

  return (
    <div className="ChatInterface">

      <div className='chat-header'>
        <div className='head-info'>
          {/* عرض الأيقونة الصحيحة في الهيدر */}
          <img src={currentImg} alt={model || 'PlayGround'} className="Sparkle" />
          <h2 className='logo-text'>{model || 'PlayGround'}</h2>
        </div>
      </div>

      <div className="Chat-box">
        {model ? (
          <div className='AimessageAppear'>
            {/* عرض الأيقونة الصحيحة داخل الشات */}
            <img src={currentImg} className="Sparkle" alt={model} />
            <p className='messageAi'>Hey! I'm {model}</p>
          </div>
        ) : (
          <div className='AimessageAppear'>
            <img src={Sparkle} className="Sparkle" alt="AI HUB" />
            <p className='messageAi'>Hey! Choose The Ai you want to use</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === 'user' ? 'usermessage' : 'AimessageAppear'}>
            <p className={msg.sender === 'user' ? 'usermessage' : 'messageAi'}>{msg.text}</p>
          </div>
        ))}
     
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

export default ChatInterface;


 