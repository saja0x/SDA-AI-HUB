import { useState } from "react";
import React from "react";
import { useNavigate, Link } from "react-router-dom";

// صفحة إنشاء حساب جديد - تتصل بـ /register الموجود مسبقًا بالباك اند (بدون تعديل عليه)
function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accountType, setAccountType] = useState("user");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        fetch(`http://127.0.0.1:8000/register?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
            method: "POST",
        })
            .then((res) => res.json())
            .then(() => {
                setSuccess(true);
                setTimeout(() => navigate("/login"), 1200);
            })
            .catch(() => setError("تعذر إنشاء الحساب، حاولي مرة ثانية"));
    };

    return (
        <div className="login-container">
            <h1>Create Account</h1>
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
                    placeholder="Enter your password (min 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                />

                {/* نوع الحساب: حاليًا للعرض فقط لأن /register بالباك اند يستقبل
                    email و password بس. لو احتجتوه يُحفظ فعليًا لازم تضاف
                    معامل role لراوتر auth.py وللخدمة auth_service.py */}
                <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                >
                    <option value="user">Regular User</option>
                    <option value="admin">Admin</option>
                </select>

                {error && <p className="form-error">{error}</p>}
                {success && <p className="form-success">Account created! Redirecting to login…</p>}

                <button type="submit">Sign Up</button>
            </form>
            <p className="auth-switch">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default SignupPage;