import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ComparisonTable from "../components/ComparisonTable";
import ModelSelector from "../components/ModelSelector";

export default function ModelComparison() {
  const [models, setModels] = useState([]);
  const [selected, setSelected] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/models")
      .then((res) => res.json())
      .then((data) => setModels(data))
      .catch((err) => console.log("API Error:", err));
  }, []);

  // لو جاي من زر "Compare" بكرت موديل معيّن (من صفحة Home)، نضيفه تلقائيًا
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