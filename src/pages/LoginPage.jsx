import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Perform Login Logic
    if(username !== "" && password !== ""){
      if(localStorage.getItem(username) === password){
        // Current user set in Local Storage
        localStorage.setItem("current_user", username);
        navigate('/jobs');
      } else {
        alert("Invalid username or password");
      }
    }
  };

  return (
    <div className="min-h-screen relative bg-white flex items-start justify-center overflow-hidden py-12">
      {/* background blobs */}
      <div className="absolute -top-40 -left-40 w-[540px] h-[540px] rounded-full bg-green-100 opacity-90 filter blur-[6px]" />
      <div className="absolute -bottom-48 -right-48 w-[540px] h-[540px] rounded-full bg-green-100 opacity-90 filter blur-[6px]" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo + title top-left */}
        <div className="flex items-center gap-3 mb-8">
          <Logo className="w-[200px] mb-2" />
          <div className="logobox-text text-sm -mt-1 text-gray-700">Sign in</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              name="username"
              placeholder="Username"
              className="w-full bg-green-50 placeholder-gray-400 text-gray-800 rounded-xl py-4 px-6 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full bg-green-50 placeholder-gray-400 text-gray-800 rounded-xl py-4 px-6 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="text-right mt-2">
              <button type="button" className="text-sm text-gray-600 hover:underline">forgot password?</button>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-indigo-400 hover:bg-indigo-500 text-white text-2xl font-semibold py-6 rounded-xl shadow-lg transition-colors"
            >
              Proceed
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-gray-800">
          <span className="text-sm">Dont have an account? </span>
          <button
            onClick={() => navigate('/signup')}
            className="ml-1 text-sm underline"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
