
function CapabilitiesList({ model }) {
  return (
    <div>
      <h3>Capabilities</h3>

      <ul>
        {model.capabilities.map((cap, i) => (
          <li key={i}>{cap}</li>
        ))}
      </ul>
    </div>
  )
}

export default CapabilitiesList