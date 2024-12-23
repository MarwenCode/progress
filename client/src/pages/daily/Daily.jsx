// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getTasks, createTask, updateTask } from "../../redux/taskSlice/taskSlice";
// import { FaDragon } from "react-icons/fa";
// import { PiTreePalmLight } from "react-icons/pi";
// import { CiCoffeeCup } from "react-icons/ci";
// import Navbar from "../../components/navbar/Navbar";
// import "./daily.scss";

// const ICONS = {
//   tree: <PiTreePalmLight className="icon tree" />,
//   mug: <CiCoffeeCup className="icon mug" />,
//   dragon: <FaDragon className="icon dragon" />,
// };

// const TaskList = ({ tasks, handleTaskCheck }) => (
//   <ul>
//     {tasks.map((task) => (
//       <li key={task._id}>
//         <input
//           type="checkbox"
//           checked={task.progress === 100}
//           onChange={() => handleTaskCheck(task._id, task.progress)}
//         />
//         <span>{task.title}</span>
//         <div className="icon-wrapper">{ICONS[task.icon]}</div>
//       </li>
//     ))}
//   </ul>
// );

// const Daily = () => {
//   const dispatch = useDispatch();
//   const { tasks, loading, error } = useSelector((state) => state.tasks);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [progressBarOpen, setProgressBarOpen] = useState(false);
//   const [selectedBarIcon, setSelectedBarIcon] = useState(
//     <PiTreePalmLight className="icon tree-base" />
//   ); // Default to tree icon

//   const [newTask, setNewTask] = useState("");
//   const [selectedIcon, setSelectedIcon] = useState("");

//   useEffect(() => {
//     dispatch(getTasks());
//   }, [dispatch]);

//   const handleAddTask = () => {
//     if (newTask.trim() && selectedIcon) {
//       dispatch(createTask({ title: newTask, icon: selectedIcon }))
//         .unwrap()
//         .then(() => {
//           console.log("Task added successfully!");
//         })
//         .catch((err) => {
//           console.error("Failed to add task:", err);
//         });

//       setNewTask(""); // Clear the input field
//       setSelectedIcon(""); // Clear the selected icon
//       setModalOpen(false); // Close the modal
//     }
//   };

//   const handleTaskCheck = (taskId, currentProgress) => {
//     const updatedProgress = currentProgress === 100 ? 0 : Math.min(100, currentProgress + 25);

//     dispatch(updateTask({ id: taskId, progress: updatedProgress }))
//       .unwrap()
//       .then(() => {
//         console.log("Task updated successfully!");
//       })
//       .catch((err) => {
//         console.error("Failed to update task:", err);
//       });
//   };

//   const completedProgress = tasks.length
//     ? (tasks.filter((task) => task.progress === 100).length / tasks.length) * 100
//     : 0;

//   // Select the bar icon
//   const selectBarIcon = (icon) => {
//     setSelectedBarIcon(icon); // Update the selected icon
//     setProgressBarOpen(false); // Close the modal
//   };

//   return (
//     <div className="daily-container">
//       <div className="box">
//         <Navbar />
//         <div className="header">
//           <h1>Daily Goal</h1>
//           {selectedBarIcon} {/* Render the selected icon */}
//           <p className="percent">{completedProgress.toFixed(0)}%</p>
//         </div>

//         <div className="goal-section">
//           <div className="top">
//             <h3>Today's Progress</h3>
//           </div>

//           <button onClick={() => setProgressBarOpen(true)}>Choose Your Bar</button>

//           {progressBarOpen && (
//             <div className="modal">
//               <div className="modal-content">
//                 <h3>Edit Progress Bar</h3>
//                 <div className="icons">
//                   {Object.entries(ICONS).map(([key, icon]) => (
//                     <div
//                       key={key}
//                       onClick={() => selectBarIcon(icon)} // Update selected icon on click
//                       className="icon-option"
//                     >
//                       {icon}
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   className="cancel-button"
//                   onClick={() => setProgressBarOpen(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           )}

