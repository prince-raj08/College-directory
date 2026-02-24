import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Faculty from "./pages/Faculty";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";

/* ===============================
    🛡️ Protected Route Logic
=================================*/
function ProtectedRoute({ children, role }) {
  const storedUser = sessionStorage.getItem("user");

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(storedUser);

  // FIXED: Role strings must match exactly
  if (
    role &&
    user.role &&
    user.role.toUpperCase() !== role.toUpperCase()
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🎓 Protected Student Route */}
          <Route
            path="/students"
            element={
              <ProtectedRoute role="STUDENT">
                <Students />
              </ProtectedRoute>
            }
          />

          {/* 👨‍🏫 Protected Faculty Route */}
          <Route
            path="/faculty"
            element={
              <ProtectedRoute role="FACULTY_MEMBER">
                <Faculty />
              </ProtectedRoute>
            }
          />

          {/* ⚙️ Protected Admin Route - FIXED ROLE NAME */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMINISTRATOR">
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}