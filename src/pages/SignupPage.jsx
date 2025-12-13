import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../components/Logo";
import { setProfilePicture, removeProfilePicture } from "../redux/imageSlice";
import { setCurrentUser, setCredentials, setProfile, setFullNameMapping } from "../redux/userSlice";
import { handleImageUpload } from "../utils/imageUtils";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Get profile picture from Redux
  const profilePictures = useSelector((state) => state.images.profilePictures);
  const [profilePictureBase64, setProfilePictureBase64] = useState(null);
  const [imageSize, setImageSize] = useState(null);
  const [imageError, setImageError] = useState("");
  const isEditMode = location.pathname === '/edit-profile';
  const today = new Date().toISOString().split("T")[0];
  const [isCurrentlyEnrolled, setIsCurrentlyEnrolled] = useState(false);
  const [isCurrentlyEmployed, setIsCurrentlyEmployed] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    firstName: "",
    lastName: "",
    username: "",
    city: "",
    state: "",
    zip: "",
    age: "",
    // Step 2: Work Experience
    company: "",
    title: "",
    startDate: "",
    endDate: "",
    // Step 3: Education
    university: "",
    major: "",
    eduStartDate: "",
    eduEndDate: "",
    // Step 4: Citizenship Status
    country: "",
    visaType: "",
    seekingWorkAuth: false,
    // Step 5: Additional Info
    profilePicture: null,
    aboutMe: "",
    projects: [],
    certifications: []
  });

  useEffect(() => {
    if (isEditMode) {
      const currentUser = localStorage.getItem("current_user");
      if (currentUser) {
        const profileKey = currentUser + "_profile";
        const savedProfile = localStorage.getItem(profileKey);
        if (savedProfile) {
          try {
            const p = JSON.parse(savedProfile);
            setFormData(prev => ({
              ...prev,
              ...p,
              // Ensure password is not overwritten with undefined if not present in profile
              password: prev.password 
            }));
          } catch (e) {
            console.error("Failed to load profile for editing", e);
          }
        }
      }
    }
  }, [isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper to get the current user key (either from form data or localStorage)
  const getCurrentUserKey = () => {
    if (formData.firstName && formData.lastName) {
      return formData.firstName + " " + formData.lastName;
    }
    return localStorage.getItem("current_user") || "temp_user";
  };

  // Load profile picture from Redux when component mounts or user changes
  useEffect(() => {
    const userKey = getCurrentUserKey();
    const savedImage = profilePictures[userKey];
    if (savedImage) {
      setProfilePictureBase64(savedImage);
      // Estimate size from base64 string (rough approximation)
      const sizeInBytes = (savedImage.length * 3) / 4;
      setImageSize(sizeInBytes);
    }
  }, [formData.firstName, formData.lastName, profilePictures]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await handleImageUpload(file);
      
      if (result.error) {
        setImageError(result.error);
        return;
      }

      // Save to Redux with current user key
      const userKey = getCurrentUserKey();
      dispatch(setProfilePicture({
        userId: userKey,
        base64Image: result.base64,
      }));

      setProfilePictureBase64(result.base64);
      setImageSize(result.size);
      setImageError("");
      
      // Update form data
      setFormData({ ...formData, profilePicture: file });
    } catch (error) {
      setImageError("Failed to process image");
      console.error("Image processing error:", error);
    }
  };

  const handleRemoveImage = () => {
    const userKey = getCurrentUserKey();
    
    // Remove from Redux
    dispatch(removeProfilePicture(userKey));
    
    // Clear local state
    setFormData({ ...formData, profilePicture: null });
    setProfilePictureBase64(null);
    setImageSize(null);
    setImageError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fullName = formData.firstName + " " + formData.lastName;
    
    // Save to Redux (automatically persists to localStorage via redux-persist)
    
    // 1. Set current user
    dispatch(setCurrentUser(fullName));
    
    // 2. Store credentials (only for new signups)
    if (!isEditMode) {
      dispatch(setCredentials({
        username: formData.username,
        password: formData.password
      }));
    }
    
    // 3. Set full name mapping
    dispatch(setFullNameMapping({
      username: formData.username,
      fullName: fullName
    }));
    
    // 4. Ensure profile picture is saved with the correct key (full name)
    const currentImageKey = getCurrentUserKey();
    const finalImageKey = fullName;
    
    if (profilePictureBase64) {
      if (currentImageKey !== finalImageKey) {
        dispatch(setProfilePicture({
          userId: finalImageKey,
          base64Image: profilePictureBase64,
        }));
      }
    }

    // 5. Build and save profile object
    const profile = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      age: formData.age,
      company: formData.company,
      title: formData.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      university: formData.university,
      major: formData.major,
      eduStartDate: formData.eduStartDate,
      eduEndDate: formData.eduEndDate,
      country: formData.country,
      visaType: formData.visaType,
      seekingWorkAuth: formData.seekingWorkAuth,
      aboutMe: formData.aboutMe,
      projects: formData.projects,
      certifications: formData.certifications,
      profilePictureName: formData.profilePicture ? formData.profilePicture.name : null
    };

    dispatch(setProfile({
      fullName: fullName,
      profile: profile
    }));
    
    // Keep localStorage for backwards compatibility (optional - can be removed later)
    localStorage.setItem("current_user", fullName);
    localStorage.setItem(formData.username + "_full_name", fullName);
    if (!isEditMode) {
      localStorage.setItem(formData.username + "_password", formData.password);
    }
    try {
      localStorage.setItem(fullName + "_profile", JSON.stringify(profile));
    } catch (err) {
      console.warn('Failed to save profile to localStorage', err);
    }

    console.log("Form submitted to Redux:", formData);
    
    if (isEditMode) {
      alert("Profile updated!");
      navigate('/current-user-profile');
    } else {
      alert("Account created!");
      navigate('/job-preferences');
    }
  };

  // Ensure input fields aren't empty
  const isStep1Complete =
    (formData.firstName || "").trim() !== "" &&
    (formData.lastName || "").trim() !== "" &&
    (formData.username || "").trim() !== "" &&
    (isEditMode || (formData.password || "").trim() !== "") && // Password optional in edit mode
    (formData.city || "").trim() !== "" &&
    (formData.state || "").trim() !== "" &&
    (formData.zip || "").trim() !== "" &&
    formData.age !== "";

  const isStep2Complete =
    (formData.company || "").trim() !== "" &&
    (formData.title || "").trim() !== "" &&
    formData.startDate !== "" &&
    formData.endDate !== "";

  const isStep3Complete =
    (formData.university || "").trim() !== "" &&
    (formData.major || "").trim() !== "" &&
    formData.eduStartDate !== "" &&
    formData.eduEndDate !== "";

  return (
    <div className="min-h-screen relative bg-white py-12 px-6 flex flex-col items-center">
      {/* Background blobs */}
      <div className="fixed -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-green-100 opacity-90 filter blur-[6px] blob-animation" />
      {/* Logo and title */}
      <div className="relative z-10 w-full max-w-4xl mb-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="logobox">
            <Logo className="w-[200px] mb-2" />
            <div className="logobox-text text-sm -mt-1 text-gray-700">{isEditMode ? "Edit Profile" : "Sign up"}</div>
          </div>
        </div>

        {/* Step Progress */}
        <div className="flex justify-between items-center">
          <div className={`flex-1 h-2 rounded-full ${step >= 1 ? "bg-indigo-400" : "bg-gray-300"}`}></div>
          <div className={`flex-1 h-2 rounded-full mx-2 ${step >= 2 ? "bg-indigo-400" : "bg-gray-300"}`}></div>
          <div className={`flex-1 h-2 rounded-full ${step >= 3 ? "bg-indigo-400" : "bg-gray-300"}`}></div>
          <div className={`flex-1 h-2 rounded-full mx-2 ${step >= 4 ? "bg-indigo-400" : "bg-gray-300"}`}></div>
          <div className={`flex-1 h-2 rounded-full ${step >= 5 ? "bg-indigo-400" : "bg-gray-300"}`}></div>
        </div>
        <div className="flex justify-between mt-1 text-sm text-gray-600">
          <span>Basic Info</span>
          <span>Work</span>
          <span>Education</span>
          <span>Citizenship</span>
          <span>Additional</span>
        </div>
      </div>

      {/* Form Card */}
      <form
        className="relative z-10 bg-white rounded-3xl shadow-lg p-10 w-full max-w-4xl"
        onSubmit={handleSubmit}
      >

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <>
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Basic Info</h1>

            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                name="firstName"
                placeholder="* First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-green-50 placeholder-gray-400 text-gray-800 rounded-xl py-4 px-6 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none"
                required
              />
              <input
                name="lastName"
                placeholder="* Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-green-50 placeholder-gray-400 text-gray-800 rounded-xl py-4 px-6 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none"
                required
              />
            </div>

            {/* Username */}
            <input
              name="username"
              placeholder="* Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-green-50 placeholder-gray-400 text-gray-800 rounded-xl py-4 px-6 mb-4 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none"
              required
            />

            {/* Password */}
            <input
              name="password"
              placeholder="* Password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className="w-full bg-green-50 placeholder-gray-400 text-gray-800 rounded-xl py-4 px-6 mb-4 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none"
              required
            />
            <div className="grid grid-cols-3 gap-4 mb-4">

            <input
              name="city"
              placeholder="* City"
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-green-50 placeholder-gray-400 text-gray-800 rounded-xl py-4 px-6 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none"
              required
            />
            <input
              name="state"
              placeholder="* State"
              value={formData.state}
              onChange={handleChange}
              className="w-full bg-green-50 placeholder-gray-400 text-gray-800 rounded-xl py-4 px-6 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none"
              required
            />
            <input
              name="zip"
              placeholder="* Zip"
              value={formData.zip}
              onChange={handleChange}
              className="w-full bg-green-50 placeholder-gray-400 text-gray-800 rounded-xl py-4 px-6 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none"
              required
            />
          </div>

            {/* Age */}
            <input
              name="age"
              type="number"
              placeholder="* Age"
              value={formData.age}
              onChange={handleChange}
              className="w-full bg-green-50 placeholder-gray-400 text-gray-800 rounded-xl py-4 px-6 mb-6 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none"
              required
            />

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl shadow-sm transition"
              >
                Back
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
          </>
        )}

        {/* Step 2: Work Experience */}
        {step === 2 && (
          <>
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Work Experience</h1>

            {["company", "title"].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field === "company" ? "Company" : "Job Title"}
                value={formData[field]}
                onChange={handleChange}
                className="w-full bg-green-50 placeholder-gray-400 text-gray-800 rounded-xl py-4 px-6 mb-4 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none"
                required
              />
            ))}

            <input
              name="startDate"
              type="date"
              placeholder="Start Date"
              value={formData.startDate}
              onChange={handleChange}
              max={today} 
              className="w-full bg-green-50 text-gray-800 rounded-xl py-4 px-6 mb-4 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none"
              required
            />

            <input
              name="endDate"
              type="date"
              placeholder="End Date"
              value={isCurrentlyEmployed ? today : formData.endDate}
              onChange={handleChange}
              max={today}
              disabled={isCurrentlyEmployed}
              className="w-full bg-green-50 text-gray-800 rounded-xl py-4 px-6 mb-2 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none disabled:opacity-50"
              required={!isCurrentlyEmployed}
            />

            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={isCurrentlyEmployed}
                onChange={(e) => {
                  setIsCurrentlyEmployed(e.target.checked);

                  if (e.target.checked) {
                    setFormData({ ...formData, endDate: today });
                  } else {
                    setFormData({ ...formData, endDate: "" });
                  }
                }}
              />
              <label className="text-gray-700">I currently work here</label>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl shadow-sm transition"
              >
                Back
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl shadow-md transition"
                >
                  No Work Experience
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!isStep2Complete}
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-md transition ${
                    !isStep2Complete ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* Step 3: Education */}
        {step === 3 && (
          <>
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Education</h1>

            {["university", "major"].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field === "university" ? "University" : "Major"}
                value={formData[field]}
                onChange={handleChange}
                className="w-full bg-green-50 placeholder-gray-400 text-gray-800 rounded-xl py-4 px-6 mb-4 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none"
                required
              />
            ))}

            <input
              name="eduStartDate"
              type="date"
              placeholder="Start Date"
              value={formData.eduStartDate}
              onChange={handleChange}
              max={today}
              className="w-full bg-green-50 text-gray-800 rounded-xl py-4 px-6 mb-4 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none"
              required
            />

            <input
              name="eduEndDate"
              type="date"
              placeholder="End Date"
              value={isCurrentlyEnrolled ? today : formData.eduEndDate}
              onChange={handleChange}
              max={today}
              disabled={isCurrentlyEnrolled}
              className="w-full bg-green-50 text-gray-800 rounded-xl py-4 px-6 mb-2 shadow-[0_10px_15px_-6px_rgba(0,0,0,0.12)] border border-transparent focus:outline-none disabled:opacity-50"
              required={!isCurrentlyEnrolled}
            />

            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={isCurrentlyEnrolled}
                onChange={(e) => {
                  setIsCurrentlyEnrolled(e.target.checked);

                  if (e.target.checked) {
                    setFormData({ ...formData, eduEndDate: today });
                  } else {
                    setFormData({ ...formData, eduEndDate: "" });
                  }
                }}
              />
              <label className="text-gray-700">I am currently enrolled</label>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl shadow-sm transition"
              >
                Back
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl shadow-md transition"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  disabled={!isStep3Complete}
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-md transition ${
                    !isStep3Complete ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* Step 4: Citizenship Status */}
        {step === 4 && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">Citizenship Status</h1>

            {/* Country of origin */}
            <input
            name="country"
            placeholder="* Country of Origin"
            value={formData.country}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-4"
            required
            // Autofill from the selection of countries below
            list="countries"
            />
            <datalist id="countries">
            <option value="Algeria" />
            <option value="Australia" />
            <option value="Bangladesh" />
            <option value="Brazil" />
            <option value="Canada" />
            <option value="Chile" />
            <option value="China" />
            <option value="Colombia" />
            <option value="Costa Rica" />
            <option value="Dominican Republic" />
            <option value="Ecuador" />
            <option value="Egypt" />
            <option value="France" />
            <option value="Germany" />
            <option value="Ghana" />
            <option value="Guatemala" />
            <option value="Honduras" />
            <option value="India" />
            <option value="Indonesia" />
            <option value="Iran" />
            <option value="Iraq" />
            <option value="Italy" />
            <option value="Japan" />
            <option value="Jordan" />
            <option value="Kazakhstan" />
            <option value="Kenya" />
            <option value="Mexico" />
            <option value="Morocco" />
            <option value="Nepal" />
            <option value="Nigeria" />
            <option value="Panama" />
            <option value="Pakistan" />
            <option value="Paraguay" />
            <option value="Philippines" />
            <option value="Russia" />
            <option value="Singapore" />
            <option value="South Africa" />
            <option value="South Korea" />
            <option value="Spain" />
            <option value="Sri Lanka" />
            <option value="Taiwan" />
            <option value="Thailand" />
            <option value="Turkey" />
            <option value="United Kingdom" />
            <option value="United States" />
            <option value="Uzbekistan" />
            <option value="Vietnam" />
            <option value="Saudi Arabia" />
            </datalist>

            {/* Current Visa Type */}
            <select
            name="visaType"
            value={formData.visaType}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-4"
            required
            >
            <option value="">Select Visa Type</option>
            <option value="F-1">F-1</option>
            <option value="J-1">J-1</option>
            <option value="H-1B">H-1B</option>
            <option value="OPT">OPT</option>
            <option value="CPT">CPT</option>
            <option value="Other">Other</option>
            </select>

            {/* Seeking Work Authorization */}
            <div className="flex items-center gap-4 mb-4">
            <input
                type="checkbox"
                name="seekingWorkAuth"
                checked={formData.seekingWorkAuth}
                onChange={(e) =>
                setFormData({ ...formData, seekingWorkAuth: e.target.checked })
                }
                id="workAuth"
            />
            <label htmlFor="workAuth" className="text-gray-700">
                Seeking Work Authorization
            </label>
            </div>

            <div className="flex justify-between">
            <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-gray-300 px-4 py-2 rounded"
            >
                Back
            </button>

            <div className="flex gap-2">
                <button
                type="button"
                onClick={() => setStep(5)} // skip
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                Skip
                </button>

                <button
                type="button"
                onClick={() => setStep(5)} // next
                disabled={!formData.country || !formData.visaType}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ${
                    !formData.country || !formData.visaType
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                >
                Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* Additional Info */}
        {step === 5 && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">Additional Info</h1>

            {/* Profile Picture */}
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border p-2 rounded w-full"
              />
              
              {/* Image Preview */}
              {profilePictureBase64 && (
                <div className="mt-3 relative inline-block">
                  <img
                    src={profilePictureBase64}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    title="Remove image"
                  >
                    ×
                  </button>
                  {imageSize && (
                    <p className="text-sm text-gray-600 mt-1">
                      Size: {(imageSize / 1024).toFixed(2)} KB
                    </p>
                  )}
                </div>
              )}
              
              {/* Error Message */}
              {imageError && (
                <p className="text-red-500 text-sm mt-1">{imageError}</p>
              )}
            </div>

            {/* About Me */}
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">About Me</label>
              <textarea
                name="aboutMe"
                value={formData.aboutMe}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                className="border p-2 rounded w-full"
                rows={4}
              />
            </div>

            {/* Projects */}
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Projects</label>
              {formData.projects.map((proj, index) => (
                <div key={index} className="border p-2 rounded mb-2">
                  <input
                    name="title"
                    placeholder="Project Title"
                    value={proj.title}
                    onChange={(e) => {
                      const newProjects = [...formData.projects];
                      newProjects[index].title = e.target.value;
                      setFormData({ ...formData, projects: newProjects });
                    }}
                    className="border p-1 rounded w-full mb-1"
                  />
                  <input
                    name="skills"
                    placeholder="Skills Used (comma separated)"
                    value={proj.skills}
                    onChange={(e) => {
                      const newProjects = [...formData.projects];
                      newProjects[index].skills = e.target.value;
                      setFormData({ ...formData, projects: newProjects });
                    }}
                    className="border p-1 rounded w-full mb-1"
                  />
                  <textarea
                    name="description"
                    placeholder="Project Description"
                    value={proj.description}
                    onChange={(e) => {
                      const newProjects = [...formData.projects];
                      newProjects[index].description = e.target.value;
                      setFormData({ ...formData, projects: newProjects });
                    }}
                    className="border p-1 rounded w-full mb-1"
                    rows={2}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newProjects = formData.projects.filter((_, i) => i !== index);
                      setFormData({ ...formData, projects: newProjects });
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Remove Project
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    projects: [...formData.projects, { title: "", skills: "", description: "" }]
                  })
                }
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Add Project
              </button>
            </div>

            {/* Certifications */}
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Certifications</label>
              {formData.certifications.map((cert, index) => (
                <div key={index} className="border p-2 rounded mb-2">
                  <input
                    name="name"
                    placeholder="Certification Name"
                    value={cert.name}
                    onChange={(e) => {
                      const newCerts = [...formData.certifications];
                      newCerts[index].name = e.target.value;                        
                      setFormData({ ...formData, certifications: newCerts });
                    }}
                    className="border p-1 rounded w-full mb-1"
                  />
                  <input
                    name="issuer"
                    placeholder="Certification Issuer"
                    value={cert.issuer}
                    onChange={(e) => {
                      const newCerts = [...formData.certifications];
                      newCerts[index].issuer = e.target.value;
                      setFormData({ ...formData, certifications: newCerts });
                    }}
                    className="border p-1 rounded w-full mb-1"
                  />
                  <input
                    name="number"
                    placeholder="Certification Number"
                    value={cert.number}
                    onChange={(e) => {
                      const newCerts = [...formData.certifications];
                      newCerts[index].number = e.target.value;
                      setFormData({ ...formData, certifications: newCerts });
                    }}
                    className="border p-1 rounded w-full mb-1"
                  />
                  <input
                    name="earnedDate"
                    type="date"
                    placeholder="Date Earned"
                    value={cert.earnedDate}
                    onChange={(e) => {
                      const newCerts = [...formData.certifications];
                      newCerts[index].earnedDate = e.target.value;
                      setFormData({ ...formData, certifications: newCerts });
                    }}
                    className="border p-1 rounded w-full mb-1"
                  />
                  <input
                    name="expiryDate"
                    type="date"
                    placeholder="Expiry Date"
                    value={cert.expiryDate}
                    onChange={(e) => {
                      const newCerts = [...formData.certifications];
                      newCerts[index].expiryDate = e.target.value;
                      setFormData({ ...formData, certifications: newCerts });
                    }}
                    className="border p-1 rounded w-full mb-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newCerts = formData.certifications.filter((_, i) => i !== index);
                      setFormData({ ...formData, certifications: newCerts });
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Remove Certification
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    certifications: [
                      ...formData.certifications,
                      { name: "", issuer: "", number: "", earnedDate: "", expiryDate: "" }
                    ]
                  })
                }
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Add Certification
              </button>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(6)} // next step
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 6: Review & Submit */}
        {step === 6 && (
          <>
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Review & Submit</h1>
            <p className="mb-6 text-gray-700 text-center">
              Review all your information before submitting.
            </p>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setStep(5)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl shadow-sm transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow-md transition"
              >
                Submit
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
