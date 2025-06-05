import React from "react";
import Draggable from "react-draggable";
import "./floatingButton.scss";

const FloatingButton = ({ onClick, onDragStop }) => {
  return (
    <Draggable onStop={onDragStop}>
      <div className="floating-button" onClick={onClick}>
        📝
      </div>
    </Draggable>
  );
};

export default FloatingButton;

