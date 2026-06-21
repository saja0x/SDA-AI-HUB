
import "./ModelSwitcher.css";
import React, {useState, useEffect} from "react";


function ModelSwitcher({ selected, onSelect }) {
  
  const [models, setModels]= useState([]);
  useEffect(() => {
  fetch("http://127.0.0.1:8000/playground/models")
    .then(res => res.json())
    .then(data => setModels(data));
}, []);

  return (
    <div className="AllAi">
      {models.map((model)=>(
      
      <button key={model.name} onClick={() => onSelect(model.name)} > {model.name} </button>
       )) }
      </div>
    
  );
}

export default ModelSwitcher;

