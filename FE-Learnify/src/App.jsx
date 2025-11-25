import { BrowserRouter, Routes, Route } from "react-router-dom";
import CourseListPage from "./pages/dashboard/CourseListPage";
import LoginPage from "./pages/authentication/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import Schedule from "./components/Schedule/Calenderview";
import SchedulePage from "./pages/dashboard/SchedulePage";
import AttendancePage from "./pages/dashboard/AttendancePage";
import Home from "./pages/dashboard/Home";
import { AuthProvider } from "./contexts/AuthContext";
import CourseDetailPage from "./pages/dashboard/CourseDetailPage";
import MaterialDetailPage from "./pages/dashboard/MaterialDetailPage";
import AssignmentDetailPage from "./pages/dashboard/AssignmentDetailPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />

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
            path="/courses/:id/:weekId/material/:materialId"
            element={
              <MaterialDetailPage />
            }
          />

          <Route
            path="/courses/:id/:weekId/assignment/:assignmentId"
            element={
              <AssignmentDetailPage />
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
