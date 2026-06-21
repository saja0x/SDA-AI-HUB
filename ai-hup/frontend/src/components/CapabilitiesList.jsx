// =========================
// Shows model capabilities
// =========================

function CapabilitiesList({ model }) {
  return (
    <div>
      <h3>Capabilities</h3>

      {/* List all capabilities */}
      <ul>
        {model.capabilities.map((cap, i) => (
          <li key={i}>{cap}</li>
        ))}
      </ul>
    </div>
  )
}

export default CapabilitiesList