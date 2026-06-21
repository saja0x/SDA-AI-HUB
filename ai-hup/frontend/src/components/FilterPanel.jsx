import React from "react";
 
// تغيير مهم: ورقة المشروع الرسمية تطلب 7 أنواع فلترة + خاصية ترتيب.
// قبل كذا كان موجود 3 بس (Provider, Type, Pricing). ضفنا الأربعة الباقية:
// Modality، Context length، Open-source/Proprietary، Use case - بالإضافة
// لقائمة الترتيب (Sorting) المطلوبة بقسم 7 من ورقة المشروع.
function FilterPanel({
  provider, setProvider,
  type, setType,
  pricing, setPricing,
  modality, setModality,
  openSource, setOpenSource,
  useCase, setUseCase,
  minContext, setMinContext,
  sortBy, setSortBy,
  showAccuracy, setShowAccuracy,
}) {
  return (
    <div className="filter-panel">
      <h3>Filters</h3>
 
      <select value={provider} onChange={(e) => setProvider(e.target.value)}>
        <option value="">All Providers</option>
        <option value="OpenAI">OpenAI</option>
        <option value="Google">Google</option>
        <option value="Anthropic">Anthropic</option>
        <option value="Meta">Meta</option>
        <option value="DeepSeek">DeepSeek</option>
        <option value="Alibaba">Alibaba</option>
      </select>
 
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">All Types</option>
        <option value="LLM">LLM</option>
        <option value="multimodal">Multimodal</option>
        <option value="embedding">Embedding</option>
      </select>
 
      <select value={pricing} onChange={(e) => setPricing(e.target.value)}>
        <option value="">All Pricing</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
 
      {/* نوع المدخلات (Modality) */}
      <select value={modality} onChange={(e) => setModality(e.target.value)}>
        <option value="">All Modalities</option>
        <option value="text">Text</option>
        <option value="image">Image</option>
        <option value="audio">Audio</option>
      </select>
 
      {/* مفتوح المصدر مقابل مغلق */}
      <select value={openSource} onChange={(e) => setOpenSource(e.target.value)}>
        <option value="">Open-source or Proprietary</option>
        <option value="open">Open-source only</option>
        <option value="proprietary">Proprietary only</option>
      </select>
 
      {/* الاستخدام (Use case) */}
      <input
        type="text"
        placeholder="Use case (e.g. coding, chat)"
        value={useCase}
        onChange={(e) => setUseCase(e.target.value)}
      />
 
      {/* أقل حجم ذاكرة (Context length) */}
      <label className="min-context">
        Min context:
        <input
          type="number"
          min="0"
          placeholder="e.g. 100000"
          value={minContext}
          onChange={(e) => setMinContext(e.target.value)}
        />
      </label>
 
      {/* الترتيب (Sorting) - مطلوب صراحة بورقة المشروع، ما كان موجود إطلاقًا */}
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="">Sort by…</option>
        <option value="accuracy-desc">Accuracy: High to Low</option>
        <option value="latency-asc">Latency: Fast to Slow</option>
        <option value="name-asc">Name: A to Z</option>
        <option value="context-desc">Context Window: High to Low</option>
      </select>
 
      <label className="toggle-accuracy">
        <input
          type="checkbox"
          checked={showAccuracy}
          onChange={(e) => setShowAccuracy(e.target.checked)}
        />
        Toggle Accuracy
      </label>
    </div>
  );
}
 
export default FilterPanel;