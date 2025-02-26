import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";

import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import Daily from "./pages/daily/Daily";
import Weekly from "./pages/weekly/Weekly";
import Monthly from "./pages/monthly/Monthly";
import Navbar from "./components/navbar/Navbar";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";

function App() {
  const token = useSelector((state) => state.user.token); // Récupérer le token depuis Redux
  const isAuthenticated = !!token; // Vérifier si l'utilisateur est connecté

  return (
    <Router>
      <div className="container">
        <Navbar />
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/weekly" element={<Weekly />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
