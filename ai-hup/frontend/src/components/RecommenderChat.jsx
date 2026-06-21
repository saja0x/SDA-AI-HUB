 
{/*  واجهة محادثة الشات بوت يسأل ويرشح الموديل المناسب > شات بوت*/}
 
import React, { useState } from 'react';
import './ChatInterface.css'
import Sparkle from '../assets/Sparkle.png';
 
 
function RecommenderChat() { 
 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
 
  // ملاحظة جديدة: متغير step يحفظ وين نحن بالمحادثة (يسأل عن الاستخدام، أو الميزانية، أو خلص) - يستخدم بالأزرار الجديدة فقط، ما يأثر على الكتابة الحرة
  const [step, setStep] = useState('useCase');
 
  const handleSubmit = (e) => {
  e.preventDefault();
  if (!input.trim()) return;
  
  fetch("http://127.0.0.1:8000/chatbot/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ use_case: input })
  })
    .then(res => res.json())
    .then(data => {
      setMessages([...messages, 
        { text: input, sender: "user" },
        { text: data.recommended_model, sender: "bot" }
      ]);
      setInput('');
    });
};
 
  // ملاحظة جديدة: دالة جديدة بالكامل تتعامل مع ضغط أزرار التوصية الشخصية (مو الكتابة الحرة) - تسأل عن الاستخدام أول، وبعدها الميزانية، وبالأخير ترسل الطلب لنفس الإند بوينت الموجود
  const handleOptionClick = (text) => {
    if (step === 'useCase') {
      setMessages(prev => [...prev,
        { text: text, sender: "user" },
        { text: "وش ميزانيتك؟", sender: "bot" }
      ]);
      setStep('budget');
    } else if (step === 'budget') {
      fetch("http://127.0.0.1:8000/chatbot/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_case: text })
      })
        .then(res => res.json())
        .then(data => {
          setMessages(prev => [...prev,
            { text: text, sender: "user" },
            { text: data.recommended_model, sender: "bot" }
          ]);
          setStep('done');
        });
    }
  };
 
  // ملاحظة جديدة: دالة جديدة بالكامل تعيد ضبط المحادثة من جديد لو المستخدم ضغط "جربي توصية جديدة" بعد ما خلص
  const handleRestart = () => {
    setMessages([]);
    setStep('useCase');
  };
 
  return (
  <div className="ChatInterface">
    <div className='chat-header'>
      <div className='head-info'>
        <img src={Sparkle} alt="logo" className="Sparkle" />
        <h2 className='logo-text'>ChatBot</h2>
      </div>
    </div>
 
    <div className="Chat-box">
      <div className='AimessageAppear'>
        <img src={Sparkle} alt="icon" className="Sparkle" />
        <p className='messageAi'>Hey! help you to Choose The Ai you want to use</p>
      </div>
 
      {messages.map((msg, i) => (
        <div key={i} className={msg.sender === 'user' ? 'usermessage' : 'AimessageAppear'}>
          {msg.sender === 'bot' && <img src={Sparkle} alt="bot" className="Sparkle" />}
          <p className={msg.sender === 'user' ? 'usermessage' : 'messageAi'}>{msg.text}</p>
        </div>
      ))}
 
      {/* ملاحظة جديدة: جزء جديد بالكامل يعرض أزرار الاختيار جوا نفس صندوق الشات (Chat-box) - يظهر فقط حسب الخطوة الحالية (step)، وما يحذف أو يغير مربع الكتابة الحرة تحت */}
      {step === 'useCase' && (
        <div className='quick-options'>
          <button onClick={() => handleOptionClick('كود')}>كود</button>
          <button onClick={() => handleOptionClick('ترجمة')}>ترجمة</button>
          <button onClick={() => handleOptionClick('صور')}>صور</button>
          <button onClick={() => handleOptionClick('محادثة')}>محادثة</button>
        </div>
      )}
 
      {step === 'budget' && (
        <div className='quick-options'>
          <button onClick={() => handleOptionClick('مجاني')}>مجاني</button>
          <button onClick={() => handleOptionClick('متوسط')}>متوسط</button>
          <button onClick={() => handleOptionClick('عالي')}>عالي</button>
        </div>
      )}
 
      {step === 'done' && (
        <div className='quick-options'>
          <button onClick={handleRestart}>جربي توصية جديدة</button>
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