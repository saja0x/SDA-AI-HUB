import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import AuthProvider from './AuthContext.jsx';
import RequireAuth from './components/RequireAuth.jsx';

// صفحات الطالبة الأولى (كما هي بدون تعديل)
import HomePage from './Pages/HomePage.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';
import SignupPage from './Pages/SignupPage.jsx';

// صفحات الطالبة الثانية (كما هي بدون تعديل)
import ModelDetailPage from './Pages/ModelDetailPage.jsx';
import ComparisonPage from './Pages/ComparisonPage.jsx';

// صفحاتك (كما هي بدون تعديل)
import PlaygroundPage from './Pages/PlaygroundPage.jsx';
import ChatbotPage from './Pages/ChatbotPage.jsx';
import ModelForm from './components/ModelForm.jsx';
import BenchmarkPage from './Pages/BenchmarkPage.jsx';

function App() {
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/models")
      .then((res) => res.json())
      .then((data) => setModels(data))
      .catch((err) => console.log("API Error:", err));
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminDashboard models={models} />
              </RequireAuth>
            }
          />

          <Route path="/models/:id" element={<ModelDetailPage />} />
          <Route path="/compare" element={<ComparisonPage />} />

          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/create" element={<ModelForm />} />
          <Route path="/benchmark" element={<BenchmarkPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;