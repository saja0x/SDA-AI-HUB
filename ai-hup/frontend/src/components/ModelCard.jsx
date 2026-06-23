import React from "react";
import { useNavigate } from "react-router-dom";
import { SiOpenai, SiGooglegemini, SiAnthropic } from "react-icons/si";

function ModelCard({
    id = "",
    name = "AI Model",
    provider = "",
    description = "",
    tags = [],
    accuracy,
    showAccuracy
}) {
    const navigate = useNavigate();

    const safeTags = Array.isArray(tags) ? tags : [];

    const getProviderIcon = (provider) => {
        if (provider === "OpenAI") return <SiOpenai color="#10a37f" />;
        if (provider === "Google") return <SiGooglegemini color="#4285F4" />;
        if (provider === "Anthropic") return <SiAnthropic color="#6c5ce7" />;
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
        <div className="card" onClick={goToDetails} role="button" tabIndex={0}>

            <h3>
                {getProviderIcon(provider)} {name}
            </h3>

            <p>
                <strong>Provider:</strong> {getProviderIcon(provider)} {provider}
            </p>

            <p>{description}</p>

            <div>
                {safeTags.map((tag, index) => (
                    <span key={index}>#{tag}</span>
                ))}
            </div>

            {safeTags.length > 0 && (
                <p className="use-line">
                    Use: {safeTags.join(", ")}
                </p>
            )}

            {showAccuracy && accuracy !== undefined && (
                <p className="accuracy-badge">
                    Accuracy: {accuracy}%
                </p>
            )}

            <div className="card-actions">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (id) navigate("/compare", { state: { preselectId: id } });
                    }}
                >
                    Compare
                </button>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        goToDetails();
                    }}
                >
                    Details
                </button>

                <button
                    type="button"
                    onClick={goToPlayground}
                    style={{
                        background: "var(--grad-primary)",
                        color: "#fff",
                        border: "none"
                    }}
                >
                    Try ▶
                </button>
            </div>

        </div>
    );
}

export default ModelCard;