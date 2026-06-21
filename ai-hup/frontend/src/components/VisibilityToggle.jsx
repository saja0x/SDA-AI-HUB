import React from "react";

function VisibilityToggle({
  visible,
  setVisible,
}) {
  return (
    <label>
      <input
        type="checkbox"
        checked={visible}
        onChange={() =>
          setVisible(!visible)
        }
      />
      {visible ? "Visible" : "Hidden"}
    </label>
  );
}

export default VisibilityToggle;