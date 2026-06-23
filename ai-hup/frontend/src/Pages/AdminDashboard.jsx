import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import TagManager from "../components/TagManager.jsx";
import VisibilityToggle from "../components/VisibilityToggle.jsx";
import { AuthContext } from "../AuthContext.jsx";
 
function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editProvider, setEditProvider] = useState("");
 
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
 
  const loadModels = () => {
    setLoading(true);
    fetch("/api/admin/models", { headers: authHeaders })
      .then((res) => res.json())
      .then((data) => setModels(Array.isArray(data) ? data : []))
      .catch((err) => console.log("API Error:", err))
      .finally(() => setLoading(false));
  };
 
  useEffect(() => {
    loadModels();
  }, []);
 
  const toggleVisible = (model) => {
    fetch(`/api/admin/models/${model.id}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({
        name: model.name,
        provider: model.provider,
        visible: !model.visible,
      }),
    })
      .then((res) => res.json())
      .then(() => loadModels())
      .catch((err) => console.log("API Error:", err));
  };
 
  const startEdit = (model) => {
    setEditingId(model.id);
    setEditName(model.name);
    setEditProvider(model.provider);
  };
 
  const cancelEdit = () => setEditingId(null);
 
const saveEdit = (modelId) => {
  const currentModel = models.find((m) => m.id === modelId);

  fetch(`/api/admin/models/${modelId}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify({
      ...currentModel,
      name: editName,
      provider: editProvider,
    }),
  })
    .then((res) => res.json())
    .then(() => {
      setEditingId(null);
      loadModels();
    })
    .catch((err) => console.log("API Error:", err));
};

 
  const handleDelete = (modelId) => {
    fetch(`/api/admin/models/${modelId}`, {
      method: "DELETE",
      headers: authHeaders,
    })
      .then((res) => res.json())
      .then(() => loadModels())
      .catch((err) => console.log("API Error:", err));
  };
 
  if (loading) {
    return (
      <div className="admin-container">
        <h2>Admin Dashboard</h2>
        <p>Loading…</p>
      </div>
    );
  }
 
  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <p><Link to="/create">+ Add New Model</Link></p>
 
      {models.map((model) => {
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
                <h3>
                  {model.name}
                  {!model.visible && (
                    <span style={{ opacity: 0.6, fontSize: "0.65em", marginRight: 8 }}>
                      (Hidden)
                    </span>
                  )}
                </h3>
                <div>
                  <button onClick={() => startEdit(model)}>Edit</button>
                  <button onClick={() => handleDelete(model.id)}>Delete</button>
                  <VisibilityToggle
                    visible={model.visible}
                    setVisible={() => toggleVisible(model)}
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