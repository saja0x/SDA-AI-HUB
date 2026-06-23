import React from 'react';
import './ModelInstructions.css';
 
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M5 13l4 4L19 7" stroke="var(--violet-soft)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
 
function ModelInstructions({ model }) {
  if (!model) return null;
 
  const providerTips = {
    OpenAI: ["Strong at analysis and reasoning", "Supports tool calling"],
    Anthropic: ["Great at understanding long texts", "Focused on accuracy and safety"],
    Google: ["Very fast responses", "Supports images and text together"],
    DeepSeek: ["Low cost relative to performance", "Well suited for technical tasks"],
    Meta: ["Open source", "Good for local experimentation and customization"],
    Alibaba: ["Strong Arabic and Chinese language support", "Competitive pricing"],
  };
 
  const tips = providerTips[model.provider] || ["General-purpose AI model"];
 
  return (
    <div className="instructions-card">
      <h3>Usage tips — {model.name}</h3>
      <ul>
        {tips.map((item, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckIcon />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
 
export default ModelInstructions;