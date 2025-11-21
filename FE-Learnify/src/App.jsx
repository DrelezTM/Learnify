import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListKelasPage from "./pages/dashboard/ListKelasPage";
import './App.css'
import LoginPage from "./pages/authentication/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* authentication */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/list-kelas" element={<ListKelasPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
