import { BrowserRouter, Routes, Route } from "react-router-dom";
import CourseListPage from "./pages/dashboard/CourseListPage";
import LoginPage from "./pages/authentication/LoginPage";
import RegisterPage from "./pages/authentication/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import Schedule from "./components/Schedule/Calenderview";
import SchedulePage from "./pages/dashboard/SchedulePage";
import AttendancePage from "./pages/dashboard/AttendancePage";
import Home from "./pages/dashboard/Home";
import { AuthProvider } from "./contexts/AuthContext";
import CourseDetailPage from "./pages/dashboard/CourseDetailPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* protected routes */}
          <Route
            path="/courses"
            element={
              <CourseListPage />
            }
          />

          <Route
            path="/Schedule"
            element={

              <SchedulePage />

            }
          />

          <Route
            path="/home"
            element={
              <Home />
            }
          />



          <Route
            path="/courses/:id"
            element={

              <CourseDetailPage />

            }
          />

          <Route
            path="/attendance"
            element={

              <AttendancePage />

            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
