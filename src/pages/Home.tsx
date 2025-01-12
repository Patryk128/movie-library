import React, { useEffect, useState } from "react";
import axios from "axios";
import { db } from "../firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "./AuthContext.tsx";
import "./Home.css";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const Home: React.FC = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState<any[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"all" | "watched">("all");

  const watchedMoviesRef = collection(
    db,
    `users/${user?.uid || "guest"}/watchedMovies`
  );

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

  const fetchMovies = async (query: string = "", page: number = 1) => {
    setLoading(true);
    try {
      const url = query
        ? `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pl-PL&query=${query}&page=${page}`
        : `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pl-PL&page=${page}`;

      const response = await axios.get(url);

      // Dodanie unikalnych filmów do listy
      setMovies((prevMovies) => {
        const newMovies = response.data.results.filter(
          (movie: any) => !prevMovies.some((m) => m.id === movie.id)
        );
        return [...prevMovies, ...newMovies];
      });
    } catch (error) {
      console.error("Błąd podczas pobierania filmów:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(searchQuery, page);
  }, [page, searchQuery]);

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

  const loadMoreMovies = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const filteredMovies =
    viewMode === "watched"
      ? movies.filter((movie) => watchedMovies.includes(movie.id.toString()))
      : movies;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset paginacji przy wyszukiwaniu
    setMovies([]); // Wyczyszczenie listy filmów
  };

  const showMovieDetails = (movie: any) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Filmy</h1>

      <div className="view-toggle-buttons">
        <button
          onClick={() => setViewMode("all")}
          className={`toggle-button ${viewMode === "all" ? "active" : ""}`}
        >
          Wszystkie filmy
        </button>
        <button
          onClick={() => setViewMode("watched")}
          className={`toggle-button ${viewMode === "watched" ? "active" : ""}`}
        >
          Moje filmy
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Wyszukaj filmy..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="movies-container">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                  : "https://via.placeholder.com/200x300?text=No+Image"
              }
              alt={movie.title}
              className="movie-poster"
              onClick={() => showMovieDetails(movie)}
            />
            <h3 className="movie-title" onClick={() => showMovieDetails(movie)}>
              {movie.title}
            </h3>
            <button
              onClick={() => toggleWatched(movie.id.toString())}
              className={`watch-button ${
                watchedMovies.includes(movie.id.toString())
                  ? "watched"
                  : "unwatched"
              }`}
            >
              {watchedMovies.includes(movie.id.toString())
                ? "Oznacz jako nieobejrzany"
                : "Oznacz jako obejrzany"}
            </button>
          </div>
        ))}
      </div>

      {loading && <p>Ładowanie...</p>}

      {!loading && viewMode === "all" && (
        <button className="load-more-button" onClick={loadMoreMovies}>
          Załaduj więcej
        </button>
      )}

      {isModalOpen && selectedMovie && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedMovie.title}</h2>
            <p>{selectedMovie.overview || "Brak opisu"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
