import React, { useRef } from "react";
import Draggable from "react-draggable";
import "./floatingButton.scss";

const FloatingButton = ({ onClick, onDragStop }) => {
  const nodeRef = useRef(null);

  return (
    <Draggable nodeRef={nodeRef} onStop={onDragStop}>
      <div ref={nodeRef} className="floating-button" onClick={onClick}>
        {"\u{1F4DD}"}
      </div>
    </Draggable>
  );
};

export default FloatingButton;
