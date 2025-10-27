import React from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen relative bg-white flex items-center justify-center overflow-hidden">
			{/* soft green blobs in the background */}
			<div className="absolute -top-56 -left-56 w-[520px] h-[520px] rounded-full bg-green-100 opacity-90 filter blur-[6px]" />
			<div className="absolute -bottom-56 -right-56 w-[520px] h-[520px] rounded-full bg-green-100 opacity-90 filter blur-[6px]" />

			<div className="relative z-10 w-full max-w-sm text-center px-6">
				{/* Logo / Title */}
				<div className="flex flex-col items-center mb-12">
					{/* simple logo mark */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 64 64"
						className="w-20 h-20 mb-2"
						fill="none"
					>
						<path d="M12 36c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="#111827" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
						<path d="M20 28c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#111827" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
					</svg>

					<h1 className="text-3xl font-semibold text-gray-900">GlobalLink</h1>
				</div>

				{/* Buttons */}
				<div className="flex flex-col items-center gap-6">
					<button
						type="button"
						onClick={() => navigate('/login')}
						className="w-full bg-indigo-400 hover:bg-indigo-500 text-white text-xl font-semibold py-6 rounded-full shadow-lg transition-colors"
					>
						LOGIN
					</button>

					<button
						type="button"
						onClick={() => navigate('/signup')}
						className="w-2/3 bg-gray-500 hover:bg-gray-600 text-white text-lg py-3 rounded-full shadow-md transition-colors"
					>
						SIGN UP
					</button>
				</div>
			</div>
		</div>
	);
}

