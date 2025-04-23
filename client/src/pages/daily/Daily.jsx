import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, createTask, updateTask, deleteTask } from "../../redux/taskSlice/taskSlice";
import { FaDragon } from "react-icons/fa";
import { PiTreePalmLight } from "react-icons/pi";
import { CiCoffeeCup } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";


import "./daily.scss";

const ICONS = {
  tree: <PiTreePalmLight className="icon tree" />,
  mug: <CiCoffeeCup className="icon mug" />,
  dragon: <FaDragon className="icon dragon" />,
};




const Daily = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  const [modalOpen, setModalOpen] = useState(false);
  const [progressBarOpen, setProgressBarOpen] = useState(false);
  const [selectedBarIcon, setSelectedBarIcon] = useState(
    <PiTreePalmLight className="icon tree-base" />
  );
  const [newTask, setNewTask] = useState("");
  const [iconModalOpen, setIconModalOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("tree");

  //animation task

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  useEffect(() => {
    if (animate) {
      // Trigger the animation
      const taskItem = document.querySelector('.task-item:last-child');
      if (taskItem) {
        taskItem.classList.add('animate');
        setTimeout(() => {
          taskItem.classList.remove('animate');
          setAnimate(false); // Reset animation state
        }, 1000); // Duration of the animation
      }
    }
  }, [animate]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      const taskData = { title: newTask, icon: selectedIcon }; 
      dispatch(createTask(taskData))
        .unwrap()
        .then((task) => {
          console.log("Task added successfully:", task);
          setAnimate(true);
        })
        .catch((err) => {
          console.error("Failed to add task:", err);
        });

      setNewTask(""); // Reset input after task is added
      setModalOpen(false); 
    }
  };

  const handleTaskCheck = (taskId, currentProgress) => {
    const updatedProgress = currentProgress === 100 ? 0 : 100; // Toggle between 0 and 100
    console.log(`Id: ${taskId}, Task Checked: ${updatedProgress === 100}`); // Debugging log
    dispatch(updateTask({ id: taskId, progress: updatedProgress }))
      .unwrap()
      .then((task) => {
        console.log("Task updated successfully:", task);
      })
      .catch((err) => {
        console.error("Failed to update task:", err);
      });
  };
  

  const completedProgress = tasks.length
    ? (tasks.filter((task) => task.progress === 100).length / tasks.length) * 100
    : 0;

  const selectBarIcon = (icon) => {
    setSelectedBarIcon(icon);
    setProgressBarOpen(false);
  };

  const handleSelectIcon = (icon) => {
    setSelectedIcon(icon);
    setIconModalOpen(false); // Close icon selection modal
  };


  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId)) // Dispatch the deleteTask action
      .unwrap()
      .then(() => {
        console.log(`Task with ID: ${taskId} deleted successfully`);
        dispatch(getTasks());
      })
      .catch((err) => {
        console.error(`Failed to delete task with ID: ${taskId}`, err);
      });
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
          <div className="icon-wrapper">{ICONS[task.icon]}</div>
          <div className="deleteButton"  > <RiDeleteBinLine onClick={() => handleDeleteTask(task._id)}    /></div>
        </li>
      ))}
    </ul>
  );
  
 


  return (
    <div className="daily-container">
      <div className="box">
      
      <div className="header">
          <h1>Daily Goal</h1>
          {selectedBarIcon}
          <p className="percent">{completedProgress.toFixed(0)}%</p>
        </div>



        <div className="goal-section">
          <button onClick={() => setProgressBarOpen(true)}>Choose Your Bar Icon</button>

          {progressBarOpen && (
            <div className="modal">
              <div className="modal-content">
                <h3>Edit Progress Bar</h3>
                <div className="icons">
                  {Object.entries(ICONS).map(([key, icon]) => (
                    <div
                      key={key}
                      onClick={() => selectBarIcon(icon)}
                      className="icon-option"
                    >
                      {icon}
                    </div>
                  ))}
                </div>
                <button
                  className="cancel-button"
                  onClick={() => setProgressBarOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${completedProgress}%` }}
            >
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
              <button
                className="cancel-button"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Icon selection modal */}
        {iconModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Select Icon</h3>
              {Object.entries(ICONS).map(([key, icon]) => (
                <div
                  key={key}
                  onClick={() => handleSelectIcon(key)}
                  className="icon-option"
                >
                  {icon}
                </div>
              ))}
              <button
                className="cancel-button"
                onClick={() => setIconModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Daily;
