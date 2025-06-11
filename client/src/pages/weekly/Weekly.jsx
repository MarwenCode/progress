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
import { RiPencilLine, RiDeleteBinLine } from "react-icons/ri";
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
    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
  const isChecked = selectedDays.includes(day);
  return (
    <label key={day}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => onToggleDay(day)}
      />
      <span className={`custom-checkbox ${isChecked ? 'checked' : ''}`} />
      {day}
    </label>
  );
})}


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
  const [isEditing, setIsEditing] = useState(false); // Track if editing an existing goal

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
        updateWeeklyGoal({
          id: goalId,
          updates: { selectedDays: newSelectedDays },
        })
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

  // Function to handle creating a new goal
  const handleCreateGoal = async () => {
    const goalData = {
      name: goalName,
      selectedDays,
      details: goalDetails,
      notes,
      progress: (selectedDays.length / 7) * 100,
    };

    try {
      await dispatch(createWeeklyGoal(goalData)).unwrap();

      // Reset form fields and edit mode
      setShowModal(false);
      dispatch(getWeeklyGoal());
      setGoalName("");
      setSelectedDays([]);
      setGoalDetails("");
      setNotes({});
      setProgress(0);
    } catch (err) {
      console.error("Failed to create goal:", err);
    }
  };

  // Function to handle editing an existing goal



  const handleEditGoal = async () => {
    if (weeklyGoal.length === 0) {
      console.log("Aucun objectif trouvé pour modification.");
      return;
    }

    const goalId = weeklyGoal[weeklyGoal.length - 1]._id;
    console.log("ID envoyé pour mise à jour:", goalId);

    const goalData = {
      name: goalName,
      selectedDays,
      details: goalDetails,
      notes,
      progress: (selectedDays.length / 7) * 100,
    };

    try {
      console.log("État avant mise à jour:", weeklyGoal);

      const response = await dispatch(
        updateWeeklyGoal({ id: goalId, updates: goalData }) // Correction ici
      ).unwrap();

      console.log("Réponse après mise à jour:", response);

      dispatch(getWeeklyGoal()); // Recharge les données après mise à jour

      // Réinitialisation des champs
      setShowModal(false);
      setGoalName("");
      setSelectedDays([]);
      setGoalDetails("");
      setNotes({});
      setProgress(0);
      setIsEditing(false);
    } catch (err) {
      console.error("Échec de la modification de l'objectif:", err);
    }
  };

  useEffect(() => {
    console.log("État Redux après mise à jour:", weeklyGoal);
  }, [weeklyGoal]);



  useEffect(() => {
    console.log("Weekly goals updated:", weeklyGoal); // Debugging log
  }, [weeklyGoal]);

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

  const handleSaveNote = async (day) => {
    await handleNoteChange(day, editedNote); // Save the edited note
    setEditingDay(null); // Exit edit mode
  };

  const handleDeliteGoal = async () => {
    if (weeklyGoal.length > 0) {
      const goalId = weeklyGoal[weeklyGoal.length - 1]._id;
      try {
        await dispatch(deleteWeeklyGoal(goalId)).unwrap();

        if (weeklyGoal.length === 1) {
          // If the deleted goal was the only goal, reset the state
          setSelectedDays([]);
          setNotes({});
          setProgress(0);
        }

        dispatch(getWeeklyGoal());
      } catch (err) {
        console.error("Failed to delete goal:", err);
      }
    }
  };



  useEffect(() => {
    if (showModal && weeklyGoal.length > 0) {
      const latestGoal = weeklyGoal[weeklyGoal.length - 1];
      setGoalName(latestGoal.name || "");
      setGoalDetails(latestGoal.details || "");
    }
  }, [showModal, weeklyGoal]);




  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="weekly-container">
      <div className="box">

      <h2>Weekly Goal</h2>

{weeklyGoal.length > 0 && (
  <div className="current-goal-info">
    <div className="goal-header">
      <h3>{weeklyGoal[weeklyGoal.length - 1].name}</h3>
      <RiDeleteBinLine
        className="delete-icon"
        onClick={handleDeliteGoal}
      />
    </div>
    <p className="goal-details">
      {weeklyGoal[weeklyGoal.length - 1].details}
    </p>
    {/* <p className="goal-date">
      Created:
      {new Date(
        weeklyGoal[weeklyGoal.length - 1].createdAt
      ).toLocaleDateString()}
    </p> */}
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
        <div className="button-group">
          <button
            type="button"
            className="submit-btn"
            onClick={weeklyGoal.length === 0 ? handleCreateGoal : handleEditGoal}>
            {weeklyGoal.length === 0 ? "Save Goal" : "Edit Goal"}
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => setShowModal(false)}>
            Cancel
          </button>
        </div>

      </form>
    </div>
  </div>
)}

{!showModal && weeklyGoal.length === 0 && (
  <button className="add-goal-btn" onClick={() => setShowModal(true)}>
    Add Weekly Goal
  </button>
)}



      </div>
      

    </div>
  );
};

export default Weekly;
