import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
 
function HomePage() {
    return (
        <div className="hero-wrap">
            <section className="hero">
                <div className="hero-art" aria-hidden="true">
                    <svg viewBox="0 0 400 220" className="hero-svg">
                        <defs>
                            <radialGradient id="heroFlare" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                            </radialGradient>
                            <linearGradient id="facetA" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.1" />
                            </linearGradient>
                            <linearGradient id="facetB" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
                            </linearGradient>
                        </defs>
 
                        <circle cx="55" cy="110" r="14" fill="url(#heroFlare)" />
                        <circle cx="55" cy="110" r="3.5" fill="#ffffff" />
                        <line x1="60" y1="110" x2="160" y2="110" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
 
                        <path d="M200,55 L160,165 L200,165 Z" fill="url(#facetA)" />
                        <path d="M200,55 L200,165 L240,165 Z" fill="url(#facetB)" />
                        <path d="M200,55 L160,165 L240,165 Z" fill="none" stroke="#c084fc" strokeWidth="1" opacity="0.6" />
 
                        <line x1="222" y1="110" x2="320" y2="50" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="222" y1="110" x2="340" y2="110" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="222" y1="110" x2="320" y2="170" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
 
                        <circle cx="320" cy="50" r="5" fill="#a855f7" />
                        <circle cx="340" cy="110" r="5" fill="#ec4899" />
                        <circle cx="320" cy="170" r="5" fill="#38bdf8" />
                    </svg>
                </div>
 
                <h1 className="hero-title">Lumia</h1>
                <p className="hero-tagline">One hub, every model.</p>
                <p className="hero-lede">
                    Lumia brings every major AI model into one place. Compare capabilities
                    side by side, chat in a live playground, and get matched to the model
                    that actually fits what you're building.
                </p>
 
                <div className="hero-ctas">
                    <Link to="/models" className="btn-hero-primary">Explore models</Link>
                    <Link to="/playground" className="btn-hero-secondary">Open playground</Link>
                </div>
            </section>
 
            <section className="hero-features">
                <Link to="/compare" className="hero-feature hero-feature--violet">
                    <span className="hero-feature-dot" />
                    <h3>Compare side by side</h3>
                    <p>Put up to four models head-to-head on accuracy, latency, context window, and price.</p>
                </Link>
 
                <Link to="/playground" className="hero-feature hero-feature--magenta">
                    <span className="hero-feature-dot" />
                    <h3>Chat in the playground</h3>
                    <p>Talk to GPT, Claude, Gemini, and more in real time, no separate accounts needed.</p>
                </Link>
 
                <Link to="/chatbot" className="hero-feature hero-feature--cyan">
                    <span className="hero-feature-dot" />
                    <h3>Get matched automatically</h3>
                    <p>Describe what you're building. The recommender points you to the model that fits.</p>
                </Link>
            </section>
        </div>
    );
}
 
export default HomePage;