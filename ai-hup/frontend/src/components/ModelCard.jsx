import React from "react";
import { useNavigate } from "react-router-dom";

function ModelCard({id,name,provider,description,tags,accuracy,showAccuracy}){
    const navigate = useNavigate();

    const goToDetails = () => navigate(`/models/${id}`);

    return(
        <div className="card" onClick={goToDetails} role="button" tabIndex={0}>
            <h3>{name}</h3>
            <p><strong>Provider:</strong>{provider}</p>
            <p>{description}</p>
        <div>
        {tags.map((tag,index) => (
            <span key={index}>#{tag}</span>
        ))}
        </div>

        {tags.length > 0 && (
            <p className="use-line">Use: {tags.join(", ")}</p>
        )}

        {showAccuracy && accuracy !== undefined && (
            <p className="accuracy-badge">Accuracy: {accuracy}%</p>
        )}

        <div className="card-actions">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate("/compare", { state: { preselectId: id } });
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
        </div>
        </div>


    );
}
export default ModelCard;