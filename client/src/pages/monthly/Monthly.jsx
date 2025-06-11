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

  const [month, setMonth] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskInputs, setTaskInputs] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMonthlyGoals());
  }, [dispatch]);

  const handleAddGoal = () => {
    if (!month || !title || !description) {
      alert("Please fill in all fields.");
      return;
    }

    dispatch(
      addMonthlyGoal({ month, goalName: title, goalDetails: description })
    );
    setMonth("");
    setTitle("");
    setDescription("");
    setIsModalOpen(false);
  };

  const handleTaskInputChange = (goalId, value) => {
    setTaskInputs((prev) => ({ ...prev, [goalId]: value }));
  };

  const handleAddTask = (goalId) => {
    const taskText = taskInputs[goalId]?.trim();
    if (!taskText) return;

    dispatch(
      addTaskToGoal({
        goalId,
        task: { text: taskText, completed: false },
        url: `/monthly/${goalId}/tasks`,
      })
    );

    setTaskInputs((prev) => ({ ...prev, [goalId]: "" }));
  };

  const handleToggleTask = (goalId, taskId, completed) => {
    dispatch(updateTaskCompletion({ goalId, taskId, completed: !completed }));
  };

  const handleDeleteGoal = (goalId) => {
    dispatch(deleteMonthlyGoal(goalId))
      .unwrap()
      .then(() => {
        console.log(`Goal with ID : ${goalId} deleted successfully`);
      });
  };

  const calculateProgress = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.completed).length;
    return (completedTasks / tasks.length) * 100;
  };

  if (status === "loading") return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!goals || goals.length === 0) {
    // If there are no goals, show a message and a button to add a goal
    return (
      <div className="no-goals-container">
        <h2>No Monthly Goals Yet</h2>
        <button className="add-goal-btn" onClick={() => setIsModalOpen(true)}>
          Add a Monthly Goal
        </button>
      </div>
    );
  }

  //create a function to show the percentage of tasks completed in the progress bar

  return (
    <div className="monthly-container">
      <h2>Monthly Goals</h2>
      <button className="add-goal-btn" onClick={() => setIsModalOpen(true)}>
        Add a Monthly Goal
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Monthly Goal</h3>

            <div className="form-group">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">Select a month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="button-group">
              <button className="save-btn" onClick={handleAddGoal}>
                Save Goal
              </button>
              <button
                className="cancel-btn"
                onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="goals-list">
        {goals.map((goal) => (
          <div key={goal._id} className="goal-card">
            <div className="goal_header">
              <h3>{goal.goalName}</h3>
              <p>{goal.goalDetails}</p>
            </div>

            <div className="goal-footer">
              <h4>{goal.month}</h4>
              <div className="deleteButton">
                <RiDeleteBinLine onClick={() => handleDeleteGoal(goal._id)} />
              </div>
            </div>

            <div className="progress-bar">
  <div
    className="progress"
    style={{ width: `${calculateProgress(goal.tasks)}%` }}></div>
</div>
<p className="progress-text">
  {Math.round(calculateProgress(goal.tasks))}% completed
</p>


            <div className="task-form">
              <input
                type="text"
                placeholder="Add a task"
                value={taskInputs[goal._id] || ""}
                onChange={(e) =>
                  handleTaskInputChange(goal._id, e.target.value)
                }
              />
              <button onClick={() => handleAddTask(goal._id)}>Add Task</button>
            </div>

            <ul>
              {(goal.tasks || []).map((task) => (
                <li
                  key={task._id}
                  className={task.completed ? "completed" : ""}>
                  <input
                    type="checkbox"
                    id={`task-${task._id}`}
                    checked={task.completed}
                    onChange={() =>
                      handleToggleTask(goal._id, task._id, task.completed)
                    }
                  />
                  <label htmlFor={`task-${task._id}`}>
                    <span>{task.text}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Monthly;
