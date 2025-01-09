import React, { useState } from "react";
import { useAuth } from "../pages/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import "../pages/AuthPage.css";

const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate("/"); // Przekierowanie po logowaniu/rejestracji
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <h2>{isRegistering ? "Rejestracja" : "Logowanie"}</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Hasło"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAuth}>
        {isRegistering ? "Zarejestruj się" : "Zaloguj się"}
      </button>
      <p
        onClick={() => setIsRegistering(!isRegistering)}
        className="toggle-auth"
      >
        {isRegistering
          ? "Masz już konto? Zaloguj się"
          : "Nie masz konta? Zarejestruj się"}
      </p>
    </div>
  );
};

export default AuthPage;
