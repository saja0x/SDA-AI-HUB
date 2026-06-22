import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import AuthProvider from './AuthContext.jsx';
import RequireAuth from './components/RequireAuth.jsx';

import HomePage from './Pages/HomePage.jsx';
import ModelsPage from './Pages/ModelsPage.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';
import SignupPage from './Pages/SignupPage.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';

import ModelDetailPage from './Pages/ModelDetailPage.jsx';
import ComparisonPage from './Pages/ComparisonPage.jsx';

import PlaygroundPage from './Pages/PlaygroundPage.jsx';
import ChatbotPage from './Pages/ChatbotPage.jsx';
import ModelForm from './components/ModelForm.jsx';
import BenchmarkPage from './Pages/BenchmarkPage.jsx';

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

          <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />

          {/* تغيير: البلاي قراوند صار محميًا بتسجيل دخول - ضروري عشان
              نعرف مين المستخدم ونطبق الليمت على حسابه */}
          <Route path="/playground" element={<RequireAuth><PlaygroundPage /></RequireAuth>} />

          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/benchmark" element={<BenchmarkPage />} />

          <Route path="/admin" element={<RequireAuth adminOnly><AdminDashboard /></RequireAuth>} />
          <Route path="/create" element={<RequireAuth adminOnly><ModelForm /></RequireAuth>} />

          <Route path="/models/:id" element={<ModelDetailPage />} />
          <Route path="/compare" element={<ComparisonPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;