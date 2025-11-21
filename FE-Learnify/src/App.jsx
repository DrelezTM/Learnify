import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListKelasPage from "./pages/dashboard/ListKelasPage";
import './App.css'
import LoginPage from "./pages/authentication/LoginPage";
import Detail from "./components/Detail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* authentication */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/list-kelas" element={<ListKelasPage />} />

            <Route path="/detail/:kelasId" element={<Detail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
