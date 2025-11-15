import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserSearch.css";
import Logo from "../components/Logo";

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Load users from public/users.json and localStorage profiles
  useEffect(() => {
    let mounted = true;

    // Fetch users.json from public
    fetch('/users.json')
      .then((res) => res.ok ? res.json() : [])
      .then((json) => {
        if (!mounted) return;
        const fileUsers = Array.isArray(json) ? json.map((u, i) => ({ id: u.id ?? i, name: u.name })) : [];

        // Read localStorage keys that end with _profile and derive user names
        const localProfiles = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.endsWith('_profile')) {
            const name = key.replace(/_profile$/, '');
            // assign a negative id to local entries to avoid collisions
            localProfiles.push({ id: `local-${i}`, name });
          }
        }

        // Merge and dedupe by name (case-insensitive)
        const merged = [...fileUsers, ...localProfiles];
        const deduped = [];
        const seen = new Set();
        for (const u of merged) {
          const keyName = u.name.trim().toLowerCase();
          if (!seen.has(keyName)) {
            seen.add(keyName);
            deduped.push(u);
          }
        }
        setUsers(deduped);
      })
      .catch(() => {
        // fallback: if fetch fails, try to derive from localStorage only
        const localProfiles = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.endsWith('_profile')) {
            const name = key.replace(/_profile$/, '');
            localProfiles.push({ id: `local-${i}`, name });
          }
        }
        setUsers(localProfiles);
      });

    return () => { mounted = false; };
  }, []);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="us-page">
      <header className="us-header">
        <button className="us-back" onClick={() => navigate(-1)}>←</button>
        <div className="relative z-10 w-full max-w-4xl mb-8">
          <div className="logobox">
            <Logo className="w-[200px] mb-2" />
            <div className="logobox-text text-sm -mt-1 text-gray-700">User Search</div>
          </div>
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
