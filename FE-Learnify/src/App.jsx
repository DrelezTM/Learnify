import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListKelasPage from "./pages/dashboard/ListKelasPage";
import LoginPage from "./pages/authentication/LoginPage";
import Detail from "./components/DetailCourse";
import ProtectedRoute from "./ProtectedRoute";
import Schedule from "./components/Schedule/Calenderview";
import SchedulePage from "./pages/dashboard/SchedulePage";
import AttendancePage from "./pages/dashboard/AttendancePage";
import Home from "./pages/dashboard/Home";

function App() {
  return (
    <BrowserRouter>
  <Routes>
    {/* authentication */}
    <Route path="/" element={<LoginPage />} />


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
      path="/Schedule"
      element={
        <ProtectedRoute>
          <SchedulePage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/home"
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
    />

    <Route
      path="/courses/:id"
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