import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8081/api/user/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("username", username);
      navigate("/trade");
    } catch (error) {
      alert("Login failed!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Login</h2>

        <label className="block mb-2 text-gray-600 font-semibold">Username</label>
        <input
          type="text"
          placeholder="Enter username"
          className="mb-4 w-full px-4 py-2 border border-gray-300 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block mb-2 text-gray-600 font-semibold">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          className="mb-6 w-full px-4 py-2 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full py-2 mb-2 rounded text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        > Log In </button>

        <p className="text-center text-gray-600 mt-2">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-500 font-bold hover:text-indigo-600 cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;