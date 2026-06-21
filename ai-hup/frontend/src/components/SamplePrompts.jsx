import React from "react";
 
// أيقونة "محادثة" مكتوبة هنا مباشرة (بدون ملف منفصل)
function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        stroke="var(--cyan)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
 
function SamplePrompts({ prompts }) {
  const list =
    prompts && prompts.length > 0
      ? prompts
      : [
          "Explain AI in simple terms",
          "Write a React component",
          "Summarize a long article",
        ];
 
  return (
    <div>
      <h3>Sample Prompts</h3>
      {list.map((p, i) => (
        <p key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ChatIcon />
          {p}
        </p>
      ))}
    </div>
  );
}
 
export default SamplePrompts;