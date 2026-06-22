import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";
import LumiaMascot from "../assets/Lumia-mascot.png";

function LoginPage() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "16px" }}>
                <img
                    src={LumiaMascot}
                    alt="Lumia"
                    style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "8px" }}
                />
            </div>
            <h1>Login To Lumia</h1>
            
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="form-error">{error}</p>}
                <button type="submit">Login</button>
            </form>
            <p className="auth-switch">
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
}

export default LoginPage;