//           <div className="progress-bar">
//             <div
//               className="progress"
//               style={{ width: `${completedProgress}%` }}
//             >
//               <span className="progress-text">{completedProgress.toFixed(0)}%</span>
//             </div>
//           </div>
//           <button onClick={() => setModalOpen(true)}>Add Task</button>
//         </div>

//         {/* Task Section */}
//         <div className="tasks-section">
//           <h3>Today's Tasks</h3>
//           {loading && <p>Loading tasks...</p>}
//           {error && <p>Error: {error}</p>}
//           {!loading && tasks.length === 0 && <p>No tasks yet. Start by adding one!</p>}
//           {!loading && tasks.length > 0 && (
//             <TaskList tasks={tasks} handleTaskCheck={handleTaskCheck} />
//           )}
//         </div>

//         {/* Add Task Modal */}
//         {modalOpen && (
//           <div className="modal">
//             <div className="modal-content">
//               <h3>Create Task</h3>
//               <input
//                 type="text"
//                 placeholder="Task title"
//                 value={newTask}
//                 onChange={(e) => setNewTask(e.target.value)}
//               />
//               <div className="icon-options">
//                 <div
//                   className={`icon-wrapper ${selectedIcon === "tree" ? "selected" : ""}`}
//                   onClick={() => setSelectedIcon("tree")}
//                 >
//                   <PiTreePalmLight className="icon tree" />
//                 </div>
//                 <div
//                   className={`icon-wrapper ${selectedIcon === "mug" ? "selected" : ""}`}
//                   onClick={() => setSelectedIcon("mug")}
//                 >
//                   <CiCoffeeCup className="icon mug" />
//                 </div>
//                 <div
//                   className={`icon-wrapper ${selectedIcon === "dragon" ? "selected" : ""}`}
//                   onClick={() => setSelectedIcon("dragon")}
//                 >
//                   <FaDragon className="icon dragon" />
//                 </div>
//               </div>
//               <button onClick={handleAddTask}>Add Task</button>
//               <button
//                 className="cancel-button"
//                 onClick={() => setModalOpen(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Daily;


// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getTasks, createTask } from "../../redux/taskSlice/taskSlice";
// import { FaDragon } from "react-icons/fa";
// import { PiTreePalmLight } from "react-icons/pi";
// import { CiCoffeeCup } from "react-icons/ci";
// import Navbar from "../../components/navbar/Navbar";
// import "./daily.scss";

// const ICONS = {
//   tree: <PiTreePalmLight className="icon tree" />,
//   mug: <CiCoffeeCup className="icon mug" />,
//   dragon: <FaDragon className="icon dragon" />,
// };

// const TaskList = ({ tasks, handleTaskCheck }) => (
//   <ul>
//     {tasks.map((task) => (
//       <li key={task._id}>
//         <input
//           type="checkbox"
//           checked={task.progress === 100}
//           onChange={() => handleTaskCheck(task._id)}
//         />
//         <span>{task.title}</span>
//         <div className="icon-wrapper">{ICONS[task.icon]}</div>
//       </li>
//     ))}
//   </ul>
// );

// const Daily = () => {
//   const dispatch = useDispatch();
//   const { tasks, loading, error } = useSelector((state) => state.tasks);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [progressBarOpen, setProgressBarOpen] = useState(false);
//   const [selectedBarIcon, setSelectedBarIcon] = useState(
//     <PiTreePalmLight className="icon tree-base" />
//   ); // Default to tree icon

//   const [newTask, setNewTask] = useState("");
//   const [selectedIcon, setSelectedIcon] = useState("");

//   useEffect(() => {
//     dispatch(getTasks());
//   }, [dispatch]);

//   const handleAddTask = () => {
//     if (newTask.trim() && selectedIcon) {
//       dispatch(createTask({ title: newTask, icon: selectedIcon }))
//         .unwrap()
//         .then(() => {
//           console.log("Task added successfully!");
//         })
//         .catch((err) => {
//           console.error("Failed to add task:", err);
//         });

//       setNewTask(""); // Clear the input field
//       setSelectedIcon(""); // Clear the selected icon
//       setModalOpen(false); // Close the modal
//     }
//   };

