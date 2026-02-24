import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserCheck, BookOpen, TrendingUp, BarChart3, 
  Plus, Edit, Trash2, User, Building2, Mail, LogOut, School, Phone 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import toast from 'react-hot-toast';

const Admin = () => {
  const navigate = useNavigate();
  
  const [adminProfile, setAdminProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('students');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ students: 0, faculty: 0 });

  // 1. Fetch Admin Profile from Session
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setAdminProfile(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // 2. Fetch Records and Update Real Stats
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint = activeTab === 'students' ? 'student/list-student' : 'faculty-member/list-faculty';
        const response = await fetch(`http://localhost:8080/api/v1/${endpoint}`);
        const data = await response.json();
        
        if (response.ok) {
          setRecords(data);
          // Stats calculation based on API response
          if(activeTab === 'students') {
            setStats(prev => ({ ...prev, students: data.length }));
          } else {
            setStats(prev => ({ ...prev, faculty: data.length }));
          }
        } else {
          setRecords([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error(`Failed to load ${activeTab}`);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const enrollmentData = [
    { year: '2021', students: 550 },
    { year: '2022', students: 890 },
    { year: '2023', students: stats.students || 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      
      {/* --- DYNAMIC HEADER --- */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100 gap-4">
        <div className="flex items-center gap-6">
          {/* Profile Pic */}
          <div className="relative">
            {adminProfile?.profilePic ? (
              <img 
                src={`data:image/jpeg;base64,${adminProfile.profilePic}`} 
                alt="Admin Profile" 
                className="w-20 h-20 rounded-2xl object-cover shadow-xl border-2 border-indigo-50"
              />
            ) : (
              <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                <User size={40} />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-4 border-white"></div>
          </div>

          <div className="space-y-1">
            {/* Displaying Real Name */}
            <h1 className="text-2xl font-black text-slate-900 leading-tight">
              {adminProfile?.name || "Administrator"}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1">
              {/* Displaying Real Email */}
              <div className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold">
                <Mail size={14} className="text-indigo-500" />
                {adminProfile?.email || "N/A"}
              </div>
              
              {/* Displaying Real Phone (Changed from contact to phone) */}
              <div className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold">
                <Phone size={14} className="text-indigo-500" />
                {adminProfile?.phone || "No phone linked"}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1.5 text-indigo-600 text-xs font-bold uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md">
                <Building2 size={12} />
                {typeof adminProfile?.department === 'object' ? adminProfile?.department?.dept : (adminProfile?.department || "General")}
              </span>
              <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest">
                {adminProfile?.role || "Admin"}
              </span>
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2 bg-rose-50 text-rose-600 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-rose-600 hover:text-white transition-all active:scale-95 border border-rose-100 shadow-sm">
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* --- DASHBOARD STATS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg"><TrendingUp size={20} className="text-indigo-600"/></div>
            <h3 className="font-bold text-slate-700 text-lg">Enrollment Trends</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Line type="monotone" dataKey="students" stroke="#4f46e5" strokeWidth={4} dot={{r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-indigo-500 transition-all cursor-default">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Users size={24} />
            </div>
            <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</p><h4 className="text-2xl font-black text-slate-800">{stats.students}</h4></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-emerald-500 transition-all cursor-default">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <UserCheck size={24} />
            </div>
            <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Faculty</p><h4 className="text-2xl font-black text-slate-800">{stats.faculty}</h4></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-amber-500 transition-all cursor-default">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <School size={24} />
            </div>
            <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Viewing Mode</p><h4 className="text-xl font-black text-slate-800 capitalize">{activeTab}</h4></div>
          </div>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex bg-slate-100 p-1.5 rounded-xl">
            <button onClick={() => setActiveTab('students')} className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'students' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Students</button>
            <button onClick={() => setActiveTab('faculty')} className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'faculty' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Faculty</button>
          </div>
          {activeTab === 'faculty' && (
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all">
              <Plus size={18} /> Add Faculty
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center text-slate-400 font-medium italic animate-pulse">Syncing with server...</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <th className="px-8 py-5">Name & Email</th>
                  <th className="px-8 py-5">Department</th>
                  <th className="px-8 py-5">{activeTab === 'students' ? 'Year' : 'Contact'}</th>
                  <th className="px-8 py-5 text-center text-slate-400">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.length > 0 ? records.map((item, index) => (
                  <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-800">{item.name}</div>
                      <div className="text-xs text-slate-400 font-medium">{item.email}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-wide">
                        {typeof item.department === 'object' ? item.department?.dept : (item.department || "N/A")}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-slate-600 font-medium text-sm">
                      {activeTab === 'students' ? (item.year || "N/A") : (item.contact || item.phone || "N/A")}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex justify-center gap-3">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit size={16}/></button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="p-10 text-center text-slate-400 font-medium">No records found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;