import React, {useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UserProfile.css";

export default function UserProfile() {
  const navigate = useNavigate();
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const raw = localStorage.getItem(decodedName) || localStorage.getItem(decodedName + "_profile");
  const [isPending, setIsPending] = useState(false);
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

        {/* Age, City, State */}
        {profile && (
          <p className="user-location">
            {profile.age ? `${profile.age} years old` : ""}
            {profile.city || profile.state ? " • " : ""}
            {profile.city ? profile.city : ""}
            {profile.city && profile.state ? ", " : ""}
            {profile.state ? profile.state : ""}
          </p>
        )}

        {/* Sign out button*/}
        <button className="sign-out-btn" onClick={() => {
            // Perform Sign Out Logic
            localStorage.setItem("current_user", "");
            navigate('/');
          }
        }>
          Sign Out
        </button>

        {/* Bio/About Me */}
        <div className="section">
          <h3>Bio/About Me</h3>
          <div className="box">
            {profile && profile.aboutMe ? profile.aboutMe : profile && profile.bio ? profile.bio : "No bio available."}
          </div>
        </div>

        {/* Past Experience */}
        <div className="section">
          <h3>Past Experience</h3>
          <div className="box">
            {profile && (profile.company || profile.experience) ? (
              <div>
                {profile.title && <strong>{profile.title}</strong>}
                {profile.company && <> at {profile.company}</>}
                <br />
                {(profile.startDate || profile.endDate) && (
                  <span>
                    {profile.startDate} – {profile.endDate || "Present"}
                  </span>
                )}
              </div>
            ) : (
              "No experience listed."
            )}
          </div>
        </div>
        {/* Education */}
        <div className="section">
          <h3>Education</h3>
          <div className="box">
            {profile && profile.university ? (
              <div>
                <strong>{profile.university}</strong>
                <br />
                {profile.major && <span>Major: {profile.major}</span>}
                <br />
                {(profile.eduStartDate || profile.eduEndDate) && (
                  <span>
                    {profile.eduStartDate} – {profile.eduEndDate || "Present"}
                  </span>
                )}
              </div>
            ) : (
              "No education listed."
            )}
          </div>
        </div>
        {/* Certificates */}
        <div className="section">
          <h3>Certificates</h3>
          <div className="box">
            {profile && profile.certifications && profile.certifications.length > 0 ? (
              profile.certifications.map((cert, i) => (
                <div key={i} className="certificate-item">
                  <strong>{cert.name}</strong> — {cert.issuer}
                  <br />
                  Earned: {cert.earnedDate || "N/A"}
                  {cert.expiryDate && <> • Expires: {cert.expiryDate}</>}
                  <hr />
                </div>
              ))
            ) : (
              "No certificates listed."
            )}
          </div>
        </div>
        {/* Projects */}
        <div className="section">
          <h3>Projects</h3>
          <div className="box">
            {profile && profile.projects && profile.projects.length > 0 ? (
              profile.projects.map((proj, i) => (
                <div key={i} className="project-item">
                  <strong>{proj.title}</strong>
                  {proj.skills && <p className="skills">Skills: {proj.skills}</p>}
                  {proj.description && <p className="description">{proj.description}</p>}
                  <hr />
                </div>
              ))
            ) : (
              "No projects listed."
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
