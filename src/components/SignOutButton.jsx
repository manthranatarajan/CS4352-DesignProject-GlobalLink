import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignOutButton({ className }) {
  const navigate = useNavigate();

  const signOut = () => {
    try {
      localStorage.setItem('current_user', '');
    } catch (e) {
      console.warn('Failed to clear current_user', e);
    }
    navigate('/');
  };

  if (!localStorage.getItem('current_user')) return null;

  return (
    <button className={className || 'sign-out-btn'} onClick={signOut}>
      Sign Out
    </button>
  );
}
