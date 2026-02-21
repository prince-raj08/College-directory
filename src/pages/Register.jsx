import { useState } from "react";
import { Eye, EyeOff, GraduationCap, UserCircle, Phone, Mail, User, ShieldCheck, CheckCircle2, BookOpen, Bell, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { validateRegister } from "../utils/validators.js";
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

  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // PHOTO HANDLING FIX
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
    
    // Check if photo is present because backend has @NonNull
    if (!form.profilePic) return toast.error("Kripya profile photo upload karein!");

    const errorsObj = validateRegister(form, []);
    setErrors(errorsObj);

    if (Object.keys(errorsObj).length > 0) {
      return toast.error("Form mein galtiyan hain!");
    }

    const loadToast = toast.loading("Creating account...");
    try {
      const formData = new FormData();
      
      // Manual Appending (Consistent with DTO names)
      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("password", form.password);
      formData.append("dept", form.dept);
      formData.append("year", form.year);
      formData.append("role", form.role);
      formData.append("profilePic", form.profilePic); // File object

      const roleEndpoint = form.role.toLowerCase().replace('_', '-');
      
      await axios.post(`http://localhost:8080/api/v1/${roleEndpoint}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Registration Successful! 🎓", { id: loadToast });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Upload Error:", err);
      toast.error(err.response?.data?.message || "Registration Failed", { id: loadToast });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl overflow-hidden border border-gray-100">
        
        {/* LEFT PANEL */}
        <div className="hidden md:flex md:w-[40%] bg-indigo-600 text-white p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500 rounded-full opacity-20"></div>
          <div className="relative z-10 space-y-10">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl">
                <GraduationCap size={32} className="text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">EduPortal</h2>
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-semibold leading-snug">Empowering your academic journey.</h3>
              <div className="space-y-4 pt-4">
                {[{ icon: <BookOpen size={18} />, text: "Access premium course materials" },
                  { icon: <Bell size={18} />, text: "Real-time academic announcements" },
                  { icon: <Users size={18} />, text: "Seamless Faculty communication" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm font-medium bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
                    <span className="text-indigo-200">{item.icon}</span> {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Form */}
        <div className="w-full md:w-[60%] p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-5">
            <header className="mb-6">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Get Started</h1>
              <p className="text-gray-500 text-sm mt-1">Already have an account? <span className="text-indigo-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate("/")}>Sign In</span></p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Select Role</label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select name="role" value={form.role} onChange={handleChange} className="pl-12 w-full border-2 border-gray-100 p-3 rounded-2xl bg-gray-50 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-500 appearance-none">
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
                  <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="pl-12 w-full border-2 border-gray-100 p-3 rounded-2xl text-sm font-medium outline-none focus:border-indigo-500 transition-all" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Verification</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="email" value={form.email} onChange={handleChange} disabled={isVerified} placeholder="name@college.edu" className="pl-12 w-full border-2 border-gray-100 p-3 rounded-2xl text-sm outline-none focus:border-indigo-500 disabled:bg-green-50 transition-all" />
                </div>
                {!isVerified && (
                  <button type="button" onClick={handleSendOtp} className="bg-indigo-600 text-white px-6 rounded-2xl text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all">
                    {isOtpSent ? "Resend" : "Send OTP"}
                  </button>
                )}
              </div>
              
              {isOtpSent && !isVerified && (
                <div className="flex items-center gap-3 mt-3 p-3 bg-indigo-50 rounded-2xl border border-indigo-100 animate-in slide-in-from-top-2">
                  <input maxLength={6} placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="flex-1 border-none bg-transparent text-center font-bold text-indigo-600 tracking-[0.5em] outline-none" />
                  <button type="button" onClick={handleVerifyOtp} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold hover:shadow-md transition-all">Verify</button>
                </div>
              )}
              {isVerified && <p className="text-green-600 text-xs font-bold ml-1 flex items-center gap-1"><CheckCircle2 size={14}/> Identity Verified</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Username</label>
                <input name="username" value={form.username} onChange={handleChange} className="w-full border-2 border-gray-100 p-3 rounded-2xl text-sm outline-none focus:border-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="phone" value={form.phone} onChange={handleChange} className="pl-10 w-full border-2 border-gray-100 p-3 rounded-2xl text-sm outline-none focus:border-indigo-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <input type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full border-2 border-gray-100 p-3 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-all" />
                <span onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-indigo-600">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
              <div className="relative group">
                <input type={showConfirm ? "text" : "password"} name="confirm" value={form.confirm} onChange={handleChange} placeholder="Confirm" className="w-full border-2 border-gray-100 p-3 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-all" />
                <span onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-indigo-600">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <select name="dept" value={form.dept} onChange={handleChange} className="border-2 border-gray-100 p-3 rounded-2xl text-xs font-bold bg-gray-50 outline-none focus:border-indigo-500">
                <option value="">DEPT</option>
                <option>CS</option><option>MECH</option><option>IT</option>
              </select>
              <select name="year" value={form.year} onChange={handleChange} className="border-2 border-gray-100 p-3 rounded-2xl text-xs font-bold bg-gray-50 outline-none focus:border-indigo-500">
                <option value="">YEAR</option>
                <option>1ST</option><option>2ND</option><option>3RD</option><option>4TH</option>
              </select>
              
              {/* PHOTO INPUT FIX */}
              <div className="relative border-2 border-dashed border-gray-200 rounded-2xl hover:bg-indigo-50 hover:border-indigo-300 transition-all overflow-hidden group">
                <input 
                  type="file" 
                  name="profilePic" 
                  accept="image/*"
                  onChange={handleFileChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                />
                <div className="h-full flex items-center justify-center text-[10px] font-bold text-gray-400 group-hover:text-indigo-600 text-center p-1">
                  {form.profilePic ? `Selected: ${form.profilePic.name.substring(0, 10)}...` : "ADD PHOTO"}
                </div>
              </div>
            </div>

            <button type="submit" disabled={!isVerified} className={`w-full py-4 rounded-[1.25rem] font-bold text-white transition-all shadow-xl active:scale-[0.98] ${isVerified ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"}`}>
              {isVerified ? "Create My Account" : "Please Verify Email"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}