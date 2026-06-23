import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext.jsx";
 
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M5 13l4 4L19 7" stroke="var(--violet-soft)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function WarningIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
        stroke="var(--magenta)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
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
 
const checkboxRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: "auto",
};
const checkboxStyle = { width: "auto", flexShrink: 0 };
 
const numberInputStyle = {
  background: "var(--surface-2)",
  color: "var(--text-hi)",
  border: "1px solid var(--border)",
};
 
function ModelForm() {
  const { token } = useContext(AuthContext);
 
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [type, setType] = useState("LLM");
  const [openSource, setOpenSource] = useState(false);
  const [description, setDescription] = useState("");
 
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
 
  const [modality, setModality] = useState(["text"]);
 
  const [contextWindow, setContextWindow] = useState(0);
  const [pricing, setPricing] = useState("medium");
  const [latency, setLatency] = useState(1.0);
  const [accuracy, setAccuracy] = useState(0);
  const [capabilities, setCapabilities] = useState("");
  const [limitations, setLimitations] = useState("");
 
  const [useCases, setUseCases] = useState([]);
  const [newUseCase, setNewUseCase] = useState("");
 
  const [samplePrompts, setSamplePrompts] = useState([]);
  const [newPrompt, setNewPrompt] = useState("");
 
  const [releaseDate, setReleaseDate] = useState("");
  const [version, setVersion] = useState("");
  const [visible, setVisible] = useState(true);
  const [openrouterId, setOpenrouterId] = useState("");
 
  const [status, setStatus] = useState(null);
 
  const addToList = (value, setValue, list, setList) => {
    if (value.trim() === "") return;
    setList([...list, value.trim()]);
    setValue("");
  };
 
  const removeFromList = (index, list, setList) => {
    setList(list.filter((_, i) => i !== index));
  };
 
  const toggleModality = (m) => {
    setModality((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };
 
  const resetForm = () => {
    setName(""); setProvider(""); setType("LLM"); setOpenSource(false);
    setDescription(""); setTags([]); setModality(["text"]);
    setContextWindow(0); setPricing("medium"); setLatency(1.0); setAccuracy(0);
    setCapabilities(""); setLimitations(""); setUseCases([]); setSamplePrompts([]);
    setReleaseDate(""); setVersion(""); setVisible(true); setOpenrouterId("");
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(null);
 
    fetch("/api/admin/models", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        provider,
        type,
        open_source: openSource,
        description,
        tags,
        modality,
        context_window: Number(contextWindow) || 0,
        pricing,
        latency: Number(latency) || 0,
        accuracy: Number(accuracy) || 0,
        capabilities,
        limitations,
        use_cases: useCases,
        sample_prompts: samplePrompts,
        release_date: releaseDate,
        version,
        visible,
        openrouter_id: openrouterId || null,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStatus({ type: "error", message: data.error });
          return;
        }
        setStatus({ type: "success", message: "Model saved successfully" });
        resetForm();
      })
      .catch(() => setStatus({ type: "error", message: "Could not save model, try again" }));
  };
 
  return (
    <div className="model-form-container">
      <h2>Add A New Model</h2>
      <form onSubmit={handleSubmit}>
 
        <input
          type="text"
          placeholder="Model Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Provider"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          required
        />
 
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="LLM">LLM</option>
          <option value="multimodal">Multimodal</option>
          <option value="embedding">Embedding</option>
        </select>
 
        <label style={checkboxRowStyle}>
          <input
            type="checkbox"
            checked={openSource}
            onChange={(e) => setOpenSource(e.target.checked)}
            style={checkboxStyle}
          />
          Open Source
        </label>
 
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
 
        <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
          <legend>Supported Modalities</legend>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {["text", "image", "audio"].map((m) => (
              <label key={m} style={checkboxRowStyle}>
                <input
                  type="checkbox"
                  checked={modality.includes(m)}
                  onChange={() => toggleModality(m)}
                  style={checkboxStyle}
                />
                {m}
              </label>
            ))}
          </div>
        </fieldset>
 
        <label>
          Context Window
          <input
            type="number"
            min="0"
            value={contextWindow}
            onChange={(e) => setContextWindow(e.target.value)}
            style={numberInputStyle}
          />
        </label>
 
        <select value={pricing} onChange={(e) => setPricing(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
 
        <label>
          Latency (seconds)
          <input
            type="number"
            step="0.1"
            min="0"
            value={latency}
            onChange={(e) => setLatency(e.target.value)}
            style={numberInputStyle}
          />
        </label>
 
        <label>
          Accuracy (%)
          <input
            type="number"
            min="0"
            max="100"
            value={accuracy}
            onChange={(e) => setAccuracy(e.target.value)}
            style={numberInputStyle}
          />
        </label>
 
        <textarea
          placeholder="Capabilities (e.g. coding, reasoning, vision)"
          value={capabilities}
          onChange={(e) => setCapabilities(e.target.value)}
        />
        <textarea
          placeholder="Limitations"
          value={limitations}
          onChange={(e) => setLimitations(e.target.value)}
        />
 
        <div className="tag-input-row">
          <input
            type="text"
            placeholder="Add Tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button type="button" onClick={() => addToList(newTag, setNewTag, tags, setTags)}>
            Add Tag
          </button>
        </div>
        <div className="tag-list">
          {tags.map((tag, index) => (
            <span key={index} className="tag-pill">
              #{tag}
              <button type="button" onClick={() => removeFromList(index, tags, setTags)}>×</button>
            </span>
          ))}
        </div>
 
        <div className="tag-input-row">
          <input
            type="text"
            placeholder="Use case (e.g. coding, chat)"
            value={newUseCase}
            onChange={(e) => setNewUseCase(e.target.value)}
          />
          <button type="button" onClick={() => addToList(newUseCase, setNewUseCase, useCases, setUseCases)}>
            Add Use Case
          </button>
        </div>
        <div className="tag-list">
          {useCases.map((uc, index) => (
            <span key={index} className="tag-pill">
              {uc}
              <button type="button" onClick={() => removeFromList(index, useCases, setUseCases)}>×</button>
            </span>
          ))}
        </div>
 
        <div className="tag-input-row">
          <input
            type="text"
            placeholder="Sample prompt"
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
          />
          <button type="button" onClick={() => addToList(newPrompt, setNewPrompt, samplePrompts, setSamplePrompts)}>
            Add Prompt
          </button>
        </div>
        <div className="tag-list">
          {samplePrompts.map((p, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ChatIcon />
              {p}
              <button type="button" onClick={() => removeFromList(index, samplePrompts, setSamplePrompts)}>×</button>
            </div>
          ))}
        </div>
 
        <input
          type="text"
          placeholder="Release Date (e.g. 2026-01-15)"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Version (e.g. v1.0)"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
        />
 
        <label>
          OpenRouter ID (  My Choice To Enable Chat On The Playground  )
          <input
            type="text"
            placeholder="provider/model-name"
            value={openrouterId}
            onChange={(e) => setOpenrouterId(e.target.value)}
          />
        </label>
 
        <label className="visible-checkbox" style={checkboxRowStyle}>
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            style={checkboxStyle}
          />
          Visible
        </label>
 
        {status && (
          <p className="form-status" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {status.type === "success" ? <CheckIcon /> : <WarningIcon />}
            {status.message}
          </p>
        )}
 
        <button type="submit">Save Model</button>
      </form>
    </div>
  );
}
 
export default ModelForm;