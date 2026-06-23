import React from "react";
import { useNavigate } from "react-router-dom";
import { SiOpenai, SiGooglegemini, SiAnthropic, SiMeta } from "react-icons/si";

function ModelCard({
    id = "",
    name = "AI Model",
    provider = "",
    description = "",
    tags = [],
    accuracy,
    latency,
    showAccuracy
}) {
    const navigate = useNavigate();

    const safeTags = Array.isArray(tags) ? tags : [];

    const getProviderIcon = (name) => {
        if (name.toLowerCase().includes("gpt")) return <SiOpenai color="#10a37f" />;
        if (name.toLowerCase().includes("claude")) return <SiAnthropic color="#6c5ce7" />;
        if (name.toLowerCase().includes("gemini")) return <SiGooglegemini color="#4285F4" />;
        if (name.toLowerCase().includes("llama")) return <SiMeta color="#1f78ff" />;
        return "🤖";
    };

    const goToDetails = () => {
        if (id) navigate(`/models/${id}`);
    };

    const goToPlayground = (e) => {
        e.stopPropagation();
        navigate("/playground", { state: { preselect: name } });
    };

    return (
        <div className="card" onClick={goToDetails}>

            <h3>
                {getProviderIcon(name)} {name}
            </h3>

            <p>
                <strong>Provider:</strong> {provider}
            </p>

            <p>Accuracy: {accuracy}%</p>
            <p>Latency: {latency}</p>

            <div>
                {safeTags.map((tag, index) => (
                    <span key={index}>#{tag}</span>
                ))}
            </div>

            {/* ❌ Removed rating section completely */}

            <div className="card-actions">
                <button onClick={(e) => { e.stopPropagation(); navigate("/compare", { state: { preselectId: id } }); }}>
                    Compare
                </button>

                <button onClick={(e) => { e.stopPropagation(); goToDetails(); }}>
                    Details
                </button>

                <button onClick={goToPlayground}>
                    Try ▶
                </button>
            </div>

        </div>
    );
}

export default ModelCard;