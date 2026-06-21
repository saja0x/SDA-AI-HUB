// =========================
// Comparison Table Component
// Shows differences between selected models
// =========================

function ComparisonTable({ selected }) {
  return (
    <div>
      <h2>Comparison Table</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Feature</th>

            {/* Dynamic columns for each selected model */}
            {selected.map((m) => (
              <th key={m.id}>{m.name}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Provider</td>
            {selected.map((m) => (
              <td key={m.id}>{m.provider}</td>
            ))}
          </tr>

          <tr>
            <td>Modality</td>
            {selected.map((m) => (
              <td key={m.id}>
                {Array.isArray(m.modality) ? m.modality.join(", ") : m.modality}
              </td>
            ))}
          </tr>

          <tr>
            <td>Context Window</td>
            {selected.map((m) => (
              <td key={m.id}>{m.context_window}</td>
            ))}
          </tr>

          <tr>
            <td>Pricing</td>
            {selected.map((m) => (
              <td key={m.id}>{m.pricing}</td>
            ))}
          </tr>

          <tr>
            <td>Latency</td>
            {selected.map((m) => (
              <td key={m.id}>{m.latency}</td>
            ))}
          </tr>

          <tr>
            <td>Accuracy</td>
            {selected.map((m) => (
              <td key={m.id}>{m.accuracy !== undefined ? `${m.accuracy}%` : "-"}</td>
            ))}
          </tr>

          <tr>
            <td>Capabilities</td>
            {selected.map((m) => (
              <td key={m.id}>{m.capabilities}</td>
            ))}
          </tr>

          <tr>
            <td>Limitations</td>
            {selected.map((m) => (
              <td key={m.id}>{m.limitations}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default ComparisonTable