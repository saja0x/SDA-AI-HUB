import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CapabilitiesList from "../components/CapabilitiesList";
import VersioningInfo from "../components/VersioningInfo";
import SamplePrompts from "../components/SamplePrompts";

function ModelDetailPage() {
  const { id } = useParams();
  const [model, setModel] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/models/${id}`)
      .then((res) => res.json())
      .then((data) => setModel(data.model || data))
      .catch((err) => console.log("API Error:", err));
  }, [id]);

  if (!model) return <div>Loading...</div>;

  return (
    <div className="model-detail">
      <h1>{model.name}</h1>
      <p><strong>Provider:</strong> {model.provider}</p>
      <p><strong>Description:</strong> {model.description}</p>
      <p><strong>Type:</strong> {model.type}</p>
      <p><strong>Context Length:</strong> {model.context_window}</p>
      <p><strong>Pricing:</strong> {model.pricing}</p>
      <p><strong>Limitations:</strong> {model.limitations}</p>

      {model.capabilities && (
        <CapabilitiesList model={{ ...model, capabilities: model.capabilities.split(', ') }} />
      )}

      <VersioningInfo model={{ name: model.name, release: model.release_date }} />

      <SamplePrompts />
    </div>
  );
}

export default ModelDetailPage;