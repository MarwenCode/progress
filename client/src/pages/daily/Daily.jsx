import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, createTask, updateTask, deleteTask } from "../../redux/taskSlice/taskSlice";
// import { Icon } from "@iconify/react"; // 👈 icônes dynamiques
import "./daily.scss";

// const ICON_NAMES = {
//   tree: "mdi:palm-tree",
//   mug: "mdi:coffee",
//   dragon: "fa6-solid:dragon",
// };

const Daily = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  const [modalOpen, setModalOpen] = useState(false);
  const [progressBarOpen, setProgressBarOpen] = useState(false);
  // const [selectedBarIcon, setSelectedBarIcon] = useState("tree");
  const [newTask, setNewTask] = useState("");
  const [iconModalOpen, setIconModalOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("tree");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  useEffect(() => {
    if (animate) {
      const taskItem = document.querySelector(".task-item:last-child");
      if (taskItem) {
        taskItem.classList.add("animate");
        setTimeout(() => {
          taskItem.classList.remove("animate");
          setAnimate(false);
        }, 1000);
      }
    }
  }, [animate]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      const taskData = { title: newTask, icon: selectedIcon };
      dispatch(createTask(taskData))
        .unwrap()
        .then(() => setAnimate(true))
        .catch((err) => console.error("Failed to add task:", err));
      setNewTask("");
      setModalOpen(false);
    }
  };

  const handleTaskCheck = (taskId, currentProgress) => {
    const updatedProgress = currentProgress === 100 ? 0 : 100;
    dispatch(updateTask({ id: taskId, progress: updatedProgress }))
      .unwrap()
      .catch((err) => console.error("Failed to update task:", err));
  };

  const completedProgress = tasks.length
    ? (tasks.filter((task) => task.progress === 100).length / tasks.length) * 100
    : 0;

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId))
      .unwrap()
      .then(() => dispatch(getTasks()))
      .catch((err) => console.error(`Failed to delete task with ID: ${taskId}`, err));
  };

  const TaskList = ({ tasks, handleTaskCheck }) => (
    <ul className="tasks-list">
      {tasks.map((task) => (
        <li key={task._id} className="task-item">
          <input
            type="checkbox"
            checked={task.progress === 100}
            onChange={() => handleTaskCheck(task._id, task.progress)}
          />
          <span className="task-title">{task.title}</span>
          <div className="icon-wrapper">
            {/* <Icon icon={ICON_NAMES[task.icon]} className="icon" /> */}
          </div>
          <div className="deleteButton">
            {/* <Icon
              icon="mdi:delete-outline"
              className="icon delete"
              onClick={() => handleDeleteTask(task._id)}
            /> */}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="daily-container">
      <div className="box">
        <div className="header">
          <h1>Daily Goal</h1>
          {/* <Icon icon={ICON_NAMES[selectedBarIcon]} className="icon bar-icon" /> */}
          <p className="percent">{completedProgress.toFixed(0)}%</p>
        </div>

        <div className="goal-section">
          {/* <button onClick={() => setProgressBarOpen(true)}>Choose Your Bar Icon</button> */}

          {/* {progressBarOpen && (
            <div className="modal">
              <div className="modal-content">
                <h3>Edit Progress Bar</h3>
                <div className="icons">
                  {Object.entries(ICON_NAMES).map(([key, iconName]) => (
                    <div key={key} onClick={() => setSelectedBarIcon(key)} className="icon-option">
                      <Icon icon={iconName} className="icon" />
                    </div>
                  ))}
                </div>
                <button className="cancel-button" onClick={() => setProgressBarOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          )} */}

          <div className="progress-bar">
            <div className="progress" style={{ width: `${completedProgress}%` }}>
              <span className="progress-text">{completedProgress.toFixed(0)}%</span>
            </div>
          </div>
          <button onClick={() => setModalOpen(true)}>Add Task</button>
        </div>

        <div className="tasks-section">
          <h3>Today's Tasks</h3>
          {loading && <p>Loading tasks...</p>}
          {error && <p>Error: {error.message || "Something went wrong!"}</p>}
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
              <button onClick={handleAddTask}>Add Task</button>
              <button className="cancel-button" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
{/* 
        {iconModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Select Icon</h3>
              <div className="icons">
                {Object.entries(ICON_NAMES).map(([key, iconName]) => (
                  <div
                    key={key}
                    onClick={() => {
                      setSelectedIcon(key);
                      setIconModalOpen(false);
                    }}
                    className="icon-option"
                  >
                    <Icon icon={iconName} className="icon" />
                  </div>
                ))}
              </div>
              <button className="cancel-button" onClick={() => setIconModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Daily;
