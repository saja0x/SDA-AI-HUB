import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";
import LumiaMascot from "../assets/Lumia-mascot.png";
 
// تغيير أمني: شلنا خيار اختيار الدور (Role) من واجهة التسجيل.
// قبل كذا أي حد يقدر يختار "admin" من القائمة — هذا خطر أمني حقيقي.
// الحين كل حساب جديد يصير "user" تلقائياً بدون أي خيار.
// الأدمن يُضاف من التيرمنل مباشرة بـ: python create_admin.py
function SignupPage() {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            // الدور "user" ثابت — ما يجي من المستخدم
            await register(email, password, "user");
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