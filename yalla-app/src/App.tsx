import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TripsList from "./pages/TripsList";
import TripDetail from "./pages/TripDetail";
import { RequireAuth } from "./requireAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Routes protégées */}
        <Route element={<RequireAuth />}>
          <Route path="/trips" element={<TripsList />} />
          <Route path="/trips/:id" element={<TripDetail />} />
        </Route>

        {/* Redirs par défaut */}
        <Route path="/" element={<Navigate to="/trips" replace />} />
        <Route path="*" element={<Navigate to="/trips" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
