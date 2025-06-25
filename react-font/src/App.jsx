import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import History from './pages/History'
import SignupPage from './pages/SignupPage'
import { useEffect, useState } from 'react'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));

  // Listen for login/logout changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("user"));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path='/' element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/chat' element={isLoggedIn ? <ChatPage /> : <Navigate to='/' />} />
        <Route path='/history' element={isLoggedIn ? <History /> : <Navigate to='/' />} />
      </Routes>
    </>
  )
}

export default App;