//   const handleTaskCheck = (taskId) => {
//     console.log(`ID of the task checked: ${taskId}`);
//   };

//   const completedProgress = tasks.length
//     ? (tasks.filter((task) => task.progress === 100).length / tasks.length) * 100
//     : 0;

//   // Select the bar icon
//   const selectBarIcon = (icon) => {
//     setSelectedBarIcon(icon); // Update the selected icon
//     setProgressBarOpen(false); // Close the modal
//   };

//   return (
//     <div className="daily-container">
//       <div className="box">
//         <Navbar />
//         <div className="header">
//           <h1>Daily Goal</h1>
//           {selectedBarIcon} {/* Render the selected icon */}
//           <p className="percent">{completedProgress.toFixed(0)}%</p>
//         </div>

//         <div className="goal-section">
//           <div className="top">
//             <h3>Today's Progress</h3>
//           </div>

//           <button onClick={() => setProgressBarOpen(true)}>Choose Your Bar</button>

//           {progressBarOpen && (
//             <div className="modal">
//               <div className="modal-content">
//                 <h3>Edit Progress Bar</h3>
//                 <div className="icons">
//                   {Object.entries(ICONS).map(([key, icon]) => (
//                     <div
//                       key={key}
//                       onClick={() => selectBarIcon(icon)} // Update selected icon on click
//                       className="icon-option"
//                     >
//                       {icon}
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   className="cancel-button"
//                   onClick={() => setProgressBarOpen(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           )}

//           <div className="progress-bar">
//             <div
//               className="progress"
//               style={{ width: `${completedProgress}%` }}
//             >
//               <span className="progress-text">{completedProgress.toFixed(0)}%</span>
//             </div>
//           </div>
//           <button onClick={() => setModalOpen(true)}>Add Task</button>
//         </div>

//         {/* Task Section */}
//         <div className="tasks-section">
//           <h3>Today's Tasks</h3>
//           {loading && <p>Loading tasks...</p>}
//           {error && <p>Error: {error}</p>}
//           {!loading && tasks.length === 0 && <p>No tasks yet. Start by adding one!</p>}
//           {!loading && tasks.length > 0 && (
//             <TaskList tasks={tasks} handleTaskCheck={handleTaskCheck} />
//           )}
//         </div>

//         {/* Add Task Modal */}
//         {modalOpen && (
//           <div className="modal">
//             <div className="modal-content">
//               <h3>Create Task</h3>
//               <input
//                 type="text"
//                 placeholder="Task title"
//                 value={newTask}
//                 onChange={(e) => setNewTask(e.target.value)}
//               />
//               <div className="icon-options">
//                 <div
//                   className={`icon-wrapper ${selectedIcon === "tree" ? "selected" : ""}`}
//                   onClick={() => setSelectedIcon("tree")}
//                 >
//                   <PiTreePalmLight className="icon tree" />
//                 </div>
//                 <div
//                   className={`icon-wrapper ${selectedIcon === "mug" ? "selected" : ""}`}
//                   onClick={() => setSelectedIcon("mug")}
//                 >
//                   <CiCoffeeCup className="icon mug" />
//                 </div>
//                 <div
//                   className={`icon-wrapper ${selectedIcon === "dragon" ? "selected" : ""}`}
//                   onClick={() => setSelectedIcon("dragon")}
//                 >
//                   <FaDragon className="icon dragon" />
//                 </div>
//               </div>
//               <button onClick={handleAddTask}>Add Task</button>
//               <button
//                 className="cancel-button"
//                 onClick={() => setModalOpen(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Daily;



import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, createTask } from "../../redux/taskSlice/taskSlice";
import { FaDragon } from "react-icons/fa";
import { PiTreePalmLight } from "react-icons/pi";
import { CiCoffeeCup } from "react-icons/ci";
import Navbar from "../../components/navbar/Navbar";
import "./daily.scss";

const ICONS = {
  tree: <PiTreePalmLight className="icon tree" />,
  mug: <CiCoffeeCup className="icon mug" />,
  dragon: <FaDragon className="icon dragon" />,
};

