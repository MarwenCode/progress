import FloatingNotes from "../models/floatingNotes.js";

// Get all floating notes
export const getFloatingNotes = async (req, res) => {
  try {
    const notes = await FloatingNotes.find();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving floating notes", error });
  }
};

// Create a new floating note
export const createFloatingNote = async (req, res) => {
  try {
    const { title,  } = req.body;

    // Validate required fields
    if (!title ) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newNote = new FloatingNotes({ title });
    await newNote.save();

    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error creating floating note:", error);
    res.status(500).json({ message: "Error creating floating note", error: error.message });
  }
};

// Delete a floating note
export const deleteFloatingNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await FloatingNotes.findByIdAndDelete(noteId);
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Error deleting floating note", error });
  }
};
