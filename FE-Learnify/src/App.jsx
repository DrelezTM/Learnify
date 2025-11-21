import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListKelasPage from "./pages/ListKelasPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/list-kelas" element={<ListKelasPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
