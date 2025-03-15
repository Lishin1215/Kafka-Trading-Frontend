import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TradePage from "./pages/TradePage";
import HistoryPage from "./pages/HistoryPage";
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TradePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/trade" element={<TradePage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>

  );
}

export default App;
