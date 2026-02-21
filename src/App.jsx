import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import Home from "./pages/Home";
import Students from "./pages/Students";
import Faculty from "./pages/Faculty";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";

/* ===============================
   Protected Route
=================================*/
function ProtectedRoute({ children, role }) {
  const storedUser = sessionStorage.getItem("user");

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(storedUser);

  // Case-insensitive role check
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
    <>
      <Navbar />
      <Toaster position="top-center" />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/students"
          element={
            <ProtectedRoute role="STUDENT">
              <Students />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty"
          element={
            <ProtectedRoute role="FACULTY_MEMBER">
              <Faculty />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}