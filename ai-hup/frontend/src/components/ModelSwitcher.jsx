import "./ModelSwitcher.css";
import React, { useState, useEffect } from "react";
 
// تغيير: قبل كذا كانت ترسل اسم الموديل (نص) بس لما تختارينه. الحين
// ترسل بيانات الموديل كاملة (id, name, provider, openrouter_id...) -
// هذا اللي يخلي ChatInterface وModelInstructions وSampleCodeBlock
// يقدرون يتصرفون صح حسب المزوّد الحقيقي للموديل المختار.
function ModelSwitcher({ selected, onSelect }) {
  const [models, setModels] = useState([]);
 
  useEffect(() => {
    fetch("http://127.0.0.1:8000/playground/models")
      .then((res) => res.json())
      .then((data) => setModels(data))
      .catch((err) => console.log("API Error:", err));
  }, []);
 
  return (
    <div className="AllAi">
      {models.map((model) => (
        <button
          key={model.id}
          onClick={() => onSelect(model)}
          className={selected?.name === model.name ? "active" : ""}
        >
          {model.name}
        </button>
      ))}
    </div>
  );
}
 
export default ModelSwitcher;