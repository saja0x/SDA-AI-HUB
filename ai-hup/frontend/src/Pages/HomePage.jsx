import ModelCard from "../components/ModelCard";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import Pagination from "../components/Pagination";
import React, { useState, useEffect } from "react";
import "../App.css";

const MODELS_PER_PAGE = 6;

function HomePage() {
    const [allModels, setAllModels] = useState([]);
    const [search, setSearch] = useState("");
    const [provider, setProvider] = useState("");
    const [type, setType] = useState("");
    const [pricing, setPricing] = useState("");
    const [showAccuracy, setShowAccuracy] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/models")
            .then((res) => res.json())
            .then((data) => setAllModels(data))
            .catch((err) => console.log("API Error:", err));
    }, []);

    const filtered = allModels.filter((m) => {
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
        const matchesProvider = provider === "" || m.provider === provider;
        const matchesType = type === "" || m.type === type;
        const matchesPricing = pricing === "" || m.pricing === pricing;
        return matchesSearch && matchesProvider && matchesType && matchesPricing;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / MODELS_PER_PAGE));
    const paginated = filtered.slice(
        (currentPage - 1) * MODELS_PER_PAGE,
        currentPage * MODELS_PER_PAGE
    );

    return (
        <div className="container">
            <h1>AI MODEL HUB</h1>
            <SearchBar search={search} setSearch={setSearch} />
            <FilterPanel
                provider={provider} setProvider={setProvider}
                type={type} setType={setType}
                pricing={pricing} setPricing={setPricing}
                showAccuracy={showAccuracy} setShowAccuracy={setShowAccuracy}
            />
            <div className="cards">
                {paginated.map((model) => (
                    <ModelCard
                        key={model.id}
                        id={model.id}
                        name={model.name}
                        provider={model.provider}
                        description={model.description}
                        tags={model.tags || []}
                        accuracy={model.accuracy}
                        showAccuracy={showAccuracy}
                    />
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}
export default HomePage;