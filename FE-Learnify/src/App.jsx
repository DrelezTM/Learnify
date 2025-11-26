import { BrowserRouter, Routes, Route } from "react-router-dom";
import CourseListPage from "./pages/dashboard/CourseListPage";
import LoginPage from "./pages/authentication/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import LectureRoute from "./LecturerRoute";
import AdminRoute from "./AdminRoute";
import SchedulePage from "./pages/dashboard/SchedulePage";
import AttendancePage from "./pages/dashboard/AttendancePage";
import Layanan from "./components/pengajuan/Studentketerangan";
import Lecture from "./components/pengajuan/LecturerKeterangan";
import Admin from '@/components/pengajuan/AdminKeterangan'
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

              <ProtectedRoute>
                <CourseListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Schedule"
            element={
              <ProtectedRoute>
                <SchedulePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/keterangan"
            element={
              <ProtectedRoute>
                <Layanan />
              </ProtectedRoute>
            }
          />  

          <Route
            path="/lecturer-keterangan"
            element={
               
             <LectureRoute >
                <Lecture />
             </LectureRoute>
            }
          />  

          <Route
            path="/admin"
            element={
                
              <AdminRoute >
                  <Admin />
              </AdminRoute>
            }
          />  




          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/:id/:weekId/material/:materialId"
            element={
              <ProtectedRoute>
                <MaterialDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/:id/:weekId/assignment/:assignmentId"
            element={
              <ProtectedRoute>
                <AssignmentDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance"
            element={

              <ProtectedRoute>
                <AttendancePage />
              </ProtectedRoute>

            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
