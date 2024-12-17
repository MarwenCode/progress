import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createTask } from '../../redux/taskSlice/taskSlice';
import './cards.scss';

const Cards = () => {
  const [selectedGoal, setSelectedGoal] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [goalType, setGoalType] = useState('');
  const [goalName, setGoalName] = useState('');
  const [goalDescription, setGoalDescription] = useState(''); // Description state
  const [goalDate, setGoalDate] = useState('');
  const dispatch = useDispatch(); // Redux dispatch
  const navigate = useNavigate();

  const handleGoalClick = (goal) => {
    setSelectedGoal(goal);
    setGoalType(goal); // Set goal type to daily, weekly, or monthly
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGoal('');
    setGoalName('');
    setGoalDescription(''); // Clear description field
    setGoalDate('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Dispatch the task creation action with task details
    dispatch(
      createTask({
        title: goalName,
        description: goalDescription || `${goalType.charAt(0).toUpperCase() + goalType.slice(1)} Goal`, // Default description if none provided
        progress: 0,
        completed: false, // Default value for completed
        goalType: goalType, // Daily, Weekly, Monthly
        dueDate: goalDate,
      })
    );

    // Navigate to the respective page based on the goal type
    setShowModal(false);
    if (goalType === 'daily') navigate('/daily');
    else if (goalType === 'weekly') navigate('/weekly');
    else if (goalType === 'monthly') navigate('/monthly');
  };

  return (
    <div className='cards-container'>
      {/* Goal Selection Cards */}
      <div className='cards'>
        <div
          className={`card daily ${selectedGoal === 'daily' ? 'active' : ''}`}
          onClick={() => handleGoalClick('daily')}>
          <p>Daily</p>
        </div>
        <div
          className={`card weekly ${selectedGoal === 'weekly' ? 'active' : ''}`}
          onClick={() => handleGoalClick('weekly')}>
          <p>Weekly</p>
        </div>
        <div
          className={`card monthly ${selectedGoal === 'monthly' ? 'active' : ''}`}
          onClick={() => handleGoalClick('monthly')}>
          <p>Monthly</p>
        </div>
      </div>

      {/* Modal for Goal Creation */}
      {showModal && (
        <div className='modal-overlay'>
          <div className='modal'>
            <h3>Create {goalType.charAt(0).toUpperCase() + goalType.slice(1)} Goal</h3>
            <form onSubmit={handleFormSubmit}>
              <div className='form-group'>
                <label htmlFor='goalName'>Goal Name:</label>
                <input
                  type='text'
                  id='goalName'
                  placeholder='e.g., Finish 5 tasks'
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='goalDescription'>Description:</label>
                <textarea
                  id='goalDescription'
                  placeholder='Describe your goal'
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  rows="4"
                />
              </div>
              <div className='form-group'>
                <label htmlFor='goalDate'>Select Date:</label>
                <input
                  type='date'
                  id='goalDate'
                  value={goalDate}
                  onChange={(e) => setGoalDate(e.target.value)}
                  required
                />
              </div>
              <button type='submit' className='animated-submit'>Submit Goal</button>
              <button type='button' className='close-button' onClick={handleCloseModal}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
