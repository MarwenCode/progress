import React from "react";
import { FaRocket, FaTrophy, FaWater } from "react-icons/fa";
import { motion } from "framer-motion"; 
import "./dashboard.scss";
import Cards from "../cards/Cards";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

 

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to BarBoom!</h1>
        <p>Track your goals and stay on top of your progress.</p>
      </div>

      <Cards />

  
    </div>
  );
};

export default Dashboard;

