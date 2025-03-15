import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:8081/api/user/register", {
        username,
        password,
      });
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      alert("Registration failed!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-r from-green-500 to-blue-500 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Register</h2>

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
          onClick={handleRegister}
          className="w-full py-2 mb-2 rounded text-white font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          Register
        </button>

        <p className="text-center text-gray-600 mt-2">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-500 font-bold hover:text-green-600 cursor-pointer"
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;