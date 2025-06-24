import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMonthlyGoals,
  addMonthlyGoal,
  addTaskToGoal,
  updateTaskCompletion,
  deleteMonthlyGoal,
} from "../../redux/monthlySlice/monthlySlice";
import { RiDeleteBinLine } from "react-icons/ri";
import "./monthly.scss";

const Monthly = () => {
  const dispatch = useDispatch();
  const { goals, status, error } = useSelector((state) => state.monthly);

  // State for the modal form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [month, setMonth] = useState("");
  const [goalName, setGoalName] = useState("");
  const [goalDetails, setGoalDetails] = useState("");

  // State for the inline task input fields
  const [taskInputs, setTaskInputs] = useState({});

  useEffect(() => {
    dispatch(fetchMonthlyGoals());
  }, [dispatch]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form fields when closing
    setMonth("");
    setGoalName("");
    setGoalDetails("");
  };

  const handleAddGoal = (e) => {
    e.preventDefault(); // Prevent form submission
    if (!month || !goalName) {
      alert("Please fill in the month and goal name.");
      return;
    }

    dispatch(addMonthlyGoal({ month, goalName, goalDetails }));
    handleCloseModal(); // Close modal and reset fields after dispatch
  };

  const handleTaskInputChange = (goalId, value) => {
    setTaskInputs((prev) => ({ ...prev, [goalId]: value }));
  };

  const handleAddTask = (goalId) => {
    // --- DEBUG LOG ---
    console.log("[handleAddTask] Received goalId:", goalId);

    const taskText = taskInputs[goalId]?.trim();
    if (!taskText) {
      console.log("[handleAddTask] Task text is empty, aborting.");
      return;
    }

    dispatch(addTaskToGoal({ goalId, task: { text: taskText } }));
    setTaskInputs((prev) => ({ ...prev, [goalId]: "" })); // Clear input after adding
  };

  const handleToggleTask = (goalId, taskId, completed) => {
    dispatch(updateTaskCompletion({ goalId, taskId, completed: !completed }));
  };

  const handleDeleteGoal = (goalId) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      dispatch(deleteMonthlyGoal(goalId));
    }
  };

  const calculateProgress = (tasks = []) => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  // Conditional rendering based on status
  if (status === "loading") {
    return <div className="monthly-container loading">Loading...</div>;
  }

  if (status === "failed") {
    return <div className="monthly-container error">Error: {error}</div>;
  }

  return (
    <div className="monthly-container">
      <div className="header">
        <h2>Monthly Goals</h2>
        <button className="add-goal-btn" onClick={handleOpenModal}>
          + Add Monthly Goal
        </button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <form onSubmit={handleAddGoal}>
              <h3>Add a New Monthly Goal</h3>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Goal Name (e.g., Learn React)"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Description (optional)"
                  value={goalDetails}
                  onChange={(e) => setGoalDetails(e.target.value)}
                />
              </div>
              <div className="form-group">
                <select value={month} onChange={(e) => setMonth(e.target.value)} required>
                  <option value="" disabled>Select a month</option>
                  {[ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
                  .map((m) => (<option key={m} value={m}>{m}</option>))}
                </select>
              </div>
              <div className="button-group">
                <button type="submit" className="save-btn">Save Goal</button>
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {goals.length > 0 ? (
        <div className="goals-list">
          {goals.map((goal) => {
            // --- DEBUG LOG ---
            console.log("[Render] Processing goal object:", goal);
            
            return (
              <div key={goal.id} className="goal-card">
                <div className="goal-header">
                  <h3>{goal.goalName}</h3>
                  <p>{goal.goalDetails}</p>
                </div>

                <div className="goal-footer">
                  <h4>{goal.month}</h4>
                  <div className="deleteButton" onClick={() => handleDeleteGoal(goal.id)}>
                    <RiDeleteBinLine />
                  </div>
                </div>

                <div className="progress-bar">
                  <div className="progress" style={{ width: `${calculateProgress(goal.tasks)}%` }}></div>
                </div>
                <p className="progress-text">{calculateProgress(goal.tasks)}% completed</p>

                <div className="task-form">
                  <input
                    type="text"
                    placeholder="Add a sub-task"
                    value={taskInputs[goal.id] || ""}
                    onChange={(e) => handleTaskInputChange(goal.id, e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask(goal.id)}
                  />
                  <button onClick={() => handleAddTask(goal.id)}>Add</button>
                </div>

                <ul className="task-list">
                  {(goal.tasks || []).map((task) => (
                    <li key={task._id} className={task.completed ? "completed" : ""}>
                      <input
                        type="checkbox"
                        id={`task-${task._id}`}
                        checked={task.completed}
                        onChange={() => handleToggleTask(goal.id, task._id, task.completed)}
                      />
                      <label htmlFor={`task-${task._id}`}>
                        <span>{task.text}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-goals-container">
          <h3>No Monthly Goals Yet</h3>
          <p>Click the button above to add your first goal for the month!</p>
        </div>
      )}
    </div>
  );
};

export default Monthly;