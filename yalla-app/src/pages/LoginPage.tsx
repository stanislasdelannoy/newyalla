// src/pages/LoginPage.tsx
import { useState, FormEvent } from "react";
import { login, register } from "../api/auth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ← IMPORTANT

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      if (isRegisterMode) {
        // REGISTER
        await register({ email, password });

        // Si tu veux rediriger immédiatement après register :
        localStorage.setItem("token", "TEMP"); // si ton register ne renvoie pas de token
        navigate("/trips");

        // Si tu préfères obliger l'utilisateur à se loguer ensuite :
        // setInfo("Compte créé, tu peux maintenant te connecter.");
        // setIsRegisterMode(false);
      } else {
        // LOGIN
        const token = await login({ email, password });

        // Stockage du token
        localStorage.setItem("token", token.access_token);

        // Redirection après login
        navigate("/trips");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h1>{isRegisterMode ? "Créer un compte" : "Login"}</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Email<br />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            Mot de passe<br />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {info && <p style={{ color: "green" }}>{info}</p>}

        <button type="submit" disabled={loading}>
          {loading
            ? isRegisterMode ? "Création..." : "Connexion..."
            : isRegisterMode ? "S'inscrire" : "Se connecter"}
        </button>
      </form>

      <div style={{ marginTop: "1rem" }}>
        {isRegisterMode ? (
          <button type="button" onClick={() => setIsRegisterMode(false)}>
            Déjà un compte ? Se connecter
          </button>
        ) : (
          <button type="button" onClick={() => setIsRegisterMode(true)}>
            Pas encore de compte ? S'inscrire
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
