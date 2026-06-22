import "./ModelSwitcher.css";
import React, { useState, useEffect } from "react";
import { apiRequest } from "../api.js";

function ModelSwitcher({ selected, onSelect }) {
  const [models, setModels] = useState([]);

  useEffect(() => {
    apiRequest("/playground/models")
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