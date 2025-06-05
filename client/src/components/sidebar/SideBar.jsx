import React, { useState } from "react";
import "./sidebar.scss";

const SideBar = ({ onClose, position }) => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");

  const addNote = () => {
    if (input.trim()) {
      setNotes([...notes, input]);
      setInput("");
    }
  };

  const deleteNote = (index) => {
    const updated = [...notes];
    updated.splice(index, 1);
    setNotes(updated);
  };

  // Positionnement dynamique
  const sidebarStyle = {
    position: "fixed",
    top: position.y,
    left: position.x + 60, // un petit décalage à droite de l'icône
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
      <button onClick={addNote}>Add</button>

      <div className="notes-list">
        {notes.map((note, index) => (
          <div key={index} className="note">
            <p>{note}</p>
            <span onClick={() => deleteNote(index)}>✖</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;

