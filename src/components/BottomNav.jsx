import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Helper to determine button style based on active state
  const getButtonStyle = (path) => {
    const isActive = currentPath === path || (path === "/jobs" && currentPath === "/");
    const baseStyle = "flex-1 py-4 rounded-full text-lg shadow-lg transition-colors text-white";
    const activeColor = "bg-indigo-400 hover:bg-indigo-500";
    const inactiveColor = "bg-gray-400 hover:bg-gray-500";
    
    return `${baseStyle} ${isActive ? activeColor : inactiveColor}`;
  };

  return (
    <div className="fixed bottom-8 left-6 right-6 flex justify-between gap-4 z-50">
      <button
        onClick={() => navigate("/jobs")}
        className={getButtonStyle("/jobs")}
      >
        Feed
      </button>
      <button
        onClick={() => navigate("/user-search")}
        className={getButtonStyle("/user-search")}
      >
        Search
      </button>
      <button
        onClick={() => navigate("/current-user-profile")}
        className={getButtonStyle("/current-user-profile")}
      >
        Profile
      </button>
    </div>
  );
}
