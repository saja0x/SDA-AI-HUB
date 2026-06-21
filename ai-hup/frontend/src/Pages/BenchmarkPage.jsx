import React, { useState, useEffect } from "react";
import "../components/ComparisonTable.css";
 
// تغيير: كانت هذي الصفحة بدون أي تنسيق (بس padding بسيط، وجدول HTML
// عادي بدون لون) - ما تستخدم .container زي باقي صفحات الموقع، فتطلع
// بشكل مختلف تمامًا. الحين تستخدم نفس كلاس الصفحة، ونفس تنسيق الجدول
// المستخدم بصفحة المقارنة، فتاخذ نفس الألوان تلقائيًا.
export default function BenchmarkPage() {
  const [models, setModels] = useState([]);
 
  useEffect(() => {
    fetch("http://127.0.0.1:8000/models")
      .then((res) => res.json())
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