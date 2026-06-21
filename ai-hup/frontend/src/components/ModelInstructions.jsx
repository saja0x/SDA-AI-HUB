import React from 'react';
import './ModelInstructions.css';
 
// تغيير: كان هذا الملف يستورد './SampleCodeBlock.css' بالغلط (ملف ثاني
// تمامًا)، فصار فيه تعريفين متضاربين لنفس الكلاس ".instructions-card"
// بملفين مختلفين. الحين يستورد ملفه الصحيح، وألوانه موحّدة مع باقي الموقع.
//
// التعليمات تتولّد حسب "مزوّد" الموديل (provider)، فتشتغل لأي موديل
// موجود أو يضاف مستقبلاً، مو بس أسماء ثابتة قديمة.
function ModelInstructions({ model }) {
  if (!model) return null;
 
  const providerTips = {
    OpenAI: ["دقيق بالتحليل والمنطق", "يدعم استدعاء الأدوات (tools)"],
    Anthropic: ["قوي بفهم النصوص الطويلة", "يهتم بالدقة والأمان بالردود"],
    Google: ["سريع جدًا بالرد", "يدعم الصور والنصوص مع بعض"],
    DeepSeek: ["تكلفة منخفضة مقارنة بالأداء", "مناسب للمهام التقنية"],
    Meta: ["مفتوح المصدر", "مناسب للتجربة والتعديل المحلي"],
    Alibaba: ["دعم قوي للغة العربية والصينية", "أسعار منافسة"],
  };
 
  const tips = providerTips[model.provider] || ["موديل ذكاء اصطناعي عام الاستخدام"];
 
  return (
    <div className="instructions-card">
      <h3>تعليمات الاستخدام — {model.name}</h3>
      <ul>
        {tips.map((item, i) => (
          <li key={i}>✅ {item}</li>
        ))}
      </ul>
    </div>
  );
}
 
export default ModelInstructions;