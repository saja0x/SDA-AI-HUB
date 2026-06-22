import React, { useState, useEffect } from "react";
import "../components/ComparisonTable.css";
import { apiRequest } from '../api.js';

export default function BenchmarkPage() {
  const [models, setModels] = useState([]);

  useEffect(() => {
    apiRequest("/models")
      .then((data) => setModels(data))
      .catch((err) => console.log("API Error:", err));
  }, []);

  return (
    <div className="container">
      <h1>Model Benchmarking Scores</h1>

      <div className="comparison-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Accuracy</th>
              <th>Latency</th>
            </tr>
          </thead>

          <tbody>
            {models.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.accuracy}%</td>
                <td>{m.latency}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}