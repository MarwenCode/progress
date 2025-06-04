import React from "react";
import Draggable from "react-draggable";
import "./floatingButton.scss";

const FloatingButton = ({ onClick }) => {
  return (
    <Draggable>
      <div className="floating-button" onClick={onClick}>
        📝
      </div>
    </Draggable>
  );
};

export default FloatingButton;
