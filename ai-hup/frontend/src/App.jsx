import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import AuthProvider from './AuthContext.jsx';
import RequireAuth from './components/RequireAuth.jsx';
 
// صفحات الطالبة الأولى
import HomePage from './Pages/HomePage.jsx';
import ModelsPage from './Pages/ModelsPage.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';
import SignupPage from './Pages/SignupPage.jsx';
 
// صفحات الطالبة الثانية
import ModelDetailPage from './Pages/ModelDetailPage.jsx';
import ComparisonPage from './Pages/ComparisonPage.jsx';
 
// صفحاتك (الطالبة الثالثة)
import PlaygroundPage from './Pages/PlaygroundPage.jsx';
import ChatbotPage from './Pages/ChatbotPage.jsx';
import ModelForm from './components/ModelForm.jsx';
import BenchmarkPage from './Pages/BenchmarkPage.jsx';
 
// تغيير: شلنا fetch("/models") من هنا - كان غير مستخدم فعليًا غير لتمرير
// prop "models" لـ AdminDashboard، وAdminDashboard الحين تجيب بياناتها بنفسها
// من /admin/models (اللي يرجع كل الموديلات حتى المخفية، ومحمي بتسجيل دخول أدمن).
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
 
          {/* تغيير: /admin و /create الحين محميين بـ adminOnly - يعني
              غير مسموح إلا لمستخدم مسجل دخول ودوره "admin" فعليًا */}
          <Route
            path="/admin"
            element={
              <RequireAuth adminOnly>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/create"
            element={
              <RequireAuth adminOnly>
                <ModelForm />
              </RequireAuth>
            }
          />
 
          <Route path="/models/:id" element={<ModelDetailPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
 
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/benchmark" element={<BenchmarkPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
 
export default App;