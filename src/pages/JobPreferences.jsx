import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JobPreferences() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [preferences, setPreferences] = useState({
    lookingFor: "",
    desiredRoles: "",
    desiredLocations: "",
    desiredIndustry: "",
    requireSponsorship: false
  });

  const [employers] = useState([
    { name: "Amazon" },
    { name: "Walmart" },
    { name: "Seven-Eleven" },
    { name: "Meta" },
    { name: "Costco" },
    { name: "Microsoft" }
  ]);

  const [followedEmployers, setFollowedEmployers] = useState(
    employers.reduce((acc, emp) => ({ ...acc, [emp.name]: false }), {})
  );

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences({
      ...preferences,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const toggleFollow = (employerName) => {
    setFollowedEmployers({
      ...followedEmployers,
      [employerName]: !followedEmployers[employerName]
    });
  };

  const isStep1Complete = 
  preferences.lookingFor.trim() !== "" &&
  preferences.desiredRoles.trim() !== "" &&
  preferences.desiredLocations.trim() !== "" &&
  preferences.desiredIndustry.trim() !== "";

  const handleContinue = () => {
    console.log("Preferences:", preferences);
    console.log("Followed Employers:", followedEmployers);
    navigate('/jobs');
  };

  return (
    <div className="min-h-screen relative bg-white py-12 px-6 flex flex-col items-center">
      {/* Background blobs */}
      <div className="fixed -top-40 -left-40 w-[540px] h-[540px] rounded-full bg-green-100 opacity-90 filter blur-[6px]" />
      <div className="fixed -bottom-48 -right-48 w-[540px] h-[540px] rounded-full bg-green-100 opacity-90 filter blur-[6px]" />

      {/* Logo and title */}
      <div className="relative z-10 w-full max-w-4xl mb-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="logobox">
            <img
              src="/GlobalLink_Logo.svg"
              alt="GlobalLink Logo"
              className="w-[200px] mb-2"
            />
            <div className="logobox-text-job text-sm -mt-1 text-gray-700">Job Preferences</div>
          </div>
        </div>

        {/* Step Progress */}
        <div className="flex justify-between items-center">
          <div className={`flex-1 h-2 rounded-full ${step >= 1 ? "bg-indigo-400" : "bg-gray-300"}`}></div>
          <div className={`flex-1 h-2 rounded-full mx-2 ${step >= 2 ? "bg-indigo-400" : "bg-gray-300"}`}></div>
        </div>
        <div className="flex justify-between mt-1 text-sm text-gray-600">
          <span>Job Preferences</span>
          <span>Follow Employers</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="relative z-10 bg-white rounded-3xl shadow-lg p-10 w-full max-w-4xl">
        
        {/* Section 1: Job Preferences */}
        {step === 1 && (
          <>
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Job Preferences</h1>

            {/* what are you looking for? */}
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 font-medium">What are you looking for?</label>
              <select
                name="lookingFor"
                value={preferences.lookingFor}
                onChange={handlePreferenceChange}
                className="w-full bg-green-50 text-gray-800 rounded-xl py-4 px-6 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none appearance-none"
              >
                <option value="">Select...</option>
                <option value="full-time">Full-time Position</option>
                <option value="part-time">Part-time Position</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract Work</option>
              </select>
            </div>

            {/* Desired roles */}
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 font-medium">Desired Role(s)</label>
              <input
                name="desiredRoles"
                placeholder="e.g., Software Engineer, Data Analyst"
                value={preferences.desiredRoles}
                onChange={handlePreferenceChange}
                className="w-full bg-green-50 placeholder-gray-400 text-gray-800 rounded-xl py-4 px-6 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none"
              />
            </div>

            {/* Desired locations */}
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 font-medium">Desired Location(s)</label>
              <input
                name="desiredLocations"
                placeholder="e.g., New York, Remote, California"
                value={preferences.desiredLocations}
                onChange={handlePreferenceChange}
                className="w-full bg-green-50 placeholder-gray-400 text-gray-800 rounded-xl py-4 px-6 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none"
              />
            </div>

            {/* Desired industry */}
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 font-medium">Desired Industry</label>
              <input
                name="desiredIndustry"
                placeholder="e.g., Technology, Healthcare, Finance"
                value={preferences.desiredIndustry}
                onChange={handlePreferenceChange}
                className="w-full bg-green-50 placeholder-gray-400 text-gray-800 rounded-xl py-4 px-6 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none"
              />
            </div>

            {/* Require sponsership? (yes/no) */}
            <div className="flex items-center gap-3 mb-8">
              <input
                type="checkbox"
                name="requireSponsorship"
                id="sponsorship"
                checked={preferences.requireSponsorship}
                onChange={handlePreferenceChange}
                className="w-5 h-5 rounded border-gray-300"
              />
              <label htmlFor="sponsorship" className="text-gray-700 font-medium">
                Require Sponsorship?
              </label>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl shadow-sm transition"
              >
                Back
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl shadow-md transition"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!isStep1Complete}
                  className={`bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-xl shadow-md transition ${
                    !isStep1Complete ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* Section 2: Follow Employers */}
        {step === 2 && (
          <>
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Follow Employers</h1>

            <div className="space-y-4 mb-8">
              {employers.map((employer) => (
                <div
                  key={employer.name}
                  className="flex items-center justify-between bg-green-50 rounded-xl py-4 px-6 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)]"
                >
                  <span className="text-gray-800 font-medium text-lg">{employer.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleFollow(employer.name)}
                    className={`px-6 py-2 rounded-xl font-medium transition shadow-sm ${
                      followedEmployers[employer.name]
                        ? "bg-indigo-500 text-white hover:bg-indigo-600"
                        : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                    }`}
                  >
                    {followedEmployers[employer.name] ? "FOLLOWING" : "FOLLOW"}
                  </button>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl shadow-sm transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow-md transition"
              >
                Continue
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}