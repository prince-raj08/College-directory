import { useState } from "react";
import { Eye, EyeOff, GraduationCap, UserCircle, Phone, Mail, User, CheckCircle2, BookOpen, Bell, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const [form, setForm] = useState({
    name: "", username: "", email: "", phone: "",
    password: "", confirm: "", dept: "", year: "",
    role: "STUDENT", profilePic: null,
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, profilePic: file });
      toast.success("Photo selected: " + file.name);
    }
  };

  const handleSendOtp = async () => {
    if (!form.email) return toast.error("Pehle email enter karein");
    const loadToast = toast.loading("Sending OTP...");
    try {
      await axios.post("http://localhost:8080/api/v1/auth/verify-email", { email: form.email });
      setIsOtpSent(true);
      toast.success("OTP Sent! 📧", { id: loadToast });
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP Error", { id: loadToast });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("OTP enter karein");
    try {
      await axios.post("http://localhost:8080/api/v1/auth/verify-otp", { email: form.email, otp });
      setIsVerified(true);
      toast.success("Verified! ✅");
    } catch (err) {
      toast.error("Invalid OTP ❌");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) return toast.error("Pehle email verify karein");
    if (form.password !== form.confirm) return toast.error("Passwords match nahi kar rahe!");
    if (!form.profilePic) return toast.error("Profile photo zaroori hai!");
    if (!form.dept) return toast.error("Department select karein!");

    const loadToast = toast.loading("Creating account...");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("password", form.password);
      formData.append("dept", form.dept);
      formData.append("year", form.role === "STUDENT" ? form.year : "N/A");
      formData.append("role", form.role);
      formData.append("profilePic", form.profilePic);

      // Endpoint mapping based on role
      const endpointMap = {
        STUDENT: 'student',
        FACULTY_MEMBER: 'faculty',
        ADMINISTRATOR: 'admin'
      };
      
      const rolePath = endpointMap[form.role];
      
      await axios.post(`http://localhost:8080/api/v1/${rolePath}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Registration Successful! 🎓", { id: loadToast });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed", { id: loadToast });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans">
      <div className="flex flex-col md:flex-row bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl overflow-hidden border border-gray-100">
        
        {/* LEFT PANEL */}
        <div className="hidden md:flex md:w-[40%] bg-indigo-600 text-white p-12 flex-col justify-between relative">
          <div className="relative z-10 space-y-10">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl text-indigo-600"><GraduationCap size={32} /></div>
              <h2 className="text-2xl font-bold">EduPortal</h2>
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-semibold leading-snug">Empowering your academic journey.</h3>
              <div className="space-y-4 pt-4">
                {[{ icon: <BookOpen size={18} />, text: "Access course materials" },
                  { icon: <Bell size={18} />, text: "Real-time announcements" },
                  { icon: <Users size={18} />, text: "Faculty communication" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm font-medium bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
                    <span className="text-indigo-200">{item.icon}</span> {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-[60%] p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-5">
            <header>
              <h1 className="text-3xl font-extrabold text-gray-900">Get Started</h1>
              <p className="text-gray-500 text-sm mt-1">Already have an account? <span className="text-indigo-600 font-semibold cursor-pointer" onClick={() => navigate("/")}>Sign In</span></p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Role</label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select name="role" value={form.role} onChange={handleChange} className="pl-12 w-full border-2 border-gray-100 p-3 rounded-2xl bg-gray-50 text-sm font-semibold appearance-none outline-none focus:border-indigo-500">
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY_MEMBER">Faculty Member</option>
                    <option value="ADMINISTRATOR">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="name" required value={form.name} onChange={handleChange} placeholder="John Doe" className="pl-12 w-full border-2 border-gray-100 p-3 rounded-2xl text-sm outline-none focus:border-indigo-500" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Verification</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="email" required type="email" value={form.email} onChange={handleChange} disabled={isVerified} placeholder="name@college.edu" className="pl-12 w-full border-2 border-gray-100 p-3 rounded-2xl text-sm outline-none focus:border-indigo-500 disabled:bg-green-50" />
                </div>
                {!isVerified && (
                  <button type="button" onClick={handleSendOtp} className="bg-indigo-600 text-white px-6 rounded-2xl text-xs font-bold hover:bg-indigo-700 transition-all">
                    {isOtpSent ? "Resend" : "Send OTP"}
                  </button>
                )}
              </div>
              {isOtpSent && !isVerified && (
                <div className="flex items-center gap-3 mt-3 p-3 bg-indigo-50 rounded-2xl border border-indigo-100 animate-pulse">
                  <input maxLength={6} placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="flex-1 border-none bg-transparent text-center font-bold text-indigo-600 tracking-[0.5em] outline-none" />
                  <button type="button" onClick={handleVerifyOtp} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold">Verify</button>
                </div>
              )}
              {isVerified && <p className="text-green-600 text-xs font-bold ml-1 flex items-center gap-1"><CheckCircle2 size={14}/> Verified</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input name="username" required value={form.username} onChange={handleChange} placeholder="Username" className="w-full border-2 border-gray-100 p-3 rounded-2xl text-sm outline-none focus:border-indigo-500" />
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input name="phone" required value={form.phone} onChange={handleChange} placeholder="Phone" className="pl-10 w-full border-2 border-gray-100 p-3 rounded-2xl text-sm outline-none focus:border-indigo-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input type={showPass ? "text" : "password"} name="password" required value={form.password} onChange={handleChange} placeholder="Password" className="w-full border-2 border-gray-100 p-3 rounded-2xl text-sm outline-none focus:border-indigo-500" />
                <span onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</span>
              </div>
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} name="confirm" required value={form.confirm} onChange={handleChange} placeholder="Confirm" className="w-full border-2 border-gray-100 p-3 rounded-2xl text-sm outline-none focus:border-indigo-500" />
                <span onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <select name="dept" required value={form.dept} onChange={handleChange} className="border-2 border-gray-100 p-3 rounded-2xl text-[10px] font-bold bg-gray-50 outline-none focus:border-indigo-500">
                <option value="">SELECT DEPT</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Biology">Biology</option>
                <option value="Economics">Economics</option>
                <option value="History">History</option>
              </select>
              
              <select name="year" disabled={form.role !== "STUDENT"} value={form.year} onChange={handleChange} className="border-2 border-gray-100 p-3 rounded-2xl text-[10px] font-bold bg-gray-50 outline-none focus:border-indigo-500 disabled:opacity-50">
                <option value="">YEAR</option>
                <option>1ST</option><option>2ND</option><option>3RD</option><option>4TH</option>
              </select>
              
              <div className="relative border-2 border-dashed border-gray-200 rounded-2xl hover:bg-indigo-50 transition-all overflow-hidden group">
                <input type="file" name="profilePic" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                <div className="h-full flex items-center justify-center text-[9px] font-bold text-gray-400 group-hover:text-indigo-600 text-center p-1">
                  {form.profilePic ? "PHOTO SET" : "ADD PHOTO"}
                </div>
              </div>
            </div>

            <button type="submit" disabled={!isVerified} className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-xl active:scale-95 ${isVerified ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
              {isVerified ? "Create My Account" : "Please Verify Email"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}