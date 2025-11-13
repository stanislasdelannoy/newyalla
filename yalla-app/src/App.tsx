import { Outlet } from "react-router-dom";

function App() {
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Yalla Travel Planner</h1>
      <Outlet /> {/* Ici s'affichent les pages */}
    </div>
  );
}

export default App;
