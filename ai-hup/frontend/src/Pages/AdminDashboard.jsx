import React, { useState, useEffect } from "react";
import TagManager from "../components/TagManager.jsx";
import VisibilityToggle from "../components/VisibilityToggle.jsx";

function AdminDashboard({ models = [] }) {
  // نسخة محلية من الموديلات عشان نقدر نحذف/نعدّل بالواجهة فورًا
  const [localModels, setLocalModels] = useState(models);
  const [hiddenIds, setHiddenIds] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editProvider, setEditProvider] = useState("");

  // لما الموديلات توصل من الـ API بـ App.jsx، نحدّث نسختنا المحلية
  useEffect(() => {
    setLocalModels(models);
  }, [models]);

  const toggleVisible = (modelId) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      if (next.has(modelId)) {
        next.delete(modelId);
      } else {
        next.add(modelId);
      }
      return next;
    });
  };

  const startEdit = (model) => {
    setEditingId(model.id);
    setEditName(model.name);
    setEditProvider(model.provider);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = (modelId) => {
    fetch(`http://127.0.0.1:8000/admin/models/${modelId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, provider: editProvider }),
    })
      .then((res) => res.json())
      .then(() => {
        setLocalModels((prev) =>
          prev.map((m) =>
            m.id === modelId ? { ...m, name: editName, provider: editProvider } : m
          )
        );
        setEditingId(null);
      })
      .catch((err) => console.log("API Error:", err));
  };

  const handleDelete = (modelId) => {
    fetch(`http://127.0.0.1:8000/admin/models/${modelId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setLocalModels((prev) => prev.filter((m) => m.id !== modelId));
      })
      .catch((err) => console.log("API Error:", err));
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      {localModels.map((model) => {
        const isVisible = !hiddenIds.has(model.id);
        const isEditing = editingId === model.id;

        return (
          <div key={model.id} className="admin-model-row">
            {isEditing ? (
              <div className="admin-edit-form">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Model Name"
                />
                <input
                  type="text"
                  value={editProvider}
                  onChange={(e) => setEditProvider(e.target.value)}
                  placeholder="Provider"
                />
                <button onClick={() => saveEdit(model.id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <>
                <h3>{model.name}</h3>
                <div>
                  <button onClick={() => startEdit(model)}>Edit</button>
                  <button onClick={() => handleDelete(model.id)}>Delete</button>
                  <VisibilityToggle
                    visible={isVisible}
                    setVisible={() => toggleVisible(model.id)}
                  />
                </div>
              </>
            )}
          </div>
        );
      })}

      <h3>Manage Tags</h3>
      <TagManager />
    </div>
  );
}

export default AdminDashboard;