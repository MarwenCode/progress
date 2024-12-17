import React, { useState } from 'react';


const Monthly = () => {
  const [goalName, setGoalName] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [goalDetails, setGoalDetails] = useState('');

  const handleDayToggle = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the goal submission logic for the month
    console.log('Monthly Goal:', goalName, selectedDays, goalDetails);
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
          <label>Select Days for Your Goal:</label>
          <div className="day-selector">
            {[...Array(31).keys()].map((day) => (
              <label key={day}>
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day + 1)}
                  onChange={() => handleDayToggle(day + 1)}
                />
                {day + 1}
              </label>
            ))}
          </div>
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
