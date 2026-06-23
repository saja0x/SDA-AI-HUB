import React, { useState } from "react";
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

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

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

            <div className="rating-box">
                <p>Rate this model:</p>

                <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            style={{
                                cursor: "pointer",
                                fontSize: "20px",
                                color:
                                    star <= (hover || rating)
                                        ? "#f5b301"
                                        : "#ccc"
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setRating(star);
                            }}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                {rating > 0 && (
                    <p style={{ fontSize: "12px", color: "gray" }}>
                        Your rating: {rating} / 5
                    </p>
                )}
            </div>

          
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