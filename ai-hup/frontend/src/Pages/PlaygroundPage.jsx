import React, { useState } from 'react';
import ModelSwitcher from '../components/ModelSwitcher.jsx';
import ChatInterface from '../components/ChatInterface.jsx';
import ModelInstructions from '../components/ModelInstructions.jsx';
import SampleCodeBlock from '../components/SampleCodeBlock.jsx';
import Sparkle from '../assets/Sparkle.png';
import './PlaygroundPage.css'
 
function PlaygroundPage() {
  // تغيير: selectedModel الحين كائن كامل (id, name, provider, openrouter_id)
  // بدل ما يكون نص اسم بس - عشان نقدر نعرف مزوّد الموديل بأي مكان نحتاجه
  const [selectedModel, setSelectedModel] = useState(null);
 
  return (
    <div className='Chatpage'>
 
      <div className="upperSide">
 
        <div className="upper2Side">
          <div className="upperTop">
            <img src={Sparkle} alt="" className="logo" />
            <span className="brand">AI HUB </span>
          </div>
 
          <div className="titleUp">
            <h1> PlayGround </h1>
          </div>
          <div className="titleDown">
            <h2>Try The Ai Models here</h2>
          </div>
          <ModelSwitcher selected={selectedModel} onSelect={setSelectedModel} />
        </div>
 
        <div className="upper3side"></div>
      </div>
 
      <div className='MainSide'>
        <ChatInterface model={selectedModel} />
        <div>
          <ModelInstructions model={selectedModel} />
          <SampleCodeBlock model={selectedModel} />
        </div>
        <div className="mainmessage"></div>
      </div>
 
    </div>
  );
}
export default PlaygroundPage;