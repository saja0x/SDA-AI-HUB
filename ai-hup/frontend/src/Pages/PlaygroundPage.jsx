import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ModelSwitcher from '../components/ModelSwitcher.jsx';
import ChatInterface from '../components/ChatInterface.jsx';
import ModelInstructions from '../components/ModelInstructions.jsx';
import SampleCodeBlock from '../components/SampleCodeBlock.jsx';
import LumiaMascot from '../assets/Lumia-mascot.png';
import { apiRequest } from '../api.js';
import './PlaygroundPage.css';

function PlaygroundPage() {
  const location = useLocation();
  const [selectedModel, setSelectedModel] = useState(null);
  const [allModels, setAllModels] = useState([]);

  useEffect(() => {
    apiRequest("/playground/models")
      .then((data) => setAllModels(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const preselectName = location.state?.preselect;
    if (preselectName && allModels.length > 0) {
      const found = allModels.find(
        (m) => m.name?.toLowerCase() === preselectName.toLowerCase()
      );
      if (found) setSelectedModel(found);
    }
  }, [location.state, allModels]);

  return (
    <div className='Chatpage'>
      <div className="upperSide">
        <div className="upper2Side">
          <div className="upperTop">
            <img src={LumiaMascot} alt="" className="logo" />
            <span className="brand">AI HUB</span>
          </div>
          <div className="titleUp">
            <h1>PlayGround</h1>
          </div>
          <div className="titleDown">
            <h2>Try The Ai Models here</h2>
          </div>
          <ModelSwitcher selected={selectedModel} onSelect={setSelectedModel} />
        </div>
      </div>

      <div className='MainSide'>
        <ChatInterface model={selectedModel} />
        <div>
          <ModelInstructions model={selectedModel} />
          <SampleCodeBlock model={selectedModel} />
        </div>
      </div>
    </div>
  );
}

export default PlaygroundPage;