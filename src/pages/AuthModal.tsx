import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./AuthModal.css";

const AuthModal: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      setEmail("");
      setPassword("");
      navigate("/"); // Przeniesienie na stronę główną
    } catch (error) {
      console.error("Błąd logowania/rejestracji:", error);
    }
  };

  return (
    <div className="auth-modal">
      <h2>{isRegister ? "Rejestracja" : "Logowanie"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="auth-input"
      />
      <input
        type="password"
        placeholder="Hasło"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="auth-input"
      />
      <button onClick={handleSubmit} className="auth-button">
        {isRegister ? "Zarejestruj się" : "Zaloguj"}
      </button>
      <button
        onClick={() => setIsRegister(!isRegister)}
        className="auth-toggle"
      >
        {isRegister
          ? "Masz już konto? Zaloguj się"
          : "Nie masz konta? Zarejestruj się"}
      </button>
    </div>
  );
};

export default AuthModal;