const TaskList = ({ tasks, handleTaskCheck }) => (
  <ul>
    {tasks.map((task) => (
      <li key={task._id}>
        <input
          type="checkbox"
          checked={task.progress === 100}
          onChange={() => handleTaskCheck(task._id)}
        />
        <span>{task.title}</span>
        <div className="icon-wrapper">{ICONS[task.icon]}</div>
      </li>
    ))}
  </ul>
);

const Daily = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  const [modalOpen, setModalOpen] = useState(false);
  const [progressBarOpen, setProgressBarOpen] = useState(false);
  const [selectedBarIcon, setSelectedBarIcon] = useState(
    <PiTreePalmLight className="icon tree-base" />
  ); // Default to tree icon

  const [newTask, setNewTask] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [completedProgress, setCompletedProgress] = useState(0);
  const [localTasks, setLocalTasks] = useState([]); // Local state for tasks

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  useEffect(() => {
    setLocalTasks(tasks); // Sync local state with tasks from store
    calculateCompletedProgress(tasks);
  }, [tasks]);

  const calculateCompletedProgress = (tasks) => {
    const completed = tasks.filter((task) => task.progress === 100).length;
    const total = tasks.length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    setCompletedProgress(progress);
  };

  const handleAddTask = () => {
    if (newTask.trim() && selectedIcon) {
      dispatch(createTask({ title: newTask, icon: selectedIcon }))
        .unwrap()
        .then(() => {
          console.log("Task added successfully!");
        })
        .catch((err) => {
          console.error("Failed to add task:", err);
        });

      setNewTask(""); // Clear the input field
      setSelectedIcon(""); // Clear the selected icon
      setModalOpen(false); // Close the modal
    }
  };

  const handleTaskCheck = (taskId) => {
    console.log(`ID of the task checked: ${taskId}`);

    // Create a copy of tasks and update the progress of the checked task
    const updatedTasks = localTasks.map((task) => {
      if (task._id === taskId) {
        return { ...task, progress: task.progress === 100 ? 0 : 100 };
      }
      return task;
    });

    setLocalTasks(updatedTasks); // Update local state
    calculateCompletedProgress(updatedTasks); // Recalculate completed progress
  };

  const selectBarIcon = (icon) => {
    setSelectedBarIcon(icon); // Update the selected icon
    setProgressBarOpen(false); // Close the modal
  };

  return (
    <div className="daily-container">
      <div className="box">
        <Navbar />
        <div className="header">
          <h1>Daily Goal</h1>
          {selectedBarIcon} {/* Render the selected icon */}
          <p className="percent">{completedProgress.toFixed(0)}%</p>
        </div>

        <div className="goal-section">
          <div className="top">
            <h3>Today's Progress</h3>
          </div>

          <button onClick={() => setProgressBarOpen(true)}>Choose Your Bar</button>

          {progressBarOpen && (
            <div className="modal">
              <div className="modal-content">
                <h3>Edit Progress Bar</h3>
                <div className="icons">
                  {Object.entries(ICONS).map(([key, icon]) => (
                    <div
                      key={key}
                      onClick={() => selectBarIcon(icon)} // Update selected icon on click
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

        {/* Task Section */}
        <div className="tasks-section">
          <h3>Today's Tasks</h3>
          {loading && <p>Loading tasks...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && tasks.length === 0 && <p>No tasks yet. Start by adding one!</p>}
          {!loading && tasks.length > 0 && (
            <TaskList tasks={localTasks} handleTaskCheck={handleTaskCheck} />
          )}
        </div>

        {/* Add Task Modal */}
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
                  <PiTreePalmLight className="icon tree" />
                </div>
                <div
                  className={`icon-wrapper ${selectedIcon === "mug" ? "selected" : ""}`}
                  onClick={() => setSelectedIcon("mug")}
                >
                  <CiCoffeeCup className="icon mug" />
                </div>
                <div
                  className={`icon-wrapper ${selectedIcon === "dragon" ? "selected" : ""}`}
                  onClick={() => setSelectedIcon("dragon")}
                >
                  <FaDragon className="icon dragon" />
                </div>
              </div>
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
      </div>
    </div>
  );
};

export default Daily;



