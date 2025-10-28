import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UserProfile.css";

export default function UserProfile() {
  const navigate = useNavigate();
  const { name } = useParams();

  return (
    <div className="profile-page">
      {/* Green blurred background like JobFeedPage */}
      <div className="bg-circle top-left"></div>
      <div className="bg-circle bottom-right"></div>

      <div className="profile-content">
        {/* Back button */}
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>

        {/* Avatar */}
        <div className="avatar"></div>

        {/* Name */}
        <h2 className="user-name">{decodeURIComponent(name)}</h2>

        {/* Add Friend button */}
        <button className="add-btn">Add Friend?</button>

        {/* Sections */}
        <div className="section">
          <h3>Bio/About Me</h3>
          <div className="box"></div>
        </div>

        <div className="section">
          <h3>Past Experience</h3>
          <div className="box"></div>
        </div>
      </div>
    </div>
  );
}
