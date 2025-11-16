import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Logo({ className = 'w-32', ariaLabel = 'GlobalLink Logo' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  // Use PUBLIC_URL so the logo path works whether the app is hosted at root or a subpath
  const publicUrl = process.env.PUBLIC_URL || '';
  const img = (
    <img src={`${publicUrl}/GlobalLink_Logo.svg`} alt={ariaLabel} className={className} />
  );

  if (isHome) return img;

  return (
    <button
      type="button"
      onClick={() => navigate('/')}
      className="p-0 bg-transparent border-0 cursor-pointer"
      aria-label={`Go to home`}
    >
      {img}
    </button>
  );
}
