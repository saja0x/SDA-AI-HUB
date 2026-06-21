import { useState, useContext } from "react";
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";

function LoginPage(){
    const[email,setEmail]=useState("");
    const[password,setPassworsd]=useState("");
    const[error,setError]=useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        fetch(`http://127.0.0.1:8000/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => {
                login({ email, token: data.token });
                navigate("/admin");
            })
            .catch(() => setError("تعذر تسجيل الدخول، حاولي مرة ثانية"));
    };

    return(
        <div className="login-container">
            <h1>Login</h1>
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
                onChange={(e) => setPassworsd(e.target.value)}
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