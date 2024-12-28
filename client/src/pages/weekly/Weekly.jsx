import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createWeeklyGoal, getWeeklyGoal } from "../../redux/weeklySlice/weeklySlice";
import "./weekly.scss";

// ProgressBar Component remains the same
const ProgressBar = ({ progress }) => (
  <div className="progress-bar-container">
    <label>Weekly Progress:</label>
    <input
      type="range"
      min="0"
      max="100"
      value={progress}
      disabled
      className="progress-bar"
    />
    <div className="progress-label">Progress: {Math.round(progress)}%</div>
  </div>
);

// DaysSelector Component remains the same
const DaysSelector = ({ selectedDays, onToggleDay }) => (
  <div className="day-selector-container">
    <label>Days Selected:</label>
    <div className="day-selector">
      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
        <label key={day}>
          <input
            type="checkbox"
            checked={selectedDays.includes(day)}
            onChange={() => onToggleDay(day)}
          />
          {day}
        </label>
      ))}
    </div>
  </div>
);

// Weekly Component with Redux integration
const Weekly = () => {
  const dispatch = useDispatch();
  const { weeklyGoal = [], loading = false, error = null } = useSelector((state) => state.weekly || {});

  const [goalName, setGoalName] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [goalDetails, setGoalDetails] = useState("");
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState({});
  const [editingDay, setEditingDay] = useState(null);
  const [currentGoal, setCurrentGoal] = useState(null);

  // Fetch weekly goals when component mounts
  useEffect(() => {
    dispatch(getWeeklyGoal());
  }, [dispatch]);

  // Update local state when weeklyGoal changes
  useEffect(() => {
    if (weeklyGoal && weeklyGoal.length > 0) {
      const latestGoal = weeklyGoal[weeklyGoal.length - 1];
      setCurrentGoal(latestGoal);
      setGoalName(latestGoal.name || "");
      setSelectedDays(latestGoal.selectedDays || []);
      setGoalDetails(latestGoal.details || "");
      setNotes(latestGoal.notes || {});
      
      // Calculate initial progress based on selected days
      const initialProgress = ((latestGoal.selectedDays?.length || 0) / 7) * 100;
      setProgress(initialProgress);
    }
  }, [weeklyGoal]);

  // Update progress whenever selected days change
  useEffect(() => {
    const progressPercentage = (selectedDays.length / 7) * 100;
    setProgress(progressPercentage);
  }, [selectedDays]);

  const handleDayToggle = (day) => {
    setSelectedDays((prev) => {
      const newSelectedDays = prev.includes(day) 
        ? prev.filter((d) => d !== day) 
        : [...prev, day];
      
      // Update progress immediately after toggling day
      const newProgress = (newSelectedDays.length / 7) * 100;
      setProgress(newProgress);
      
      return newSelectedDays;
    });
  };

  const handleNoteChange = (day, note) => {
    setNotes((prev) => ({ ...prev, [day]: note }));
  };

  const handleNoteEditToggle = (day) => {
    setEditingDay((prev) => (prev === day ? null : day));
  };

  const handleSubmitGoal = async () => {
    const goalData = {
      name: goalName,
      selectedDays,
      details: goalDetails,
      notes,
      progress: (selectedDays.length / 7) * 100
    };

    try {
      await dispatch(createWeeklyGoal(goalData)).unwrap();
      setShowModal(false);
      // Refresh the goals list
      dispatch(getWeeklyGoal());
    } catch (err) {
      console.error("Failed to create goal:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="weekly-container">
      <h2>Weekly Goal Tracker</h2>

      {currentGoal && (
        <div className="current-goal-info">
          <h3>Current Goal: {currentGoal.name}</h3>
          <p>Details: {currentGoal.details}</p>
          <p>Created: {new Date(currentGoal.createdAt).toLocaleDateString()}</p>
        </div>
      )}

      <ProgressBar progress={progress} />
      <DaysSelector selectedDays={selectedDays} onToggleDay={handleDayToggle} />

      {showModal ? (
        <div className="modal">
          <div className="modal-content">
            <h3>Set Your Weekly Goal</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="goalName">Goal Name:</label>
                <input
                  type="text"
                  id="goalName"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g., Exercise 3 times this week"
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
              <button
                type="button"
                className="submit-btn"
                onClick={handleSubmitGoal}
              >
                Save Goal
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button className="add-goal-btn" onClick={() => setShowModal(true)}>
          Add Weekly Goal
        </button>
      )}

      <div className="goal-table-container">
        <h3>Weekly Goal Table</h3>
        <table className="goal-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Note</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <tr key={day}>
                <td>{day}</td>
                <td>
                  <div className="note-container">
                    {editingDay === day ? (
                      <input
                        type="text"
                        value={notes[day] || ""}
                        onChange={(e) => handleNoteChange(day, e.target.value)}
                        onBlur={() => handleNoteEditToggle(day)}
                      />
                    ) : (
                      <span onClick={() => handleNoteEditToggle(day)}>
                        {notes[day] || "Click to add a note"}
                      </span>
                    )}
                    <button
                      className="edit-btn"
                      onClick={() => handleNoteEditToggle(day)}
                    >
                      ✏️
                    </button>
                  </div>
                </td>
                <td>
                  {selectedDays.includes(day) ? "Selected" : "Not Selected"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {weeklyGoal.length > 0 && (
        <div className="goal-history">
          <h3>Goal History</h3>
          <ul>
            {weeklyGoal.map((goal) => (
              <li key={goal._id}>
                <strong>{goal.name}</strong> - Created: {new Date(goal.createdAt).toLocaleDateString()}
                <p>{goal.details}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Weekly;