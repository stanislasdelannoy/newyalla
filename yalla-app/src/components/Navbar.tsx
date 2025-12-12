import { useNavigate, Link } from "react-router-dom";
import "./style/Navbar.css";

type NavbarProps = {
  title?: string;
};

export function Navbar({ title = "Yala" }: NavbarProps) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/trips" className="navbar-brand">
          {title}
        </Link>

        <div className="navbar-actions">
          <button className="navbar-btn" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
