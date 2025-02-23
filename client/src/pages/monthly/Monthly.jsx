import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMonthlyGoals,
  addMonthlyGoal,
  addTaskToGoal,
  updateTaskCompletion,
  deleteMonthlyGoal
} from "../../redux/monthlySlice/monthlySlice";
import { RiDeleteBinLine } from "react-icons/ri";
import "./monthly.scss";

const Monthly = () => {
  const dispatch = useDispatch();
  const { goals, status, error } = useSelector((state) => state.monthly);

  const [month, setMonth] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskInputs, setTaskInputs] = useState({}); // Stocke chaque input de tâche par goalId
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
    setTaskInputs((prev) => ({
      ...prev,
      [goalId]: value,
    }))
  };

  const handleAddTask = (goalId) => {
    const taskText = taskInputs[goalId]?.trim();
    if (!taskText) return;

    console.log(`Sending task to goalId: ${goalId}`); // Vérifie l'ID

    // Assure-toi que l'URL est correcte
    dispatch(
      addTaskToGoal({
        goalId,
        task: { text: taskText, completed: false },
        url: `/monthly/${goalId}/tasks`, // URL corrigée ici
      })
    );

    setTaskInputs((prev) => ({
      ...prev,
      [goalId]: "",
    }));
  };

  const handleToggleTask = (goalId, taskId, completed) => {
    dispatch(updateTaskCompletion({ goalId, taskId, completed: !completed }));
  };

  const calculateProgress = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.completed).length;
    return (completedTasks / tasks.length) * 100;
  };

  
 const handleDeleteGoal = (goalId) => {
  dispatch(deleteMonthlyGoal(goalId))
    .unwrap()
    .then(() => {
      console.log(`Goal with ID : ${goalId} deleted successfuly`);
      // dispatch()
    })

}

  if (status === "loading") return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;



  return (
    <div className="monthly-container">
      <h2>Monthly Goals</h2>
      <button className="add-goal-btn" onClick={() => setIsModalOpen(true)}>
        Add Monthly Goal
      </button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Monthly Goal</h3>
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
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={handleAddGoal}>Save Goal</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      <div className="goals-list">
        {goals.map((goal) => (
          <div key={goal._id} className="goal-card">
            <h3>{goal.goalName}</h3>
            <p>{goal.goalDetails}</p>
            <p>Month: {goal.month}</p>
            <div className="deleteButton"  > 
              <RiDeleteBinLine onClick={() => handleDeleteGoal(goal._id)} />
              </div>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${calculateProgress(goal.tasks)}%` }}></div>
            </div>
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
                    checked={task.completed}
                    onChange={() =>
                      handleToggleTask(goal._id, task._id, task.completed)
                    }
                  />
                  <span>{task.text}</span>
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
