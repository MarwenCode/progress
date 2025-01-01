import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  createWeeklyGoal,
  getWeeklyGoal,
  deleteWeeklyGoal,
  updateWeeklyGoal,
  updateNotes,
} from "../../redux/weeklySlice/weeklySlice";
import { RiPencilLine ,RiDeleteBinLine } from "react-icons/ri";
import "./weekly.scss";

// ProgressBar Component
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

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
};

// DaysSelector Component
const DaysSelector = ({ selectedDays, onToggleDay }) => (
  <div className="day-selector-container">
    <label>Days Selected:</label>
    <div className="day-selector">
      {[
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ].map((day) => (
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

// Weekly Component
const Weekly = () => {
  const dispatch = useDispatch();
  const {
    weeklyGoal = [],
    loading = false,
    error = null,
  } = useSelector((state) => state.weekly || {});

  const [goalName, setGoalName] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [goalDetails, setGoalDetails] = useState("");
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState({});
  const [editingDay, setEditingDay] = useState(null);
  const [editedNote, setEditedNote] = useState(""); // Track the edited note

  // Fetch goals on component mount
  useEffect(() => {
    dispatch(getWeeklyGoal());
  }, [dispatch]);

  // Update progress based on selected days
  useEffect(() => {
    const progressPercentage = (selectedDays.length / 7) * 100;
    setProgress(progressPercentage);
  }, [selectedDays]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await dispatch(getWeeklyGoal()).unwrap();
        if (response && response.length > 0) {
          const latestGoal = response[response.length - 1];
          setSelectedDays(latestGoal.selectedDays || []);
          setNotes(latestGoal.notes || {}); // Initialize the notes state
        }
      } catch (err) {
        console.error("Failed to fetch weekly goals:", err);
      }
    };

    fetchGoals();
  }, [dispatch]);

  // Update selected days for an existing goal
  const handleUpdateSelectedDays = async (goalId, newSelectedDays) => {
    try {
      await dispatch(
        updateWeeklyGoal({ id: goalId, selectedDays: newSelectedDays })
      ).unwrap();
      dispatch(getWeeklyGoal());
    } catch (err) {
      console.error("Failed to update selected days:", err);
    }
  };

  const handleDayToggle = (day) => {
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    setSelectedDays(updatedDays);

    if (weeklyGoal.length > 0) {
      handleUpdateSelectedDays(
        weeklyGoal[weeklyGoal.length - 1]._id,
        updatedDays
      );
    }
  };

  const handleSubmitGoal = async () => {
    const goalData = {
      name: goalName,
      selectedDays,
      details: goalDetails,
      notes: {},
      progress: (selectedDays.length / 7) * 100,
    };

    try {
      await dispatch(createWeeklyGoal(goalData)).unwrap();
      setShowModal(false);
      dispatch(getWeeklyGoal());
    } catch (err) {
      console.error("Failed to create goal:", err);
    }
  };

  const handleDeleteWeeklyGoal = async (goalID) => {
    try {
      await dispatch(deleteWeeklyGoal(goalID)).unwrap();
      dispatch(getWeeklyGoal());
      setSelectedDays("");
      setNotes({});
    } catch (err) {
      console.error(`Failed to delete goal with ID: ${goalID}`, err);
    }
  };

  const handleNoteChange = async (day, note) => {
    const updatedNotes = { ...notes, [day]: note };
    setNotes(updatedNotes);

    if (weeklyGoal?.length > 0) {
      const goalToUpdate = weeklyGoal[weeklyGoal.length - 1];
      try {
        await dispatch(
          updateNotes({
            id: goalToUpdate._id,
            notes: updatedNotes,
          })
        ).unwrap();
        console.log("Notes updated successfully:", updatedNotes);
      } catch (err) {
        console.error("Failed to update notes:", err);
      }
    }
  };

  const handleEditNote = (day) => {
    setEditingDay(day); // Set the day being edited
    setEditedNote(notes[day] || ""); // Initialize the edited note
  };

  const handleSaveNote = async (day) => {
    await handleNoteChange(day, editedNote); // Save the edited note
    setEditingDay(null); // Exit edit mode
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="weekly-container">
      <h2>Weekly Goal Tracker</h2>

      {weeklyGoal.length > 0 && (
        <div className="current-goal-info">
          <div className="goal-header">
            <h3>{weeklyGoal[weeklyGoal.length - 1].name}</h3>
            <RiDeleteBinLine
              className="delete-icon"
              onClick={() =>
                handleDeleteWeeklyGoal(weeklyGoal[weeklyGoal.length - 1]._id)
              }
            />
          </div>
          <p className="goal-details">
            {weeklyGoal[weeklyGoal.length - 1].details}
          </p>
          <p className="goal-date">
            Created:
            {new Date(
              weeklyGoal[weeklyGoal.length - 1].createdAt
            ).toLocaleDateString()}
          </p>
          <div className="update-goal">
            <button
              className="update-button"
              onClick={() => setShowModal(true)}>
              Update Goal
            </button>
          </div>
        </div>
      )}

      <ProgressBar progress={progress} />

      {weeklyGoal.length > 0 ? (
        <DaysSelector
          selectedDays={selectedDays}
          onToggleDay={handleDayToggle}
        />
      ) : (
        <p className="no-goal-message">
          Please add a weekly goal to start selecting days.
        </p>
      )}

      {showModal && (
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
                onClick={handleSubmitGoal}>
                Save Goal
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {!showModal && weeklyGoal.length === 0 && (
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
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <tr key={day}>
                <td>{day}</td>
<td>
  <div className="note-container">
    {editingDay === day ? (
      <div className="edit-mode">
        <input
          type="text"
          value={editedNote}
          onChange={(e) => setEditedNote(e.target.value)}
          placeholder="Add a note"
        />
        <button className="save-btn" onClick={() => handleSaveNote(day)}>
          Save
        </button>
      </div>
    ) : (
      <div className="view-mode">
        <span>{notes[day] || "No note added"}</span>
        <button className="edit-btn" onClick={() => handleEditNote(day)}>
          <RiPencilLine />
        </button>
      </div>
    )}
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
    </div>
  );
};

export default Weekly;