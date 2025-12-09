// src/pages/LoginPage.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { login, register } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { FormField } from "../components/FormField";
import "./style/AuthPage.css";

export default function AuthPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [hometown, setHometown] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          username: username || undefined,
          phone: phone || undefined,
          hometown: hometown || undefined,
        });

        setInfo("Compte créé. Tu peux maintenant te connecter.");
        setIsRegisterMode(false);
      } else {
        const token = await login({ email, password });
        localStorage.setItem("token", token.access_token);

        navigate("/trips");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="auth-title">
          {isRegisterMode ? "Créer un compte" : "Connexion"}
        </h1>

        <form onSubmit={handleSubmit} className="auth-form">

          <FormField
            label="Email"
            name="email"
            value={email}
            onChange={setEmail}
            type="email"
            required
            placeholder="ex: john@gmail.com"
          />

          <FormField
            label="Mot de passe"
            name="password"
            value={password}
            onChange={setPassword}
            type="password"
            required
          />

          {isRegisterMode && (
            <>
              <FormField
                label="Prénom"
                name="firstName"
                value={firstName}
                onChange={setFirstName}
                required
              />
              <FormField
                label="Nom"
                name="lastName"
                value={lastName}
                onChange={setLastName}
                required
              />
              <FormField
                label="Username"
                name="username"
                value={username}
                onChange={setUsername}
                placeholder="facultatif"
              />
              <FormField
                label="Téléphone"
                name="phone"
                value={phone}
                onChange={setPhone}
                placeholder="facultatif"
              />
              <FormField
                label="Ville d'origine"
                name="hometown"
                value={hometown}
                onChange={setHometown}
                placeholder="facultatif"
              />
            </>
          )}

          {error && <p className="auth-error">{error}</p>}
          {info && <p className="auth-info">{info}</p>}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Chargement..."
              : isRegisterMode
              ? "Créer un compte"
              : "Se connecter"}
          </button>
        </form>

        <div className="auth-switch">
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
    </div>
  );
}
