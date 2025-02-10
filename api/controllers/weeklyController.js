// controllers/weeklyController.js
import Weekly from '../models/Weekly.js';  // You'll need to create this model

export const getWeeklyGoal = async (req, res) => {
  try {
    const weeklyGoals = await Weekly.find(); // Fetch all weekly goals
    res.status(200).json(weeklyGoals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  
  


export const createWeeklyGoal = async (req, res) => {
  try {
    const newWeeklyGoal = new Weekly(req.body);
    const savedGoal = await newWeeklyGoal.save();
    res.status(201).json(savedGoal);
    console.log('Saving new goal:', req.body);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Update Weekly Goal
// export const updateWeeklyGoal = async (req, res) => {
//   const { id } = req.params; // The ID of the goal to update
//   const { name, selectedDays, details, notes, progress } = req.body;

//   try {
//     const updatedGoal = await Weekly.findByIdAndUpdate(
//       id,
//       { name, selectedDays, details, notes, progress },
//       { new: true, runValidators: true } // Return the updated document and validate the input
//     );

//     if (!updatedGoal) {
//       return res.status(404).json({ message: 'Weekly goal not found.' });
//     }

//     res.status(200).json(updatedGoal);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update weekly goal.', error: error.message });
//   }
// };


export const updateWeeklyGoal = async (req, res) => {
  const { id } = req.params;
  console.log("ID reçu pour mise à jour:", id); // Debugging

  try {
    const updatedGoal = await Weekly.findByIdAndUpdate(
      id,
      { ...req.body }, // Mise à jour avec tout le contenu
      { new: true, runValidators: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ message: "Objectif hebdomadaire non trouvé." });
    }

    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: "Échec de la mise à jour.", error: error.message });
  }
};



// Update only the notes field of a weekly goal
export const updateWeeklyGoalNotes = async (req, res) => {
  const { id } = req.params; // Extract the id from the URL
  const { notes } = req.body; // Extract the notes field from the request body

  console.log("Received update request for notes with ID:", id); // Debugging log
  console.log("Notes data:", notes); // Debugging log

  if (!notes || typeof notes !== "object") {
    return res.status(400).json({ message: "Invalid notes data" });
  }

  try {
    const updatedGoal = await Weekly.findByIdAndUpdate(
      id,
      { $set: { notes } }, // Explicitly update the notes field
      { new: true } // Return the updated document
    );

    if (!updatedGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    console.log("Updated goal notes in database:", updatedGoal); // Debugging log
    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error("Error updating goal notes:", error);
    res.status(500).json({ message: "Failed to update goal notes" });
  }
};

//delete a weekly Goal 
export const deleteWeeklyGoal = async (req, res) => {
  try {
    const goalId = req.params.id;
    await Weekly.findByIdAndDelete(goalId);
    res.status(200).json(goalId); // Send the deleted goal's ID
  } catch (error) {
    res.status(404).json({ message: "Goal not found" });
  }
};




