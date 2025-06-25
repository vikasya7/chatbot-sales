import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';  

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/login", {
        username,
        password,
      });

      console.log(res.data);

      //  Save user to localStorage
      localStorage.setItem("user", JSON.stringify({ username }));

      //  Redirect
      navigate("/chat");
    } catch (err) {
      console.error("Login Error:", err);
      const msg = err.response?.data?.error || "Login failed";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="mt-3 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 underline">Signup here</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

