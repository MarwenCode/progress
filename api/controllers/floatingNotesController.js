import FloatingNotes from "../models/FloatingNotes.js";

// Get all floating notes for the current user
export const getFloatingNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Fetching floating notes for user:', userId);
    
    const notes = await FloatingNotes.find({ user: userId }).sort({ createdAt: -1 });
    console.log(`Found ${notes.length} floating notes for user ${userId}`);
    
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error retrieving floating notes:', error);
    res.status(500).json({ message: "Error retrieving floating notes", error });
  }
};

// Create a new floating note
export const createFloatingNote = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user._id;

    console.log('Creating floating note for user:', userId);

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newNote = new FloatingNotes({ title, user: userId });
    await newNote.save();

    console.log('Floating note created successfully:', newNote._id);
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
    const userId = req.user._id;
    
    console.log('Deleting floating note:', noteId, 'for user:', userId);
    
    const note = await FloatingNotes.findOneAndDelete({ _id: noteId, user: userId });
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    console.log('Floating note deleted successfully');
    res.status(200).json({ message: 'Note deleted successfully', deletedNote: note });
  } catch (error) {
    console.error('Error deleting floating note:', error);
    res.status(500).json({ message: "Error deleting floating note", error });
  }
};
