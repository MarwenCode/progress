// Daily.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks, updateTask, deleteTask, createTask } from '../../redux/taskSlice/taskSlice'
import TaskItems from '../../components/taskItems/TaskItems';
import './daily.scss'
import { RiDeleteBinLine } from 'react-icons/ri';

const Daily = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const [newTask, setNewTask] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  const handleTaskCheck = (id, progress) => {
    const newProgress = progress === 100 ? 0 : 100; // Toggle progress
    dispatch(updateTask({ id, progress: newProgress }));
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };

  const handleAddTask = () => {
    if (newTask) {
      dispatch(createTask({ title: newTask, progress: 0 }));
      setNewTask('');
      setModalOpen(false);
    }
  };

  const completedProgress = tasks.length > 0
    ? (tasks.filter(task => task.progress === 100).length / tasks.length) * 100
    : 0;

  return (
    <div className="daily-container">
      <div className="box">
        <div className="header">
          <h1>Daily Goal</h1>
          <p className="percent">{completedProgress.toFixed(0)}%</p>
        </div>

        <div className="goal-section">
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
            <ul className="tasks-list">
              {tasks.map(task => (
                <TaskItems
                  key={task._id}
                  task={task}
                  onToggleProgress={handleTaskCheck}
                  onDelete={handleDeleteTask}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Modal */}
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
              <button className="cancel-button" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Daily;
