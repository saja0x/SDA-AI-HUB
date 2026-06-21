import React, { useState, useEffect } from "react";

export default function BenchmarkPage() {
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/models")
      .then((res) => res.json())
      .then((data) => setModels(data))
      .catch((err) => console.log("API Error:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Model Benchmarking Scores</h1>

      <table border="1" cellPadding="10">
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
  );
}