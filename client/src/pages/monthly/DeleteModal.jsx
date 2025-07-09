import React from 'react';
import "./deletemodal.scss"

const DeleteModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className='delete-modal'>
      <div className='delete-modal-content'>
        <h2>Delete</h2>
        <p>Are you sure you want to delete this item?</p>
        <button onClick={onDelete}>Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default DeleteModal;
