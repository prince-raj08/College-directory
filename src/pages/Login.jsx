import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogIn, Mail, Lock, UserCircle, ChevronRight, X, KeyRound, ShieldCheck, Send } from "lucide-react"; 

export default function Login() {
  const navigate = useNavigate();
  
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState({ password: "", confirm: "" });

  const [form, setForm] = useState({ email: "", password: "", role: "STUDENT" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetModal = () => {
    setIsOtpSent(false);
    setIsOtpVerified(false);
    setResetEmail("");
    setOtp("");
    setNewPassword({ password: "", confirm: "" });
  };

  // --- Reset Handlers ---
  const handleSendOtp = async () => {
    if (!resetEmail) return toast.error("Please enter email first");
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      if (res.ok) {
        setIsOtpSent(true);
        toast.success("OTP sent! Check your inbox 📧");
      } else { toast.error("User not found!"); }
    } catch (err) { toast.error("Server Error"); }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP first");
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp: otp }),
      });
      if (res.ok) {
        setIsOtpVerified(true);
        toast.success("OTP Verified! Set new password.");
      } else { toast.error("Invalid OTP ❌"); }
    } catch (err) { toast.error("Verification failed"); }
  };

  const handleFinalReset = async (e) => {
    e.preventDefault();
    if (newPassword.password !== newPassword.confirm) return toast.error("Passwords don't match!");
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, password: newPassword.password }),
      });
      if (res.ok) {
        toast.success("Password Updated!");
        setShowForgotModal(false);
        resetModal();
      }
    } catch (err) { toast.error("Reset failed"); }
  };

  // --- FINAL FIXED LOGIN HANDLER ---
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Formatting role: "FACULTY_MEMBER" -> "faculty-member"
    const rolePath = form.role.toLowerCase().replace('_', '-');
    let apiUrl = `http://localhost:8080/api/v1/${rolePath}/login`;

    const loadToast = toast.loading("Authenticating...");
    
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      // Response text handle kar rahe hain in case JSON empty ho
      const data = await response.json();

      if (!response.ok) {
        toast.dismiss(loadToast);
        return toast.error(data.message || "Invalid Credentials");
      }

      // Check if ID exists (Backend uses capital 'Id')
      if (!data.Id && !data.id) {
        toast.dismiss(loadToast);
        return toast.error("Invalid server response: No User ID");
      }

      // Pure response ko store kar rahe hain taaki dashboard par name/email mil sake
      const userData = { ...data, role: form.role };
      sessionStorage.setItem("user", JSON.stringify(userData));
      
      toast.success(`Welcome back, ${data.name || 'User'}!`, { id: loadToast });

      // Small delay for toast visibility before navigating
      setTimeout(() => {
        const userRole = form.role.toUpperCase();
        if (userRole === "STUDENT") {
          navigate("/students");
        } else if (userRole === "FACULTY_MEMBER") {
          navigate("/faculty");
        } else if (userRole === "ADMINISTRATOR") {
          navigate("/admin");  
        } else {
          navigate("/"); 
        }
      }, 500);

    } catch (error) {
      toast.error("Connection Refused. Is backend running?", { id: loadToast });
      console.error("Login error:", error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 p-6">
      
      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Account Recovery</h3>
              <button onClick={() => { setShowForgotModal(false); resetModal(); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 ml-1">Email Address</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      disabled={isOtpSent}
                      type="email" placeholder="Enter email"
                      className="w-full pl-9 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm disabled:opacity-60"
                      value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleSendOtp}
                    disabled={isOtpSent}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:bg-gray-400 transition-all flex items-center gap-1 shrink-0"
                  >
                    <Send className="w-3 h-3" /> {isOtpSent ? "Sent" : "Send OTP"}
                  </button>
                </div>
              </div>

              {isOtpSent && (
                <div className="space-y-1 animate-in slide-in-from-top-2">
                  <label className="text-xs font-bold text-gray-500 ml-1">Enter OTP</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        disabled={isOtpVerified}
                        type="text" placeholder="6-digit OTP" maxLength="6"
                        className="w-full pl-9 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm tracking-[0.3em] font-mono font-bold disabled:opacity-60"
                        value={otp} onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                    <button 
                      disabled={isOtpVerified}
                      onClick={handleVerifyOtp}
                      className="bg-green-600 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-green-700 disabled:bg-green-200 transition-all"
                    >
                      {isOtpVerified ? "Verified" : "Verify"}
                    </button>
                  </div>
                </div>
              )}

              {isOtpVerified && (
                <form onSubmit={handleFinalReset} className="space-y-3 pt-4 border-t border-dashed animate-in fade-in">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="password" placeholder="New Password"
                      className="w-full pl-9 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-indigo-500"
                      value={newPassword.password} onChange={(e) => setNewPassword({...newPassword, password: e.target.value})} required
                    />
                  </div>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="password" placeholder="Confirm Password"
                      className="w-full pl-9 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-indigo-500"
                      value={newPassword.confirm} onChange={(e) => setNewPassword({...newPassword, confirm: e.target.value})} required
                    />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
                    Update Password & Login
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MAIN LOGIN CARD */}
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-3xl overflow-hidden max-w-5xl w-full border border-gray-100">
        <div className="hidden md:flex md:w-1/2 bg-indigo-600 p-16 text-white flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-indigo-600 rounded-sm rotate-45"></div>
              </div>
              <span className="text-2xl font-black tracking-tight">EduPortal</span>
            </div>
            <h1 className="text-5xl font-extrabold leading-tight mb-6">Empower Your <br /> Learning.</h1>
          </div>
          <div className="space-y-6 border-t border-indigo-500 pt-8">
            <div className="flex items-center gap-4"><ChevronRight className="w-5 h-5 opacity-70" /><p className="font-medium">Direct Faculty Access</p></div>
            <div className="flex items-center gap-4"><ChevronRight className="w-5 h-5 opacity-70" /><p className="font-medium">Secure Encrypted Data</p></div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Sign In</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  className="pl-12 w-full py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="email@example.com" required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-gray-600">Password</label>
                <button type="button" onClick={() => setShowForgotModal(true)} className="text-xs font-bold text-indigo-600">
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password" name="password" value={form.password} onChange={handleChange}
                  className="pl-12 w-full py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="••••••••" required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Portal Role</label>
              <div className="relative">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <select
                  name="role" value={form.role} onChange={handleChange}
                  className="pl-12 w-full py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                >
                  <option value="STUDENT">Student Portal</option>
                  <option value="FACULTY_MEMBER">Faculty Member</option>
                  <option value="ADMINISTRATOR">Administrator</option>
                </select>
              </div>
            </div>

            <button type="submit" className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white w-full py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95">
              <LogIn className="w-5 h-5" /> Secure Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}