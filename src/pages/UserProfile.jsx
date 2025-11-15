import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UserProfile.css";

export default function UserProfile() {
  const navigate = useNavigate();
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const raw = localStorage.getItem(decodedName) || localStorage.getItem(decodedName + "_profile");
  let profile = null;
  try {
    profile = raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('Failed to parse profile for', decodedName, err);
    profile = null;
  }

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
          <div className="box">
            {profile && profile.aboutMe ? profile.aboutMe : profile && profile.bio ? profile.bio : "No bio available."}
          </div>
        </div>

        <div className="section">
          <h3>Past Experience</h3>
          <div className="box">
            {profile && profile.experience
              ? profile.experience
              : profile && profile.title && profile.company
              ? `${profile.title} at ${profile.company} (${profile.startDate || ''} - ${profile.endDate || ''})`
              : "No experience listed."}
          </div>
        </div>
      </div>
    </div>
  );
}
