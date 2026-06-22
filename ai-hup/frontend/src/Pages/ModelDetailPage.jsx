import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CapabilitiesList from "../components/CapabilitiesList";
import VersioningInfo from "../components/VersioningInfo";
import SamplePrompts from "../components/SamplePrompts";

// تغييرات مهمة:
// 1) الصفحة الحين تقرا من قاعدة البيانات الحقيقية (الباكند صار يرجع
//    {model, versions} بدل بيانات الملف الثابت القديم)
// 2) ضفنا عرض Modalities وUse cases وTags - موجودين بقاعدة البيانات
//    من زمان بس ما كانوا يُعرضون
// 3) SamplePrompts الحين تاخذ بيانات الموديل الحقيقية، مو 3 جمل ثابتة
// 4) تغيير جديد: زر "Try in Playground" يوديك مباشرة للبلاي قراوند
//    مع تحديد هذا الموديل تلقائيًا (بدون ما تدورين عليه بالقائمة)
function ModelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>{model.name}</h1>
        {/* زر "Try in Playground" - يمرر اسم الموديل عشان يتحدد تلقائيًا */}
        <button
          onClick={() => navigate('/playground', { state: { preselect: model.name } })}
          style={{
            background: "var(--grad-primary)",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "var(--radius-pill)",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Try in Playground ▶
        </button>
      </div>

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