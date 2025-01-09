import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { db } from "../firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "./AuthContext.tsx";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const Home: React.FC = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState<any[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  const watchedMoviesRef = collection(
    db,
    `users/${user?.uid || "guest"}/watchedMovies`
  );

  // Pobieranie obejrzanych filmów
  useEffect(() => {
    if (!user) return;

    const fetchWatchedMovies = async () => {
      try {
        const snapshot = await getDocs(watchedMoviesRef);
        const movieIds = snapshot.docs.map((doc) => doc.id);
        setWatchedMovies(movieIds);
      } catch (error) {
        console.error("Błąd podczas pobierania obejrzanych filmów:", error);
      }
    };

    fetchWatchedMovies();
  }, [user]);

  // Pobieranie filmów
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pl-PL`
      );
      setMovies(response.data.results);
    } catch (error) {
      console.error("Błąd podczas pobierania filmów:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Wyszukiwanie filmów
  const searchMovies = useCallback(async (query: string) => {
    if (!query) {
      fetchMovies();
      setIsSearching(false);
      return;
    }

    setLoading(true);
    setIsSearching(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pl-PL&query=${query}`
      );
      setMovies(response.data.results);
    } catch (error) {
      console.error("Błąd podczas wyszukiwania filmów:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchMovies(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchMovies]);

  // Oznaczanie jako obejrzany
  const toggleWatched = async (movieId: string) => {
    if (!user) {
      alert("Musisz być zalogowany, aby oznaczać filmy!");
      return;
    }

    const movieRef = doc(db, `users/${user.uid}/watchedMovies`, movieId);
    const isWatched = watchedMovies.includes(movieId);

    try {
      if (isWatched) {
        await deleteDoc(movieRef);
        setWatchedMovies(watchedMovies.filter((id) => id !== movieId));
      } else {
        await setDoc(movieRef, { movieId });
        setWatchedMovies([...watchedMovies, movieId]);
      }
    } catch (error) {
      console.error("Błąd podczas oznaczania filmu:", error);
    }
  };

  if (loading) return <p>Ładowanie...</p>;

  return (
    <div>
      <h1>Filmy</h1>

      {/* Pole wyszukiwania */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          autoComplete="off"
          placeholder="Wyszukaj filmy..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Lista filmów */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {movies.map((movie) => (
          <div key={movie.id} style={{ textAlign: "center" }}>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                  : "https://via.placeholder.com/200x300?text=No+Image"
              }
              alt={movie.title}
            />
            <h3>{movie.title}</h3>
            <button
              onClick={() => toggleWatched(movie.id.toString())}
              style={{
                background: watchedMovies.includes(movie.id.toString())
                  ? "green"
                  : "gray",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              {watchedMovies.includes(movie.id.toString())
                ? "Oznacz jako nieobejrzany"
                : "Oznacz jako obejrzany"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
