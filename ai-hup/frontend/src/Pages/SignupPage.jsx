import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";
 
// قائمة اختيار الدور (Role) موجودة هنا عشان نقدر نسوي حسابي أدمن وuser
// ونجرب صلاحيات لوحة التحكم بسهولة وقت العرض - نفس فكرة ملف الأستاذ
// بالضبط. بمشروع حقيقي السيرفر هو اللي يحدد الدور، مو المستخدم نفسه
// وقت التسجيل (وإلا أي حد يقدر يخلي نفسه أدمن).
function SignupPage() {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [error, setError] = useState("");
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
 
        try {
            // register() تسجل دخول تلقائيًا بعد التسجيل (شوفي AuthContext)
            await register(email, password, role);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
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
                    placeholder="Enter your password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                />
 
                <label className="role-select">
                    Role
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                    </select>
                </label>
 
                {error && <p className="form-error">{error}</p>}
 
                <button type="submit">Sign Up</button>
            </form>
            <p className="auth-switch">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}
 
export default SignupPage;