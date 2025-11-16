import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import SignOutButton from "../components/SignOutButton";

export default function JobPreferences() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const ROLE_OPTIONS = ["Software Engineer", "Data Analyst", "Web Developer", "Cybersecurity", "Product Manager"];
  const LOCATION_OPTIONS = ["Dallas", "Plano", "Frisco", "Allen", "Richardson"];
  const INDUSTRY_OPTIONS = ["Virtual Reality", "WebDev", "Backend", "Retail", "Marketing"]; 
  
  const [preferences, setPreferences] = useState({
    lookingFor: "",
    desiredRoles: [],
    desiredLocations: [],
    desiredIndustry: [],
    requireSponsorship: false
  });

  const [employers] = useState([
    { name: "Amazon" },
    { name: "Walmart" },
    { name: "Seven-Eleven" },
    { name: "Meta" },
    { name: "Costco" },
    { name: "Valve" },
    { name: "Microsoft" },
    { name: "HCI INC." },
    { name: "The Commuters" }
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
  preferences.desiredRoles.length > 0 &&
  preferences.desiredLocations.length > 0 &&
  preferences.desiredIndustry.length > 0;

  const handleContinue = () => {
    console.log("Preferences:", preferences);
    console.log("Followed Employers:", followedEmployers);

    // Persist preferences into the current user's profile in localStorage
    try {
      const current = localStorage.getItem('current_user');
      if (current) {
        const key = current + '_profile';
        const raw = localStorage.getItem(key) || localStorage.getItem(current);
        let profile = {};
        if (raw) {
          try { profile = JSON.parse(raw); } catch (e) { profile = {}; }
        }

        profile.jobPreferences = preferences;
        profile.followedEmployers = Object.keys(followedEmployers).filter(k => followedEmployers[k]);

        localStorage.setItem(key, JSON.stringify(profile));
        // keep username key in sync (some code reads either key)
        try { localStorage.setItem(current, JSON.stringify(profile)); } catch (e) {}
      }
    } catch (err) {
      console.warn('Failed to save job preferences', err);
    }

    navigate('/jobs');
  };

const togglePill = (category, value) => {
  setPreferences((prev) => {
    const arr = prev[category];
    const exists = arr.includes(value);
    const updated = exists ? arr.filter((v) => v !== value) : [...arr, value];
    return { ...prev, [category]: updated };
  });
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
            <Logo className="w-[200px] mb-2" />
            <div className="logobox-text-job text-sm -mt-1 text-gray-700">Job Preferences</div>
          </div>
        </div>

        <SignOutButton className="sign-out-btn" />

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
              <div className="flex flex-wrap gap-2">
                {ROLE_OPTIONS.map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => togglePill("desiredRoles", role)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      preferences.desiredRoles.includes(role)
                        ? "bg-indigo-500 text-white border-indigo-500"
                        : "bg-green-50 text-gray-700 border-gray-300"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Desired locations */}
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 font-medium">Desired Location(s)</label>
              <div className="flex flex-wrap gap-2">
                {LOCATION_OPTIONS.map(loc => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => togglePill("desiredLocations", loc)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      preferences.desiredLocations.includes(loc)
                        ? "bg-indigo-500 text-white border-indigo-500"
                        : "bg-green-50 text-gray-700 border-gray-300"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Desired industry */}
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 font-medium">Desired Industry</label>
              <div className="flex flex-wrap gap-2">
                {INDUSTRY_OPTIONS.map(ind => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => togglePill("desiredIndustry", ind)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      preferences.desiredIndustry.includes(ind)
                        ? "bg-indigo-500 text-white border-indigo-500"
                        : "bg-green-50 text-gray-700 border-gray-300"
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
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