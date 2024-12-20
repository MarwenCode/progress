import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, createTask } from "../../redux/taskSlice/taskSlice";
import { FaTree, FaMugHot, FaDragon } from "react-icons/fa"; 
import Navbar from "../../components/navbar/Navbar";
import "./daily.scss";

const TaskList = ({ tasks, handleTaskCheck }) => (
  <ul>
    {tasks.map((task) => (
      <li key={task._id}>
        <input
          type="checkbox"
          checked={task.progress === 100}
          onChange={() => handleTaskCheck(task._id, task.progress)}
        />
        <span>{task.title}</span>
        <div className="icon-wrapper">
          {task.icon === "tree" && <FaTree className="icon tree" />}
          {task.icon === "mug" && <FaMugHot className="icon mug" />}
          {task.icon === "dragon" && <FaDragon className="icon dragon" />}
        </div>
      </li>
    ))}
  </ul>
);

const Daily = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const loading = useSelector((state) => state.tasks.loading);
  const error = useSelector((state) => state.tasks.error);

  const [modalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [progressType, setProgressType] = useState("linear");

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  const handleAddTask = () => {
    if (newTask.trim() && selectedIcon) {
      dispatch(
        createTask({ title: newTask, description: "Task description", progress: 0, icon: selectedIcon })
      );
      setNewTask("");
      setSelectedIcon("");
      setModalOpen(false);
    }
  };

  const handleTaskCheck = (taskId, currentProgress) => {
    const updatedProgress = Math.min(100, currentProgress + 25);
    // Handle task progress update via Redux
  };

  const completedProgress = tasks.length > 0
    ? (tasks.filter((task) => task.progress === 100).length / tasks.length) * 100
    : 0;

  return (
    <div className="daily-container">
      <Navbar />
      <h1>Daily Goal</h1>
      <div className="goal-section">
        <h3>Today's Progress</h3>
        <div className={`progress-bar ${progressType}`}>
          <div className="progress" style={{ width: `${completedProgress}%` }}></div>
        </div>
        <button onClick={() => setModalOpen(true)}>Add Task</button>
      </div>

      <div className="tasks-section">
        <h3>Today's Tasks</h3>
        {loading && <p>Loading tasks...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && tasks.length === 0 && <p>No tasks yet. Start by adding one!</p>}
        {!loading && tasks.length > 0 && (
          <TaskList tasks={tasks} handleTaskCheck={handleTaskCheck} />
        )}
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create Task</h3>
            <input
              type="text"
              placeholder="Task title"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <div className="icon-options">
              <div
                className={`icon-wrapper ${selectedIcon === "tree" ? "selected" : ""}`}
                onClick={() => setSelectedIcon("tree")}
              >
                <FaTree className="icon tree" />
              </div>
              <div
                className={`icon-wrapper ${selectedIcon === "mug" ? "selected" : ""}`}
                onClick={() => setSelectedIcon("mug")}
              >
                <FaMugHot className="icon mug" />
              </div>
              <div
                className={`icon-wrapper ${selectedIcon === "dragon" ? "selected" : ""}`}
                onClick={() => setSelectedIcon("dragon")}
              >
                <FaDragon className="icon dragon" />
              </div>
            </div>
            <button onClick={handleAddTask}>Add Task</button>
            <button className="cancel-button" onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Daily;
