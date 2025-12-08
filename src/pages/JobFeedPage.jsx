import React from "react";
import Logo from "../components/Logo";
import SignOutButton from "../components/SignOutButton";
import { jobs } from "../jobs";

// changed the jobs to a separate file, called jobs.js

import BottomNav from "../components/BottomNav";

export default function JobFeedPage() {
  // to make the following badge work.
  const currentUser = localStorage.getItem("current_user");

  let profile = {};
  if (currentUser) {
    try {
      const raw =
        localStorage.getItem(currentUser + "_profile") ||
        localStorage.getItem(currentUser);
      profile = raw ? JSON.parse(raw) : {};
    } catch (err) {
      profile = {};
    }
  }

  const followedEmployers = profile.followedEmployers || [];
  const prefs = profile.jobPreferences || {};

  const requireSponsorshipPref = typeof prefs.requireSponsorship === "boolean" ? prefs.requireSponsorship: null;

  const desiredRoles = (prefs.desiredRoles || []).map(r => r.toLowerCase());
  const desiredLocations = (prefs.desiredLocations || []).map(l => l.toLowerCase());
  const desiredIndustries = (prefs.desiredIndustry || []).map(i => i.toLowerCase());


  return (
    <div className="min-h-screen relative bg-white">
      {/* Background blobs */}
      <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-green-100 opacity-90 filter blur-[6px] blob-animation" />
      <div className="absolute -bottom-48 -right-48 w-[700px] h-[700px] rounded-full bg-green-100 opacity-90 filter blur-[6px] blob-animation" />

      {/* Content container */}
      <div className="relative z-10 px-6 py-8">
        {/* Header with Logo and Profile */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="logobox">
              <Logo className="w-[200px] mb-2" />
              <div className="logobox-text-feed text-sm -mt-1 text-gray-700">Job Feed</div>
            </div>
          </div>

          {/* Profile Icon */}
          <div className="flex items-center gap-3">
            <button className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            </button>
            <SignOutButton className="sign-out-btn-feed" />
          </div>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-24">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-3xl p-6 shadow-lg max-w-2xl mx-auto w-full job-card">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>{job.company}</span>

                {/* follwing badge*/}
                  {followedEmployers
                    .map(e => e.toLowerCase())
                    .includes(job.company.toLowerCase()) && (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-200 text-green-800">
                        FOLLOWING
                      </span>
                  )}

                  {/* location badge */}
                  {desiredLocations.includes(job.location.toLowerCase()) && (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-200 text-blue-800">
                      Desired Location!
                    </span>
                  )}

                  {/* indstuy badge */}
                  {desiredIndustries.includes(job.industry.toLowerCase()) && (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-200 text-purple-800">
                      Desired Industry
                    </span>
                  )}

                  {/* role badge */}
                  {desiredRoles.includes(job.role.toLowerCase()) && (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800">
                      Desired Role
                    </span>
                  )}

                  {/* sponsorship match */}
                  {requireSponsorshipPref === job.requiresSponsorship && (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-200 text-red-800">
                      Sponsorship Match
                    </span>
                  )}

              </div>
              <div className="flex justify-between items-center gap-6">
              <div className="flex flex-col gap-1 flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                <div className="text-sm text-gray-600 mt-2 font-medium">
                  {job.location} • {job.industry} • {job.positionType}
              </div>

              <div className="text-sm text-gray-500">
                Sponsorship: {job.requiresSponsorship ? "Yes" : "No"}
              </div>
                </div>
                <button 
                  onClick={() => window.open(job.url, "_blank")}
                  className="bg-indigo-400 hover:bg-indigo-500 text-white px-8 py-2 rounded-full text-sm shadow-md transition-colors"
                >
                  APPLY
                
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}