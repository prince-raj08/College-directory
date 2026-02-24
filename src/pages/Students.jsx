import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { User, Phone, Mail, BookOpen, UserCheck, GraduationCap, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const Students = () => {
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear(); 
    toast.success("Logged out successfully");
    navigate("/"); 
  };

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) { 
          navigate("/"); 
          return; 
        }
        
        const user = JSON.parse(storedUser);
        // FIX: Backend uses capital "Id". Adding fallback to small "id" just in case.
        const userId = user.Id || user.id;

        if (!userId) {
          toast.error("User ID not found session");
          navigate("/");
          return;
        }

        // 1. Fetch Student Profile
        const profileRes = await fetch(`http://localhost:8080/api/v1/student/profile/${userId}`);
        if (!profileRes.ok) throw new Error("Profile not found");
        const profileData = await profileRes.json();
        setStudent(profileData);

        // 2. Fetch Enrolled Courses
        try {
          const coursesRes = await fetch(`http://localhost:8080/api/v1/student/${userId}/courses`);
          if (coursesRes.ok) {
            const coursesData = await coursesRes.json();
            setCourses(coursesData);
          }
        } catch (e) { console.error("Courses fetch failed"); }

        // 3. Fetch Assigned Advisors
        try {
          const advisorsRes = await fetch(`http://localhost:8080/api/v1/student/${userId}/advisors`);
          if (advisorsRes.ok) {
            const advisorsData = await advisorsRes.json();
            setAdvisors(advisorsData);
          }
        } catch (e) { console.error("Advisors fetch failed"); }

      } catch (error) {
        console.error("Data loading error:", error);
        toast.error("Unable to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchFullData();
  }, [navigate]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-indigo-600 font-bold">Loading Academic Portal...</p>
    </div>
  );

  if (!student) return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 text-xl font-bold">No profile data found.</p>
        <button onClick={() => navigate("/")} className="mt-4 text-indigo-600 underline">Go to Login</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-12">
      {/* Top Banner */}
      <div className="bg-indigo-900 text-white pb-24 pt-10 px-6 relative">
        <button 
          onClick={handleLogout}
          className="absolute top-6 right-6 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition shadow-lg text-sm"
        >
          <LogOut size={18} /> Logout
        </button>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={student.profile ? `data:image/jpeg;base64,${student.profile}` : "https://via.placeholder.com/150"}
              alt="Student"
              className="w-32 h-32 rounded-full border-4 border-indigo-400 shadow-2xl object-cover bg-white"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{student.name}</h1>
            <p className="opacity-80 flex items-center justify-center md:justify-start gap-2 mt-1 text-indigo-100">
              <GraduationCap size={18} /> {student.department || "No Department"} | {student.year || "N/A"} Year
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm opacity-90">
              <span className="flex items-center gap-1"><Mail size={14}/> {student.email}</span>
              <span className="flex items-center gap-1"><Phone size={14}/> {student.phone || "No Phone"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section: Academic Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
              <BookOpen className="text-indigo-600" size={20} /> Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Attendance</p>
                <p className="text-2xl font-black text-blue-900">{student.attendance || "0"}%</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
                <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Current GPA</p>
                <p className="text-2xl font-black text-green-900">{student.grade || "0.0"}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-100">
                <p className="text-xs text-purple-600 font-bold uppercase tracking-wider">Credits</p>
                <p className="text-2xl font-black text-purple-900">18</p>
              </div>
            </div>

            <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Enrolled Courses</h4>
            <div className="space-y-3">
              {courses.length > 0 ? courses.map((course, i) => (
                <div key={i} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-slate-50 transition group">
                  <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition">{course.title || course.name}</span>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold uppercase tracking-tighter">Enrolled</span>
                </div>
              )) : (
                <div className="text-center py-8 border-2 border-dashed rounded-2xl">
                    <p className="text-gray-400 text-sm italic">No active courses found in your record.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <UserCheck className="text-indigo-600" size={20} /> Faculty Advisors
            </h3>
            <div className="border-t pt-4 space-y-4">
              {advisors.length > 0 ? advisors.map((advisor, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-gray-100">
                  <p className="font-bold text-gray-900 text-md">{advisor.name}</p>
                  <p className="text-[10px] text-indigo-600 font-bold mb-3 uppercase">{advisor.department || "Advisor"}</p>
                  <div className="flex gap-2">
                    <a href={`mailto:${advisor.email}`} className="flex-1 text-center bg-white border border-gray-200 py-2 rounded-lg text-[10px] font-bold hover:bg-indigo-600 hover:text-white transition">Email</a>
                    <a href={`tel:${advisor.phone}`} className="flex-1 text-center bg-white border border-gray-200 py-2 rounded-lg text-[10px] font-bold hover:bg-indigo-600 hover:text-white transition">Call</a>
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 text-xs italic">No assigned advisors found.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col items-center">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 w-full text-center tracking-widest">Digital Student ID</h3>
            <div className="p-4 bg-white border-2 border-dashed border-gray-200 rounded-2xl shadow-inner mb-2">
              <QRCodeCanvas 
                value={JSON.stringify({ id: student.Id || student.id, type: "STUDENT_VERIFIED" })} 
                size={140}
                level="H"
                includeMargin={false}
              />
            </div>
            <p className="mt-2 text-[9px] text-gray-400 italic font-medium tracking-widest uppercase text-center">Scan to verify identity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;