import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserSearch.css";

const FAKE_USERS = [
  { id: 1, name: "Lee, Hyung" },
  { id: 2, name: "Amina Johnson" },
  { id: 3, name: "Carlos Perez" },
  { id: 4, name: "Sara Kim" },
  { id: 5, name: "Mohammed Ali" },
  { id: 6, name: "Tony Smith" }
];

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = FAKE_USERS.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="us-page">
      <header className="us-header">
        <button className="us-back" onClick={() => navigate(-1)}>←</button>
        <div className="us-logo">
          <div className="brand">GlobalLink</div>
          <div className="sub">User Search</div>
        </div>
      </header>

      <input
        className="us-search-input"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="us-list">
        {filtered.map((u) => (
          <div
  key={u.id}
  className="us-card"
  onClick={() => navigate(`/profile/${encodeURIComponent(u.name)}`)}
>
  <div className="us-avatar">👤</div>
  <div className="us-name">{u.name}</div>
</div>
        ))}
      </div>
    </div>
  );
}
