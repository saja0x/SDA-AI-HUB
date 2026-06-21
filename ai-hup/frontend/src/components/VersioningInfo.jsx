// =========================
// Model Version Info Component
// =========================

function VersioningInfo({ model }) {
  return (
    <div>
      <h3>Version Info</h3>

      {/* Basic version data */}
      <p>Model: {model.name}</p>
      <p>Release: {model.release}</p>
    </div>
  )
}

export default VersioningInfo