import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ComparisonTable from "../components/ComparisonTable";
import ModelSelector from "../components/ModelSelector";
import { apiRequest } from "../api.js";

export default function ModelComparison() {
  const [models, setModels] = useState([]);
  const [selected, setSelected] = useState([]);
  const location = useLocation();

  useEffect(() => {
    apiRequest("/models")
      .then((data) => setModels(data))
      .catch((err) => console.log("API Error:", err));
  }, []);

  useEffect(() => {
    const preselectId = location.state?.preselectId;
    if (preselectId && models.length > 0) {
      const match = models.find((m) => m.id === preselectId);
      if (match) {
        setSelected((prev) =>
          prev.find((m) => m.id === match.id) ? prev : [...prev, match]
        );
      }
    }
  }, [models, location.state]);

  return (
    <div className="container mt-4">
      <h1>AI Model Comparison</h1>

      <ModelSelector selected={selected} setSelected={setSelected} allModels={models} />

      {selected.length >= 2 && <ComparisonTable selected={selected} />}
    </div>
  );
}