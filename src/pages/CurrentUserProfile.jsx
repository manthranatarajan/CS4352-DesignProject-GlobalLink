import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

export default function CurrentUserProfile() {
  const navigate = useNavigate();

  useEffect(() => {
    const current = localStorage.getItem("current_user");
    if (current && current.trim() !== "") {
      // Redirect to the unified profile route which renders the full profile UI
      navigate(`/profile/${encodeURIComponent(current)}`);
    } else {
      // No current user; go back to home
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}