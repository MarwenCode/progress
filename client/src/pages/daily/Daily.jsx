import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "../../redux/taskSlice/taskSlice";
import Navbar from "../../components/navbar/Navbar";
import { FaTree, FaMugHot, FaDragon } from "react-icons/fa"; 
import "./daily.scss";

const Daily = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const loading = useSelector((state) => state.tasks.loading);
  const error = useSelector((state) => state.tasks.error);

  const [newTask, setNewTask] = useState(""); // State for new task input
  const [selectedIcon, setSelectedIcon] = useState(""); // State for selected icon

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      console.log("Adding task:", newTask, "with icon:", selectedIcon);
      // Dispatch an action to add the new task with the selected icon if needed
      setNewTask("");
      setSelectedIcon("");
    }
  };

  return (
    <div className="daily-container">
      <Navbar />
      <h1>Daily Goal</h1>
      <div className="goal-section">
        <h3>Today's Tasks</h3>
        {loading && <p>Loading tasks...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && tasks.length === 0 && <p>No tasks yet. Start by adding one!</p>}
        {!loading && tasks.length > 0 && (
          <ul>
            {tasks.map((task) => (
              <li key={task._id}>
                <span>{task.title}</span>
                <p>{task.description}</p>
                <p>Progress: {task.progress}%</p>
                <div className="icon-wrapper">
                  {task.icon === "tree" && <FaTree className="icon tree" />}
                  {task.icon === "mug" && <FaMugHot className="icon mug" />}
                  {task.icon === "dragon" && <FaDragon className="icon dragon" />}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="tasks-section">
        <h3>Add a Task</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTask();
          }}
        >
          <input
            type="text"
            placeholder="Enter task title..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <div className="icon-options">
            <div
              className={`icon-wrapper tree ${selectedIcon === "tree" ? "selected" : ""}`}
              onClick={() => setSelectedIcon("tree")}
            >
              <FaTree className="icon" />
            </div>
            <div
              className={`icon-wrapper mug ${selectedIcon === "mug" ? "selected" : ""}`}
              onClick={() => setSelectedIcon("mug")}
            >
              <FaMugHot className="icon" />
            </div>
            <div
              className={`icon-wrapper dragon ${selectedIcon === "dragon" ? "selected" : ""}`}
              onClick={() => setSelectedIcon("dragon")}
            >
              <FaDragon className="icon" />
            </div>
          </div>
          <button type="submit">Add Task</button>
        </form>
      </div>
    </div>
  );
};

export default Daily;
