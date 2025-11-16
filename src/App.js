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
//localStorage.clear();

// Local Storage setup for testing
// Use local storage to store some mock users for testing login
localStorage.setItem("Jane Doe_password", "12");
localStorage.setItem("John Paul_password", "34");
localStorage.setItem("Alice Land_password", "56");
localStorage.setItem("Bob Stark_password", "78");
localStorage.setItem("Charlie Brown_password", "90");

// Use local storage to connect username with full name;
localStorage.setItem("Jane Doe_full_name", "Jane Doe");
localStorage.setItem("John Paul_full_name", "John Paul");
localStorage.setItem("Alice Land_full_name", "Alice Land");
localStorage.setItem("Bob Stark_full_name", "Bob Stark");
localStorage.setItem("Charlie Brown_full_name", "Charlie Brown");

// Use local storage to store mock profiles
localStorage.setItem("Jane Doe_profile", JSON.stringify({
    firstName: "Jane",
    lastName: "Doe",
    username: "Jane Doe",
    city: "New York City",
    state: "New York",
    zip: "11222",
    age: "22",
    // work
    company: "Intel",
    title: "Intern Software Engineer",
    startDate: "19/5/2022",
    endDate: "16/8/2022",
    // education
    university: "New York University",
    major: "Software Engineering",
    eduStartDate: "19/8/2019",
    eduEndDate: "14/5/2023",
    // citizenship
    country: "Greece",
    visaType: "F-1",
    seekingWorkAuth: true,
    // additional
    aboutMe: "Hi, I'm Jane! I love hiking and exploring outdoor adventures.",
    projects: [],
    certifications: [],
    // profile picture (store filename if available)
    profilePictureName: null
}));

localStorage.setItem("John Paul_profile", JSON.stringify({
    firstName: "John",
    lastName: "Paul",
    username: "John Paul",
    city: "Jersey City",
    state: "New Jersey",
    zip: "07097",
    age: "24",
    // work
    company: "La Pasta",
    title: "Server",
    startDate: "10/4/2017",
    endDate: "15/5/2019",
    // education
    university: "Rutgers University",
    major: "Culinary",
    eduStartDate: "16/1/2015",
    eduEndDate: "19/12/2019",
    // citizenship
    country: "Brazil",
    visaType: "F-1",
    seekingWorkAuth: true,
    // additional
    aboutMe: "Hello, I am John and I enjoy cooking.",
    projects: [],
    certifications: [],
    // profile picture (store filename if available)
    profilePictureName: null
}));

localStorage.setItem("Alice Land_profile", JSON.stringify({
    firstName: "Alice",
    lastName: "Land",
    username: "Alice Land",
    city: "Lihue",
    state: "Hawaii",
    zip: "96753",
    age: "29",
    // work
    company: "Kaua’i Community College",
    title: "Student Researcher",
    startDate: "5/7/2022",
    endDate: "15/9/2024",
    // education
    university: "Kaua’i Community College",
    major: "Marine Biology",
    eduStartDate: "17/5/2020",
    eduEndDate: "12/5/2022",
    // citizenship
    country: "New Zealand",
    visaType: "F-1",
    seekingWorkAuth: true,
    // additional
    aboutMe: "I am Alice and I am a student researching marine biology.",
    projects: [],
    certifications: [],
    // profile picture (store filename if available)
    profilePictureName: null
}));

localStorage.setItem("Bob Stark_profile", JSON.stringify({
    firstName: "Bob",
    lastName: "Stark",
    username: "Bob Stark",
    city: "Dallas",
    state: "Texas",
    zip: "75021",
    age: "21",
    // work
    company: "",
    title: "",
    startDate: "",
    endDate: "",
    // education
    university: "University of Texas at Dallas",
    major: "Engineering",
    eduStartDate: "8/8/2022",
    eduEndDate: "19/5/2026",
    // citizenship
    country: "Italy",
    visaType: "M-1",
    seekingWorkAuth: false,
    // additional
    aboutMe: "Hi, I am Bob. I love gaming and tech reviews.",
    projects: [],
    certifications: [],
    // profile picture (store filename if available)
    profilePictureName: null
}));

localStorage.setItem("Charlie Brown_profile", JSON.stringify({
    firstName: "Charlie",
    lastName: "Brown",
    username: "Charlie Brown",
    city: "San Jose",
    state: "California",
    zip: "95155",
    age: "26",
    // work
    company: "",
    title: "",
    startDate: "",
    endDate: "",
    // education
    university: "University of San Jose",
    major: "Information Technology",
    eduStartDate: "15/1/2016",
    eduEndDate: "19/5/2021",
    // citizenship
    country: "Canada",
    visaType: "M-1",
    seekingWorkAuth: false,
    // additional
    aboutMe: "Charlie here! I repair computers and gadgets.",
    projects: [],
    certifications: [],
    // profile picture (store filename if available)
    profilePictureName: null
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
