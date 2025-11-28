import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TripsList from "./pages/TripsList";
import TripDetail from "./pages/TripDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Page liste des trips */}
        <Route path="/trips" element={<TripsList />} />

        {/* Page détail d’un trip */}
        <Route path="/trips/:id" element={<TripDetail />} />

        {/* route par défaut → login (ou trips si tu préfères) */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
