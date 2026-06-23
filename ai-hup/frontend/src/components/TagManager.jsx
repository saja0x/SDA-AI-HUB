import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext.jsx";
import { apiRequest } from "../api.js";

function TagManager() {
  const { token } = useContext(AuthContext);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const loadTags = () => {
    apiRequest("/admin/tags", { token })
      .then((data) => setTags(Array.isArray(data) ? data : []))
      .catch((err) => console.log("API Error:", err));
  };

  useEffect(() => {
    loadTags();
   
  }, []);

  const addTag = () => {
    if (!newTag.trim()) return;
    apiRequest(`/admin/tags?name=${encodeURIComponent(newTag.trim())}`, {
      method: "POST",
      token,
    })
      .then(() => {
        setNewTag("");
        loadTags();
      })
      .catch((err) => console.log("API Error:", err));
  };

  const deleteTag = (id) => {
    apiRequest(`/admin/tags/${id}`, {
      method: "DELETE",
      token,
    })
      .then(() => loadTags())
      .catch((err) => console.log("API Error:", err));
  };

  return (
    <div>
      <input
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        placeholder="New tag name"
      />
      <button onClick={addTag}>Add Tag</button>

      {tags.map((tag) => (
        <div key={tag.id}>
          {tag.name}
          <button onClick={() => deleteTag(tag.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default TagManager;