import React, { useState } from "react";
import { auth } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>{isRegistering ? "Rejestracja" : "Logowanie"}</h1>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          {isRegistering ? "Zarejestruj się" : "Zaloguj się"}
        </button>
      </form>
      <p>
        {isRegistering ? "Masz już konto?" : "Nie masz konta?"}
        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Zaloguj się" : "Zarejestruj się"}
        </button>
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Auth;
