import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CapabilitiesList from "../components/CapabilitiesList";
import VersioningInfo from "../components/VersioningInfo";
import SamplePrompts from "../components/SamplePrompts";
 
// تغييرات مهمة:
// 1) الصفحة الحين تقرا من قاعدة البيانات الحقيقية (الباكند صار يرجع
//    {model, versions} بدل بيانات الملف الثابت القديم)
// 2) ضفنا عرض Modalities وUse cases وTags - موجودين بقاعدة البيانات
//    من زمان بس ما كانوا يُعرضون
// 3) SamplePrompts الحين تاخذ بيانات الموديل الحقيقية، مو 3 جمل ثابتة
function ModelDetailPage() {
  const { id } = useParams();
  const [model, setModel] = useState(null);
  const [versions, setVersions] = useState([]);
 
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/models/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setModel(data.model);
        setVersions(data.versions || []);
      })
      .catch((err) => console.log("API Error:", err));
  }, [id]);
 
  if (!model) return <div>Loading...</div>;
 
  return (
    <div className="model-detail">
      <h1>{model.name}</h1>
      <p><strong>Provider:</strong> {model.provider}</p>
      <p><strong>Description:</strong> {model.description}</p>
      <p><strong>Type:</strong> {model.type}</p>
      <p><strong>Open Source:</strong> {model.open_source ? "Yes" : "No"}</p>
      <p><strong>Modalities:</strong> {(model.modality || []).join(", ") || "—"}</p>
      <p><strong>Context Length:</strong> {model.context_window}</p>
      <p><strong>Pricing:</strong> {model.pricing}</p>
      <p><strong>Limitations:</strong> {model.limitations}</p>
 
      {model.tags && model.tags.length > 0 && (
        <p className="use-line">Tags: {model.tags.map((t) => `#${t}`).join(" ")}</p>
      )}
 
      {model.use_cases && model.use_cases.length > 0 && (
        <p><strong>Use cases:</strong> {model.use_cases.join(", ")}</p>
      )}
 
      {model.capabilities && (
        <CapabilitiesList model={{ ...model, capabilities: model.capabilities.split(', ') }} />
      )}
 
      <VersioningInfo model={{ name: model.name, release: model.release_date, versions }} />
 
      <SamplePrompts prompts={model.sample_prompts} />
    </div>
  );
}
 
export default ModelDetailPage;