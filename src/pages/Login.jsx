import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "STUDENT", // Default match with first option
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    let apiUrl = "";
    if (form.role === "STUDENT") apiUrl = "http://localhost:8080/api/v1/student/login";
    else if (form.role === "FACULTY_MEMBER") apiUrl = "http://localhost:8080/api/v1/faculty/login";
    else if (form.role === "ADMINISTRATOR") apiUrl = "http://localhost:8080/api/v1/admin/login";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Invalid Credentials ❌");
        return;
      }

      // ✅ FIX: Aapka backend 'Id' (Capital I) bhej raha hai
      // Isliye hum data.Id save kar rahe hain taaki profile page ko id mil sake
      sessionStorage.setItem("user", JSON.stringify({ 
        id: data.Id, 
        role: data.role || form.role 
      }));

      toast.success("Login Successful ✅");

      // ✅ Navigation
      if (form.role === "STUDENT") navigate("/students");
      else if (form.role === "FACULTY_MEMBER") navigate("/faculty");
      else if (form.role === "ADMINISTRATOR") navigate("/admin");
      
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Server Error ❌");
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <form onSubmit={handleLogin} className="bg-white shadow p-8 rounded w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        <input
          type="email" name="email" value={form.email} onChange={handleChange}
          className="border p-2 w-full mb-3 rounded" placeholder="Email" required
        />
        <input
          type="password" name="password" value={form.password} onChange={handleChange}
          className="border p-2 w-full mb-3 rounded" placeholder="Password" required
        />
        <select
          name="role" value={form.role} onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
        >
          <option value="STUDENT">STUDENT</option>
          <option value="FACULTY_MEMBER">FACULTY_MEMBER</option>
          <option value="ADMINISTRATOR">ADMINISTRATOR</option>
        </select>
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded transition">
          Login
        </button>
      </form>
    </div>
  );
}