
import React from 'react';
import "./taskitems.scss"
import { RiDeleteBinLine } from 'react-icons/ri';

const TaskItems = ({ task, onToggleProgress, onDelete }) => {
  return (
    <li className="task-item">
      {/* Checkbox pour chaque tâche */}
      <div
        className={`custom-checkbox ${task.progress === 100 ? "checked" : ""}`}
        onClick={() => onToggleProgress(task._id, task.progress)}
      />
      <span className="task-title">{task.title}</span>
      <div className="deleteButton">
        <RiDeleteBinLine className="delete-btn" onClick={() => onDelete(task._id)} />
      </div>
    </li>
  );
};

export default TaskItems;
