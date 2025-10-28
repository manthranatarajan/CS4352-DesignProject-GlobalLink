import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import WelcomePage from './pages/welcomePage';
import LoginPage from './pages/LoginPage';
import JobFeedPage from './pages/JobFeedPage';
import UserSearch from './pages/UserSearch';  
import JobPreferences from './pages/JobPreferences';  

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/jobs" element={<JobFeedPage />} />
        <Route path="/user-search" element={<UserSearch />} />
        <Route path="/job-preferences" element={<JobPreferences />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
