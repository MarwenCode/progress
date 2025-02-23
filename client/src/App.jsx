import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import Daily from "./pages/daily/Daily";
import Weekly from "./pages/weekly/Weekly";
import Monthly from "./pages/monthly/Monthly";
import Navbar from "./components/navbar/Navbar";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";


function App() {
  return (
    <Router>
      <div className="container">
      <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="/weekly" element={<Weekly />} />
          <Route path="/monthly" element={<Monthly />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
