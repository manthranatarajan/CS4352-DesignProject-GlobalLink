import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import WelcomePage from './pages/welcomePage';
import LoginPage from './pages/LoginPage';
import JobFeedPage from './pages/JobFeedPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/jobs" element={<JobFeedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
