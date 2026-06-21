

{/*يعتمد على الموديل المختار بلوك كود جاهز يظهر كيف تستخدم الموديل بالكود ر*/}

import React from 'react';
import './SampleCodeBlock.css'

function SampleCodeBlock({model}) {
 
  const codes = {
    Gemenai: `import google.generativeai as genai
genai.configure(api_key="YOUR_KEY")
model = genai.GenerativeModel("gemini-1.5-pro")
response = model.generate_content("مرحباً!")
print(response.text)`,

    Poe: `import anthropic
client = anthropic.Anthropic(api_key="YOUR_KEY")
message = client.messages.create(
    model="claude-3-5-sonnet",
    messages=[{"role": "user", "content": "مرحباً!"}]
)
print(message.content)`,

    'Gbt-4': `from openai import OpenAI
client = OpenAI(api_key="YOUR_KEY")
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "مرحباً!"}]
)
print(response.choices[0].message.content)`,
  };

  return (
    <div className="code-card">
      <p>Python · {model}</p>
      <pre>{codes[model]}</pre>
    </div>
  );
}

export default SampleCodeBlock;