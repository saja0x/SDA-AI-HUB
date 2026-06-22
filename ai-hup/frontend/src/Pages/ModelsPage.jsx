import ModelCard from "../components/ModelCard";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import Pagination from "../components/Pagination";
import React, { useState, useEffect } from "react";
import "../App.css";
import { apiRequest } from "../api.js";

const MODELS_PER_PAGE = 6;

function ModelsPage() {
    const [allModels, setAllModels] = useState([]);
    const [search, setSearch] = useState("");
    const [provider, setProvider] = useState("");
    const [type, setType] = useState("");
    const [pricing, setPricing] = useState("");
    const [modality, setModality] = useState("");
    const [openSource, setOpenSource] = useState("");
    const [useCase, setUseCase] = useState("");
    const [minContext, setMinContext] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [showAccuracy, setShowAccuracy] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        apiRequest("/models")
            .then((data) => setAllModels(data))
            .catch((err) => console.log("API Error:", err));
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, provider, type, pricing, modality, openSource, useCase, minContext, sortBy]);

    let filtered = allModels.filter((m) => {
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
        const matchesProvider = provider === "" || m.provider === provider;
        const matchesType = type === "" || m.type === type;
        const matchesPricing = pricing === "" || m.pricing === pricing;
        const matchesModality = modality === "" || (m.modality || []).includes(modality);
        const matchesOpenSource =
            openSource === "" ||
            (openSource === "open" && m.open_source) ||
            (openSource === "proprietary" && !m.open_source);
        const matchesUseCase =
            useCase === "" ||
            (m.use_cases || []).some((uc) => uc.toLowerCase().includes(useCase.toLowerCase()));
        const matchesContext = minContext === "" || (m.context_window || 0) >= Number(minContext);

        return (
            matchesSearch && matchesProvider && matchesType && matchesPricing &&
            matchesModality && matchesOpenSource && matchesUseCase && matchesContext
        );
    });

    if (sortBy === "accuracy-desc") {
        filtered = [...filtered].sort((a, b) => (b.accuracy || 0) - (a.accuracy || 0));
    } else if (sortBy === "latency-asc") {
        filtered = [...filtered].sort((a, b) => (a.latency || 0) - (b.latency || 0));
    } else if (sortBy === "name-asc") {
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "context-desc") {
        filtered = [...filtered].sort((a, b) => (b.context_window || 0) - (a.context_window || 0));
    }

    const totalPages = Math.max(1, Math.ceil(filtered.length / MODELS_PER_PAGE));
    const paginated = filtered.slice(
        (currentPage - 1) * MODELS_PER_PAGE,
        currentPage * MODELS_PER_PAGE
    );

    return (
        <div className="container">
            <h1>Browse models</h1>
            <SearchBar search={search} setSearch={setSearch} />
            <FilterPanel
                provider={provider} setProvider={setProvider}
                type={type} setType={setType}
                pricing={pricing} setPricing={setPricing}
                modality={modality} setModality={setModality}
                openSource={openSource} setOpenSource={setOpenSource}
                useCase={useCase} setUseCase={setUseCase}
                minContext={minContext} setMinContext={setMinContext}
                sortBy={sortBy} setSortBy={setSortBy}
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
export default ModelsPage;