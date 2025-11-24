import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListKelasPage from "./pages/dashboard/ListKelasPage";
import LoginPage from "./pages/authentication/LoginPage";
import Detail from "./components/Detail";
import ProtectedRoute from "./ProtectedRoute";
import AttendancePage from "./pages/dashboard/AttendancePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* authentication */}
        <Route path="/login" element={<LoginPage />} />

        {/* protected routes */}
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <ListKelasPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/:kelasId"
          element={
            <ProtectedRoute>
              <Detail />
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
  );
}

export default App;
