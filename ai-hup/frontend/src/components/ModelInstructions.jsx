

{/* يظهر تعليمات الموديل المختار تلقائياً لما يبدل.  يعتمد على المحادثة*/}


import React from 'react';
import './SampleCodeBlock.css';

function ModelInstructions({ model }) {
  const instructions = {
    Gemenai: ["سريع في الردود", "مناسب للمهام الطويلة"],
    'Gbt-4': ["دقيق في الردود", "ممتاز في التحليل"],
    Poe: ["سهل الاستخدام", "سريع الرد"],
  };

  return (
    <div className="instructions-card">
      <h3>تعليمات الاستخدام — {model}</h3>
      <ul>
        {instructions[model]?.map((item, i) => (
          <li key={i}>✅ {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default ModelInstructions;

