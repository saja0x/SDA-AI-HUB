import React from "react";
function FilterPanel({
  provider, setProvider,
  type, setType,
  pricing, setPricing,
  showAccuracy, setShowAccuracy,
}) {
  return (
    <div className="filter-panel">
      <h3>Filters</h3>

      <select
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
      >
        <option value="">All Providers</option>
<option value="OpenAI">OpenAI</option>
<option value="Google">Google</option>
<option value="Anthropic">Anthropic</option>
<option value="Meta">Meta</option>
<option value="DeepSeek">DeepSeek</option>
<option value="Alibaba">Alibaba</option>
      </select>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="LLM">LLM</option>
        <option value="multimodal">Multimodal</option>
        <option value="embedding">Embedding</option>
      </select>

      <select
        value={pricing}
        onChange={(e) => setPricing(e.target.value)}
      >
        <option value="">All Pricing</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
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