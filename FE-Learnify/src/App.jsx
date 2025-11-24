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
        <Route path="/login" element={<LoginPage />} />

        {/* protected routes */}
        <Route
          path="/courses"
          element={
           
              <ListKelasPage />
          
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
          
              <Detail />
          
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
  );
}

export default App;
