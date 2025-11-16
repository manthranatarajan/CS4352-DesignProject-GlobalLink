import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./UserProfile.css";

function empty(value) {
  if (value === null || value === undefined || value === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

function safeDisplay(value) {
  if (empty(value)) return "Not filled out";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Not filled out";
  return String(value);
}

export default function UserProfile() {
  const navigate = useNavigate();
  const { name } = useParams();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState("");

  // Determine which username to show: param > query/current_user
  const resolveName = () => {
    if (name) return decodeURIComponent(name);
    // fallback: if route is /current-user-profile then use current_user
    const current = localStorage.getItem("current_user");
    return current || "Unknown User";
  };

  const loadProfile = async (targetName) => {
    const decoded = targetName;
    setDisplayName(decoded);

    // Try several sources in order:
    // 1) localStorage: <name>_profile (JSON)
    // 2) localStorage: <name> (JSON)
    // 3) public/users.json (static), match by name
    // 4) fallback: minimal profile with name only

    const keyProfile = localStorage.getItem(decoded + "_profile");
    if (keyProfile) {
      try {
        const p = JSON.parse(keyProfile);
        setProfile(p);
        return;
      } catch (err) {
        console.warn("Failed to parse", decoded + "_profile", err);
      }
    }

    const keyRaw = localStorage.getItem(decoded);
    if (keyRaw) {
      try {
        const p = JSON.parse(keyRaw);
        setProfile(p);
        return;
      } catch (err) {
        // not JSON: might be legacy password stored as plain text
        // ignore and continue
      }
    }

    // Try static users.json
    try {
      const res = await fetch('/users.json');
      if (res.ok) {
        const json = await res.json();
        const found = Array.isArray(json) ? json.find(u => (u.name || '').toLowerCase() === (decoded || '').toLowerCase()) : null;
        if (found) {
          // Build a minimal profile using available static fields
          setProfile({
            username: decoded,
            firstName: decoded.split(' ')[0] || null,
            lastName: decoded.split(' ').slice(1).join(' ') || null,
            bio: found.bio || null
          });
          return;
        }
      }
    } catch (err) {
      // fetch failed — ok, we'll fallback
    }

    // final fallback: minimal object
    setProfile({ username: decoded });
  };

  useEffect(() => {
    const n = resolveName();
    loadProfile(n);

    const onStorage = (e) => {
      // If profile for displayed user changed, reload
      const changedKey = e.key;
      if (!changedKey) return;
      const target = displayName || n;
      if (changedKey === target + "_profile" || changedKey === target || changedKey === 'current_user') {
        // reload profile
        loadProfile(target);
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, location.pathname]);

  // Render a consistent field list with fallbacks
  const fields = [
    { label: 'Full name', key: () => (profile && (profile.firstName || profile.lastName)) ? [(profile.firstName || ''), (profile.lastName || '')].join(' ').trim() : profile && profile.username ? profile.username : null },
    { label: 'Username', key: () => profile && (profile.username || profile.user) ? (profile.username || profile.user) : null },
    { label: 'City', key: () => profile && profile.city ? profile.city : null },
    { label: 'State', key: () => profile && profile.state ? profile.state : null },
    { label: 'ZIP', key: () => profile && profile.zip ? profile.zip : null },
    { label: 'Age', key: () => profile && profile.age ? profile.age : null },
    { label: 'Company', key: () => profile && profile.company ? profile.company : null },
    { label: 'Job Title', key: () => profile && profile.title ? profile.title : null },
    { label: 'Work Dates', key: () => (profile && (profile.startDate || profile.endDate)) ? `${profile.startDate || 'Unknown'} - ${profile.endDate || 'Present'}` : null },
    { label: 'University', key: () => profile && profile.university ? profile.university : null },
    { label: 'Major', key: () => profile && profile.major ? profile.major : null },
    { label: 'Education Dates', key: () => (profile && (profile.eduStartDate || profile.eduEndDate)) ? `${profile.eduStartDate || 'Unknown'} - ${profile.eduEndDate || 'Present'}` : null },
    { label: 'Country', key: () => profile && profile.country ? profile.country : null },
    { label: 'Visa Type', key: () => profile && profile.visaType ? profile.visaType : null },
    { label: 'Seeking Work Authorization', key: () => profile && typeof profile.seekingWorkAuth !== 'undefined' ? profile.seekingWorkAuth : null },
    { label: 'About / Bio', key: () => profile && (profile.aboutMe || profile.bio) ? (profile.aboutMe || profile.bio) : null },
    { label: 'Projects', key: () => profile && profile.projects ? profile.projects.map(p => p.title || p).join(' | ') : null },
    { label: 'Certifications', key: () => profile && profile.certifications ? profile.certifications.map(c => c.name || c).join(' | ') : null },
    { label: 'Looking For', key: () => profile && profile.jobPreferences && profile.jobPreferences.lookingFor ? profile.jobPreferences.lookingFor : null },
    { label: 'Desired Roles', key: () => profile && profile.jobPreferences && profile.jobPreferences.desiredRoles ? profile.jobPreferences.desiredRoles : null },
    { label: 'Desired Locations', key: () => profile && profile.jobPreferences && profile.jobPreferences.desiredLocations ? profile.jobPreferences.desiredLocations : null },
    { label: 'Desired Industry', key: () => profile && profile.jobPreferences && profile.jobPreferences.desiredIndustry ? profile.jobPreferences.desiredIndustry : null },
    { label: 'Require Sponsorship', key: () => profile && profile.jobPreferences && typeof profile.jobPreferences.requireSponsorship !== 'undefined' ? profile.jobPreferences.requireSponsorship : null },
    { label: 'Followed Employers', key: () => profile && profile.followedEmployers ? profile.followedEmployers : null }
  ];

  return (
    <div className="profile-page">
      <div className="bg-circle top-left"></div>
      <div className="bg-circle bottom-right"></div>

      <div className="profile-content">
        <button className="back-btn" onClick={() => navigate('/jobs')}>←</button>

        <div className="avatar" aria-hidden="true">{ /* could render image if profile.profilePictureName exists */ }</div>

        <h2 className="user-name">{displayName || 'Unknown'}</h2>

        <div className="cards-container">
          <div className="card">
            <div className="card-title">Personal Info</div>
            <div className="card-body">
              <div className="row"><div className="label">Full name</div><div className="value">{safeDisplay(fields[0].key())}</div></div>
              <div className="row"><div className="label">Username</div><div className="value">{safeDisplay(fields[1].key())}</div></div>
              <div className="row"><div className="label">City</div><div className="value">{safeDisplay(fields[2].key())}</div></div>
              <div className="row"><div className="label">State</div><div className="value">{safeDisplay(fields[3].key())}</div></div>
              <div className="row"><div className="label">ZIP</div><div className="value">{safeDisplay(fields[4].key())}</div></div>
              <div className="row"><div className="label">Age</div><div className="value">{safeDisplay(fields[5].key())}</div></div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Work Experience</div>
            <div className="card-body">
              <div className="row"><div className="label">Company</div><div className="value">{safeDisplay(fields[6].key())}</div></div>
              <div className="row"><div className="label">Job Title</div><div className="value">{safeDisplay(fields[7].key())}</div></div>
              <div className="row"><div className="label">Work Dates</div><div className="value">{safeDisplay(fields[8].key())}</div></div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Education</div>
            <div className="card-body">
              <div className="row"><div className="label">University</div><div className="value">{safeDisplay(fields[9].key())}</div></div>
              <div className="row"><div className="label">Major</div><div className="value">{safeDisplay(fields[10].key())}</div></div>
              <div className="row"><div className="label">Education Dates</div><div className="value">{safeDisplay(fields[11].key())}</div></div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Citizenship</div>
            <div className="card-body">
              <div className="row"><div className="label">Country</div><div className="value">{safeDisplay(fields[12].key())}</div></div>
              <div className="row"><div className="label">Visa Type</div><div className="value">{safeDisplay(fields[13].key())}</div></div>
              <div className="row"><div className="label">Seeking Work Authorization</div><div className="value">{safeDisplay(fields[14].key())}</div></div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Job Preferences</div>
            <div className="card-body">
              <div className="row"><div className="label">Looking For</div><div className="value">{safeDisplay(fields[18].key())}</div></div>
              <div className="row"><div className="label">Desired Roles</div><div className="value">{safeDisplay(fields[19].key())}</div></div>
              <div className="row"><div className="label">Desired Locations</div><div className="value">{safeDisplay(fields[20].key())}</div></div>
              <div className="row"><div className="label">Desired Industry</div><div className="value">{safeDisplay(fields[21].key())}</div></div>
              <div className="row"><div className="label">Require Sponsorship</div><div className="value">{safeDisplay(fields[22].key())}</div></div>
              <div className="row"><div className="label">Followed Employers</div><div className="value">{safeDisplay(fields[23].key())}</div></div>
            </div>
          </div>

          <div className="card card-full">
            <div className="card-title">Additional</div>
            <div className="card-body">
              <div className="row"><div className="label">About / Bio</div><div className="value">{safeDisplay(fields[15].key())}</div></div>
              <div className="row"><div className="label">Projects</div><div className="value">{safeDisplay(fields[16].key())}</div></div>
              <div className="row"><div className="label">Certifications</div><div className="value">{safeDisplay(fields[17].key())}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
