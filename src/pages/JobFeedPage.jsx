import React from "react";
import { useNavigate } from "react-router-dom";

// Sample job data - in a real app, this would come from an API
const SAMPLE_JOBS = [
  {
    company: "AMAZON INC.",
    title: "Shelf Stocker",
    applyUrl: "www.stock.amazon.com/texas-apply-stock"
  },
  {
    company: "SEVEN ELEVEN",
    title: "Front-End Developer",
    applyUrl: "www.sevenelevenco.com/apply-frontend-dev-international"
  },
  {
    company: "WALMART INC.",
    title: "Cashier",
    applyUrl: "www.walmart.com/apply-cashier"
  }
];

export default function JobFeedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-white">
      {/* Background blobs */}
      <div className="absolute -top-40 -left-40 w-[540px] h-[540px] rounded-full bg-green-100 opacity-90 filter blur-[6px]" />
      <div className="absolute -bottom-48 -right-48 w-[540px] h-[540px] rounded-full bg-green-100 opacity-90 filter blur-[6px]" />

      {/* Content container */}
      <div className="relative z-10 px-6 py-8">
        {/* Header with Logo and Profile */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-12 h-12">
              <path d="M12 36c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="#111827" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M20 28c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#111827" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <div>
              <h1 className="text-2xl font-light text-gray-900">GlobalLink</h1>
              <div className="text-sm -mt-1 text-gray-700">Job Feed</div>
            </div>
          </div>

          {/* Profile Icon */}
          <button className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>

        {/* Job Cards */}
        <div className="space-y-4 mb-24">
          {SAMPLE_JOBS.map((job, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="text-sm text-gray-500 mb-1">{job.company}</div>
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                <button 
                  onClick={() => window.open(`https://${job.applyUrl}`, '_blank')}
                  className="bg-indigo-400 hover:bg-indigo-500 text-white px-8 py-2 rounded-full text-sm shadow-md transition-colors"
                >
                  APPLY
                </button>
              </div>
              <div className="mt-2">
                <a 
                  href={`https://${job.applyUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:underline"
                >
                  {job.applyUrl}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-8 left-6 right-6 flex justify-between gap-4 z-20">
          <button className="flex-1 bg-indigo-400 hover:bg-indigo-500 text-white py-4 rounded-full text-lg shadow-lg transition-colors">
            Feed
          </button>
          <button className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-4 rounded-full text-lg shadow-lg transition-colors">
            Search
          </button>
          <button className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-4 rounded-full text-lg shadow-lg transition-colors">
            Profile
          </button>
        </div>
      </div>
    </div>
  );
}