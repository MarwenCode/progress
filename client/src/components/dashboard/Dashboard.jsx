import React from "react";
import { FaRocket, FaTrophy, FaWater } from "react-icons/fa"; // Playful icons
import { motion } from "framer-motion"; // For animations
import "./dashboard.scss";
import Cards from "../cards/Cards";
import { useNavigate } from "react-router-dom"; // Correct hook import

const Dashboard = () => {
  const navigate = useNavigate(); // Use the correct hook for navigation

  // Sample goals data
  const goals = [
    { id: 1, title: "Complete 5 tasks today", progress: 75, type: "daily" },
    {
      id: 2,
      title: "Exercise 3 times this week",
      progress: 40,
      type: "weekly",
    },
    {
      id: 3,
      title: "Drink 2 liters of water today",
      progress: 60,
      type: "daily",
    },
    { id: 4, title: "Read 4 chapters this week", progress: 50, type: "weekly" },
    { id: 5, title: "Plan next month’s goals", progress: 30, type: "monthly" },
  ];

  // Filter goals by type
  const dailyGoals = goals.filter((goal) => goal.type === "daily");
  const weeklyGoals = goals.filter((goal) => goal.type === "weekly");
  const monthlyGoals = goals.filter((goal) => goal.type === "monthly");

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to BarBoom!</h1>
        <p>Track your goals and stay on top of your progress.</p>
      </div>

      <Cards />

      <div className="goals">
        {/* Daily Goals */}
        <div
          className="goal-category"
          onClick={() => navigate("/daily")} // Use navigate function for navigation
          style={{ cursor: "pointer" }}>
          <h2>Daily Goals</h2>
          <div className="goal-overview">
            {dailyGoals.map((goal) => (
              <div className="goal-item" key={goal.id}>
                <div className="goal-header">
                  {goal.emoji} {goal.title}
                </div>
                <div
                  className="progress-bar"
                  style={{
                    background: `linear-gradient(to right, #4caf50 ${goal.progress}%, #e0e0e0 ${goal.progress}%)`,
                  }}>
                  <span>{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Goals */}
        <div
          className="goal-category"
          onClick={() => navigate("/weekly")} // Use navigate function for navigation
          style={{ cursor: "pointer" }}>
          <h2>Weekly Goals</h2>
          <div className="goal-overview">
            {weeklyGoals.map((goal) => (
              <div className="goal-item" key={goal.id}>
                <div className="goal-header">
                  {goal.emoji} {goal.title}
                </div>
                <div
                  className="progress-bar"
                  style={{
                    background: `linear-gradient(to right, #4caf50 ${goal.progress}%, #e0e0e0 ${goal.progress}%)`,
                  }}>
                  <span>{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Goals */}
        <div
          className="goal-category"
          onClick={() => navigate("/monthly")} // Use navigate function for navigation
          style={{ cursor: "pointer" }}>
          <h2>Monthly Goals</h2>
          <div className="goal-overview">
            {monthlyGoals.map((goal) => (
              <div className="goal-item" key={goal.id}>
                <div className="goal-header">
                  {goal.emoji} {goal.title}
                </div>
                <div
                  className="progress-bar"
                  style={{
                    background: `linear-gradient(to right, #4caf50 ${goal.progress}%, #e0e0e0 ${goal.progress}%)`,
                  }}>
                  <span>{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


// Example of a goal item component
// const GoalItem = ({ goalTitle, progress, goalType }) => {
//   let icon;
//   switch (goalType) {
//     case 'exercise':
//       icon = <FaRocket />;
//       break;
//     case 'study':
//       icon = <FaTrophy />;
//       break;
//     case 'hydration':
//       icon = <FaWater />;
//       break;
//     default:
//       icon = <FaRocket />;
//   }

//   return (
//     <div className="goal-item">
//       <div className="goal-header">
//         <div className="goal-icon">{icon}</div>
//         <h3>{goalTitle}</h3>
//       </div>
//       <motion.div
//         className="progress-bar"
//         style={{
//           width: `${progress}%`,
//           backgroundColor: progress < 50 ? '#FF5733' : '#4CAF50',
//         }}
//         whileHover={{ scale: 1.1 }}
//       >
//         <span>{progress}%</span>
//       </motion.div>
//     </div>
//   );
// };
