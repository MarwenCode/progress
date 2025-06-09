import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFloatingNotes, addFloatingNote, deleteFloatingNote } from "../../redux/floatingNoteSlice/floatingNoteSlice";
import "./sidebar.scss";


const SideBar = ({ onClose, position }) => {
  const dispatch = useDispatch();
  const { notes, loading } = useSelector((state) => state.floatingNotes);
  const [input, setInput] = useState("");

  useEffect(() => {
    dispatch(fetchFloatingNotes());
  }, [dispatch]);

  const handleAddNote = () => {
    if (input.trim()) {
      dispatch(addFloatingNote({ title: input }));
      setInput("");
    }
  };

  const handleDeleteNote = (id) => {
    dispatch(deleteFloatingNote(id));
  };

  const sidebarStyle = {
    position: "fixed",
    top: position.y,
    left: position.x + 60,
    zIndex: 10000,
  };

  return (
    <div className="mobile-sidebar" style={sidebarStyle}>
      <button className="close-btn" onClick={onClose}>✖</button>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Quick note..."
      />
      <button onClick={handleAddNote}>Add</button>

      <div className="notes-list">
        {loading && <p style={{ color: "#aaa" }}>Loading...</p>}
        {notes.map((note) => (
          <div key={note._id} className="note">
            <p>{note.title}</p>
            <span onClick={() => handleDeleteNote(note._id)}>✖</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;



