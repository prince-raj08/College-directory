import { useState } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { validateRegister } from "../utils/validators.js";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    dept: "",
    year: "",
    profilePic: null,
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorsObj = validateRegister(form, []);
    setErrors(errorsObj);

    if (Object.keys(errorsObj).length === 0) {
      try {
        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("username", form.username);
        formData.append("email", form.email);
        formData.append("phone", form.phone);
        formData.append("password", form.password);
        formData.append("dept", form.dept);
        formData.append("year", form.year);
        formData.append("profilePic", form.profilePic);

        await axios.post(
          "http://localhost:8080/api/v1/student/register",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success("Registration Successful 🎓");

        setForm({
          name: "",
          username: "",
          email: "",
          phone: "",
          password: "",
          confirm: "",
          dept: "",
          year: "",
          profilePic: null,
        });

        setTimeout(() => navigate("/"), 1500);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Registration Failed");
      }
    } else {
      toast.error("Please fix form errors");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden">

        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-between bg-indigo-600 text-white p-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <GraduationCap size={40} />
              <h2 className="text-3xl font-bold">College Portal</h2>
            </div>

            <p className="text-sm opacity-90">
              Register once and manage your academic journey securely.
            </p>

            <ul className="text-sm space-y-2">
              <li>✔ Courses & Materials</li>
              <li>✔ Attendance Tracking</li>
              <li>✔ Announcements</li>
              <li>✔ Faculty Connect</li>
            </ul>
          </div>

          <p className="text-xs opacity-80 italic">
            “Education is the future.”
          </p>
        </div>

        {/* RIGHT FORM */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <h1 className="text-2xl font-bold text-center">
            Student Registration
          </h1>

          {["name", "username", "email", "phone"].map((field) => (
            <div key={field}>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-red-500 text-xs">{errors[field]}</p>
            </div>
          ))}

          {/* PROFILE PICTURE */}
          <div>
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];

                if (!file) {
                  setErrors({ ...errors, profilePic: "Profile picture is required" });
                  return;
                }

                const sizeInKB = file.size / 1024;

                if (sizeInKB < 30) {
                  setErrors({ ...errors, profilePic: "Image must be at least 30KB" });
                  return;
                }

                if (sizeInKB > 500) {
                  setErrors({ ...errors, profilePic: "Image must not exceed 500KB" });
                  return;
                }

                setErrors({ ...errors, profilePic: "" });
                setForm({ ...form, profilePic: file });
              }}
              className="w-full border p-3 rounded-xl bg-white"
            />
            <p className="text-red-500 text-xs">{errors.profilePic}</p>
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border p-3 rounded-xl pr-10 focus:ring-2 focus:ring-indigo-500"
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 cursor-pointer"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
            <p className="text-red-500 text-xs">{errors.password}</p>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full border p-3 rounded-xl pr-10 focus:ring-2 focus:ring-indigo-500"
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 cursor-pointer"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
            <p className="text-red-500 text-xs">{errors.confirm}</p>
          </div>

          {/* DEPARTMENT */}
          <select
            name="dept"
            value={form.dept}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          >
            <option value="">Department</option>
            <option>Computer Science</option>
            <option>Mechanical</option>
            <option>Electronics</option>
            <option>Mathematics</option>
            <option>Information Technology</option>
            <option>Civil</option>
          </select>
          <p className="text-red-500 text-xs">{errors.dept}</p>

          {/* YEAR */}
          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          >
            <option value="">Year</option>
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
          </select>
          <p className="text-red-500 text-xs">{errors.year}</p>

          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}