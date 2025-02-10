import React, { useState, useEffect } from "react";
import "./monthly.scss"; // Import du fichier SCSS

const Monthly = () => {
  const [goalName, setGoalName] = useState("");
  const [goalDetails, setGoalDetails] = useState("");

  // Charger les données sauvegardées au montage
  useEffect(() => {
    const savedGoal = JSON.parse(localStorage.getItem("monthlyGoal"));
    if (savedGoal) {
      setGoalName(savedGoal.name || "");
      setGoalDetails(savedGoal.details || "");
    }
  }, []);

  // Sauvegarder les données à chaque mise à jour
  useEffect(() => {
    localStorage.setItem(
      "monthlyGoal",
      JSON.stringify({ name: goalName, details: goalDetails })
    );
  }, [goalName, goalDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Monthly Goal:", goalName, goalDetails);
  };

  return (
    <div className="monthly-container">
      <h2>Set Your Monthly Goal</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="goalName">Goal Name:</label>
          <input
            type="text"
            id="goalName"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            placeholder="e.g., Read 5 books this month"
          />
        </div>

        <div className="form-group">
          <label htmlFor="goalDetails">Goal Details:</label>
          <textarea
            id="goalDetails"
            value={goalDetails}
            onChange={(e) => setGoalDetails(e.target.value)}
            placeholder="Details about your goal"
          />
        </div>

        <button type="submit" className="submit-btn">Submit Goal</button>
      </form>
    </div>
  );
};

export default Monthly;
