import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import WelcomePage from './pages/welcomePage';
import LoginPage from './pages/LoginPage';
import JobFeedPage from './pages/JobFeedPage';
import UserSearch from './pages/UserSearch';  
import UserProfile from './pages/UserProfile'; 
import JobPreferences from './pages/JobPreferences';
import CurrentUserProfile from './pages/CurrentUserProfile'; 

// Clear Local Storage for testing purposes
// localStorage.clear();

// Local Storage setup for testing
// Use local storage to store some mock users for testing login
localStorage.setItem("Jane Doe", "12");
localStorage.setItem("John Paul", "34");
localStorage.setItem("Alice Land", "56");
localStorage.setItem("Bob Stark", "78");
localStorage.setItem("Charlie Brown", "90");

// Use local storage to store mock profiles
localStorage.setItem("Jane Doe_profile", JSON.stringify({
    bio: "Hi, I'm Jane! I love hiking and exploring outdoor adventures.",
    experience: "Intern Software Engineer at Intel (2018)"
}));

localStorage.setItem("John Paul_profile", JSON.stringify({
    bio: "Hello, I am John and I enjoy cooking.",
    experience: "Server at La Pasta (2017-2019)"
}));

localStorage.setItem("Alice Land_profile", JSON.stringify({
    bio: "I am Alice and I am a student researching data science.",
    experience: "Student Researcher at University Lab (2019-2021)"
}));

localStorage.setItem("Bob Stark_profile", JSON.stringify({
    bio: "Hi, I am Bob. I am passionate about photography and travel.",
    experience: "Photographer at CVS (2016-2018)"
}));

localStorage.setItem("Charlie Brown_profile", JSON.stringify({
    bio: "Charlie here! I love gaming and tech reviews.",
    experience: "School IT Assistant (2015-2017)"
}));

// User search data
localStorage.setItem("Lee, Hyung", JSON.stringify({
    bio: "Bio for Lee, Hyung",
    experience: "Experience for Lee, Hyung"
}));
localStorage.setItem("Amina Johnson", JSON.stringify({
    bio: "Bio for Amina Johnson",
    experience: "Experience for Amina Johnson"
}));
localStorage.setItem("Carlos Perez", JSON.stringify({
    bio: "Bio for Carlos Perez",
    experience: "Experience for Carlos Perez"
}));
localStorage.setItem("Sara Kim", JSON.stringify({
    bio: "Bio for Sara Kim",
    experience: "Experience for Sara Kim"
}));
localStorage.setItem("Mohammed Ali", JSON.stringify({
    bio: "Bio for Mohammed Ali",
    experience: "Experience for Mohammed Ali"
}));
localStorage.setItem("Tony Smith", JSON.stringify({
    bio: "Bio for Tony Smith",
    experience: "Experience for Tony Smith"
}));


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/jobs" element={<JobFeedPage />} />
        <Route path="/user-search" element={<UserSearch />} />
        <Route path="/profile/:name" element={<UserProfile />} /> 
        <Route path="/job-preferences" element={<JobPreferences />} />
        <Route path="/current-user-profile" element={<CurrentUserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
