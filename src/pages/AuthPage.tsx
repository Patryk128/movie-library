import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app"; // Import typu FirebaseError
import "../styles/AuthPage.css";

const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async () => {
    setEmailError(false);
    setPasswordError(false);
    setError(null);

    if (!email) {
      setEmailError(true);
      setError("Pole email jest wymagane.");
      return;
    }

    if (!password) {
      setPasswordError(true);
      setError("Pole hasło jest wymagane.");
      return;
    }

    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (err) {
      if (err instanceof FirebaseError) {
        const errorMessage = mapFirebaseError(err.code);
        setError(errorMessage || "Wystąpił nieznany błąd.");
        if (
          err.code === "auth/invalid-email" ||
          err.code === "auth/user-not-found"
        ) {
          setEmailError(true);
        }
        if (err.code === "auth/wrong-password") {
          setPasswordError(true);
        }
      } else {
        setError("Wystąpił nieoczekiwany błąd.");
      }
    }
  };

  const mapFirebaseError = (code: string): string | null => {
    const errorMessages: Record<string, string> = {
      "auth/invalid-email": "Podany email jest nieprawidłowy.",
      "auth/user-disabled": "Twoje konto zostało zablokowane.",
      "auth/user-not-found": "Nie znaleziono użytkownika o podanym emailu.",
      "auth/wrong-password": "Nieprawidłowe hasło.",
      "auth/email-already-in-use": "Podany email jest już zajęty.",
      "auth/weak-password": "Hasło musi mieć co najmniej 6 znaków.",
    };
    return errorMessages[code] || null;
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleAuth();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>{isRegistering ? "Rejestracja" : "Logowanie"}</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
          className={`auth-input ${emailError ? "input-error" : ""}`}
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
          className={`auth-input ${passwordError ? "input-error" : ""}`}
        />
        <button className="auth-button" onClick={handleAuth}>
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
    </div>
  );
};

export default AuthPage;
