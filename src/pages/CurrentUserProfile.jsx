import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

export default function UserProfile() {
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      {/* Green blurred background like JobFeedPage */}
      <div className="bg-circle top-left"></div>
      <div className="bg-circle bottom-right"></div>

      <div className="profile-content">
        {/* Back button */}
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>

        {/* Sign out button*/}
        <button className="sign-out-btn" onClick={() => {
            // Perform Sign Out Logic
            localStorage.setItem("current_user", "");
            navigate('/');
          }
        }>
          Sign Out
        </button>

        {/* Avatar */}
        <div className="avatar"></div>

        {/* Name */}
        <h2 className="user-name">{localStorage.getItem("current_user")}</h2>

        {/* Sections */}
        <div className="section">
          <h3>Bio/About Me</h3>
          <div className="box">
            {JSON.parse(localStorage.getItem(localStorage.getItem("current_user") + "_profile")).bio}
          </div>
        </div>

        <div className="section">
          <h3>Past Experience</h3>
          <div className="box">
            {JSON.parse(localStorage.getItem(localStorage.getItem("current_user") + "_profile")).experience}
          </div>
        </div>
      </div>
    </div>
  );
}