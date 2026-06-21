import React from "react";

import { useState } from "react";

function TagManager() {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    setTags([...tags, newTag]);
    setNewTag("");
  };

  const deleteTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
      />

      <button onClick={addTag}>
        Add Tag
      </button>

      {tags.map((tag, index) => (
        <div key={index}>
          {tag}
          <button
            onClick={() => deleteTag(index)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default TagManager;