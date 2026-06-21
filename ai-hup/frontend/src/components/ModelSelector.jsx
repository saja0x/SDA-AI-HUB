function ModelSelector({ selected, setSelected, allModels }) {
  function toggle(model) {
    const exists = selected.find((m) => m.id === model.id);

    if (exists) {
      setSelected(selected.filter((m) => m.id !== model.id));
    } else {
      setSelected([...selected, model]);
    }
  }

  return (
    <div>
      <p className="selector-hint">
        Click a model to add it to the comparison ({selected.length} selected)
      </p>
      {allModels.map((model) => {
        const isSelected = selected.some((m) => m.id === model.id);
        return (
          <div
            key={model.id}
            onClick={() => toggle(model)}
            className={isSelected ? "selector-row selector-row-active" : "selector-row"}
          >
            <h3>{model.name}</h3>
            {isSelected && <span className="selector-check">✓ Selected</span>}
          </div>
        );
      })}
    </div>
  );
}

export default ModelSelector;