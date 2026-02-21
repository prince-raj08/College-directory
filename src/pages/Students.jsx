import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { User, Phone, Mail, BookOpen, UserCheck, GraduationCap, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const Students = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Logout Function: Clears session and redirects to Home
  const handleLogout = () => {
    sessionStorage.clear(); // Session data delete karne ke liye
    toast.success("Logged out successfully");
    navigate("/"); // Home page par redirect karne ke liye
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) { navigate("/login"); return; }
        const user = JSON.parse(storedUser);

        const response = await fetch(`http://localhost:8080/api/v1/student/profile/${user.id}`);
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setStudent(data);
      } catch (error) {
        toast.error("Unable to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="h-screen flex items-center justify-center text-indigo-600 font-bold">Loading Academic Portal...</div>;
  if (!student) return <div className="p-10 text-center text-red-500">No profile data found.</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-12">
      {/* Top Banner & Personal Info */}
      <div className="bg-indigo-900 text-white pb-24 pt-10 px-6 relative">
        
        {/* ✅ Logout Button Added */}
        <button 
          onClick={handleLogout}
          className="absolute top-6 right-6 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition shadow-lg text-sm"
        >
          <LogOut size={18} /> Logout
        </button>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <img
            src={student.profile ? `data:image/jpeg;base64,${student.profile}` : "https://via.placeholder.com/150"}
            alt="Student Photo"
            className="w-32 h-32 rounded-full border-4 border-indigo-400 shadow-2xl object-cover"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{student.name}</h1>
            <p className="opacity-80 flex items-center justify-center md:justify-start gap-2 mt-1">
              <GraduationCap size={18} /> {student.department} | {student.year} Year
            </p>
            <div className="flex gap-4 mt-4 text-sm">
              <span className="flex items-center gap-1"><Mail size={14}/> {student.email}</span>
              <span className="flex items-center gap-1"><Phone size={14}/> {student.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Academic Overview Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
              <BookOpen className="text-indigo-600" /> Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                <p className="text-xs text-blue-600 font-bold uppercase">Attendance</p>
                <p className="text-2xl font-black text-blue-900">{student.attendance || "95"}%</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
                <p className="text-xs text-green-600 font-bold uppercase">Current GPA</p>
                <p className="text-2xl font-black text-green-900">{student.grade || "3.8"}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-100">
                <p className="text-xs text-purple-600 font-bold uppercase">Credits</p>
                <p className="text-2xl font-black text-purple-900">18</p>
              </div>
            </div>

            <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase">Enrolled Courses</h4>
            <div className="space-y-3">
              {["Database Management", "React Frameworks", "Software Engineering"].map((course, i) => (
                <div key={i} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition">
                  <span className="font-medium text-gray-700">{course}</span>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-bold">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Advisor & QR */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <UserCheck className="text-indigo-600" /> Faculty Advisors
            </h3>
            <div className="border-t pt-4">
              <p className="font-bold text-gray-900 text-lg">Dr. Sarah Johnson</p>
              <p className="text-xs text-gray-500 mb-4 uppercase">Department Head</p>
              <div className="flex gap-3">
                <a href="mailto:advisor@college.edu" className="flex-1 text-center bg-gray-100 py-2 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition">Email</a>
                <a href="tel:123456" className="flex-1 text-center bg-gray-100 py-2 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition">Call</a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col items-center">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 w-full text-center">Digital Identity Card</h3>
            <div className="p-3 bg-white border-2 border-dashed border-gray-200 rounded-2xl shadow-inner">
              <QRCodeCanvas value={JSON.stringify({ id: student.id, role: "STUDENT" })} size={140} />
            </div>
            <p className="mt-4 text-[10px] text-gray-400 italic font-medium tracking-widest uppercase text-center">Verified Student ID</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;