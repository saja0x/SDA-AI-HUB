import React from 'react';
import './SampleCodeBlock.css'
 
function SampleCodeBlock({ model }) {
  if (!model) return null;
 
  const technicalName = model.openrouter_id || "provider/model-name";
 
  const code = `import requests
 
response = requests.post(
    "https://openrouter.ai/api/v1/chat/completions",
    headers={"Authorization": "Bearer YOUR_OPENROUTER_KEY"},
    json={
        "model": "${technicalName}",
        "messages": [{"role": "user", "content": "مرحباً!"}]
    }
)
print(response.json())`;
 
  return (
    <div className="code-card">
      <p>Python · {model.name}</p>
      <pre>{code}</pre>
    </div>
  );
}
 
export default SampleCodeBlock;