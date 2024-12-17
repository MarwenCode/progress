import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks } from '../../redux/taskSlice/taskSlice';

const Daily = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const loading = useSelector((state) => state.tasks.loading);
  const error = useSelector((state) => state.tasks.error);

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && tasks.length > 0) {
      console.log('Fetched tasks:', tasks); // Log the fetched tasks to the console
    }
  }, [loading, tasks]);

  return (
    <div className="daily-container">
      <h1>Daily Goal</h1>
      <p>Check the console for the fetched tasks.</p>
      {loading && <p>Loading tasks...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Daily;
