import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext.jsx";
 
function TagManager() {
  const { token } = useContext(AuthContext);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
 
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
 
  const loadTags = () => {
    fetch("http://127.0.0.1:8000/admin/tags", { headers: authHeaders })
      .then((res) => res.json())
      .then((data) => setTags(Array.isArray(data) ? data : []))
      .catch((err) => console.log("API Error:", err));
  };
 
  useEffect(() => {
    loadTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  const addTag = () => {
    if (!newTag.trim()) return;
    fetch(`http://127.0.0.1:8000/admin/tags?name=${encodeURIComponent(newTag.trim())}`, {
      method: "POST",
      headers: authHeaders,
    })
      .then((res) => res.json())
      .then(() => {
        setNewTag("");
        loadTags();
      })
      .catch((err) => console.log("API Error:", err));
  };
 
  const deleteTag = (id) => {
    fetch(`http://127.0.0.1:8000/admin/tags/${id}`, {
      method: "DELETE",
      headers: authHeaders,
    })
      .then((res) => res.json())
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