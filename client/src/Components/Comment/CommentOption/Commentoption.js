import React from "react";
import "./Commentoption.scss";

function Commentoption({
  closeCommentOption,
  comment,
  darkMode,
  handleDeleteComment,
}) {
  return (
    <div className={darkMode ? "Commentoption dark-mode" : "Commentoption"}>
      <div className="blank" onClick={closeCommentOption}></div>
      <div className="options">
        <div
          className="option danger"
          onClick={() => handleDeleteComment(comment._id)}
        >
          Delete
        </div>
        <div className="option" onClick={closeCommentOption}>
          Cancel
        </div>
      </div>
    </div>
  );
}

export default Commentoption;
