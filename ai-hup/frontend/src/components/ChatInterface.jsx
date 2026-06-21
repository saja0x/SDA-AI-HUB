import React, { useState } from 'react';
import './ChatInterface.css';
import Sparkle from '../assets/Sparkle.png';
import GeminiImg from '../assets/gemini.png';
import PoeImg from '../assets/poe.png';
import Gbt4Img from '../assets/gbt4.png';
 
// تغيير: model الحين كائن كامل ({id, name, provider, openrouter_id})
// مو نص بس. نختار صورة مناسبة حسب "مزوّد" الموديل (provider) بدل اسمه
// بالضبط - هذا يخلي أي موديل جديد من نفس المزوّد ياخذ صورة مناسبة
// تلقائيًا، بدل ما يحتاج اسمه يطابق قائمة ثابتة بالكود.
function ChatInterface({ model }) {
  const providerImages = {
    Google: GeminiImg,
    OpenAI: Gbt4Img,
  };
 
  const currentImg = (model && providerImages[model.provider]) ? providerImages[model.provider] : Sparkle;
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
      // تغيير: قبل كذا ما كان فيه catch إطلاقًا - لو السيرفر طاح، الزر
      // "ما يسوي شي" بصمت بدون أي رسالة. الحين نعرض رسالة خطأ واضحة.
      .catch(() => {
        setMessages(prev => [...prev,
          { text: userText, sender: "user" },
          { text: "⚠️ تعذر الاتصال بالسيرفر، تأكدي إنه شغال.", sender: "bot" }
        ]);
      })
      .finally(() => setLoading(false));
  };
 
  return (
    <div className="ChatInterface">
 
      <div className='chat-header'>
        <div className='head-info'>
          <img src={currentImg} alt={modelName || 'PlayGround'} className="Sparkle" />
          <h2 className='logo-text'>{modelName || 'PlayGround'}</h2>
        </div>
      </div>
 
      <div className="Chat-box">
        {modelName ? (
          <div className='AimessageAppear'>
            <img src={currentImg} className="Sparkle" alt={modelName} />
            <p className='messageAi'>Hey! I'm {modelName}</p>
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