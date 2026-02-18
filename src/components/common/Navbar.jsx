import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="bg-indigo-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      
      {/* Logo / Title */}
      <h1
        className="text-xl font-semibold cursor-pointer"
        onClick={() => navigate("/")}
      >
        College Directory
      </h1>

      {/* Right Buttons */}
      <div className="flex gap-3">

        {/* Home */}
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded text-sm"
        >
          Home
        </button>

        {/* Login */}
        <button
          onClick={() => navigate("/login")}
          className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded text-sm"
        >
          Login
        </button>

        {/* Register */}
        <button
          onClick={() => navigate("/register")}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-1 rounded text-sm"
        >
          Register
        </button>

      </div>
    </div>
  );
}
