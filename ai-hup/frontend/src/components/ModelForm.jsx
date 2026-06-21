import React from "react";

import { useState } from "react";

function ModelForm() {
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [visible, setVisible] = useState(true);
  const [status, setStatus] = useState("");

  const addTag = () => {
    if (newTag.trim() === "") return;
    setTags([...tags, newTag.trim()]);
    setNewTag("");
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("");

    fetch("http://127.0.0.1:8000/admin/models", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, provider, description, tags, visible }),
    })
      .then((res) => res.json())
      .then(() => {
        setStatus("✅ Model saved successfully");
        setName("");
        setProvider("");
        setDescription("");
        setTags([]);
        setVisible(true);
      })
      .catch(() => setStatus("⚠️ Could not save model, try again"));
  };

  return (
    <div className="model-form-container">
      <h2>إضافة موديل جديد</h2>
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

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="tag-input-row">
          <input
            type="text"
            placeholder="أضف تاج"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button type="button" onClick={addTag}>Add Tag</button>
        </div>

        <div className="tag-list">
          {tags.map((tag, index) => (
            <span key={index} className="tag-pill">
              #{tag}
              <button type="button" onClick={() => removeTag(index)}>×</button>
            </span>
          ))}
        </div>

        <label className="visible-checkbox">
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
          />
          Visible
        </label>

        {status && <p className="form-status">{status}</p>}

        <button type="submit">
          Save Model
        </button>
      </form>
    </div>
  );
}

export default ModelForm;