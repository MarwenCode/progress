import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import "./loading.scss";

const Loading = ({ color = "#ff5c5c", size = 60 }) => (
  <div className="global-spinner">
    <ClipLoader color={color} size={size} />
  </div>
);

export default Loading;
