import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import MyMovies from "./pages/MyMovies"; // Import strony Moje filmy
import AuthPage from "./pages/AuthPage";
import { AuthProvider, useAuth } from "./pages/AuthContext";

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/auth"
            element={user ? <Navigate to="/" /> : <AuthPage />}
          />
          <Route
            path="/my-movies"
            element={user ? <MyMovies /> : <Navigate to="/auth" />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
