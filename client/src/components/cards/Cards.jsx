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
  const [goalDescription, setGoalDescription] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoalClick = (goal) => {
    navigate(`/${goal}`);
  };

  return (
    <div className='cards-container'>
      <div className='cards'>
        <div className='card daily' onClick={() => handleGoalClick('daily')}>
          <p>Daily</p>
        </div>
        <div className='card weekly' onClick={() => handleGoalClick('weekly')}>
          <p>Weekly</p>
        </div>
        <div className='card monthly' onClick={() => handleGoalClick('monthly')}>
          <p>Monthly</p>
        </div>
      </div>
    </div>
  );
};

export default Cards;
