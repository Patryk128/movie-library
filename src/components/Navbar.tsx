import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
      setLogoutMessage("Pomyślnie wylogowano!");
      setTimeout(() => setLogoutMessage(null), 3000); // Wiadomość znika po 3 sekundach
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">Moje Filmy</h1>
      <div className="navbar-auth">
        {user ? (
          <>
            <span>Cześć, {user.email}</span>
            <button onClick={handleLogout} className="logout">
              Wyloguj
            </button>
          </>
        ) : (
          <Link to="/auth" className="login">
            Zaloguj / Zarejestruj się
          </Link>
        )}
      </div>
      {/* Wyświetlanie wiadomości o wylogowaniu */}
      {logoutMessage && <div className="logout-message">{logoutMessage}</div>}
    </nav>
  );
};

export default Navbar;
