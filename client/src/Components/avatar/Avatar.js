import React from "react";
import './Avatar.scss';
import dummyImg from "../../Assets/avatar.png";

function Avatar({ src }) {
  return (
    <div className="avatar">
      <img src={src ? src : dummyImg} alt="user Avatar" />
    </div>
  );
}

export default Avatar;
