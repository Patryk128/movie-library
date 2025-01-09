import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import "./MyMovies.css";

const MyMovies: React.FC = () => {
  const { user } = useAuth();
  const [watchedMovies, setWatchedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchWatchedMovies = async () => {
      setLoading(true);
      try {
        const watchedMoviesRef = collection(
          db,
          `users/${user.uid}/watchedMovies`
        );
        const q = query(watchedMoviesRef, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        const movies = snapshot.docs.map((doc) => doc.data());
        setWatchedMovies(movies);
      } catch (error) {
        console.error("Błąd podczas pobierania obejrzanych filmów:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchedMovies();
  }, [user]);

  if (!user) {
    return <p>Musisz być zalogowany, aby zobaczyć swoje filmy.</p>;
  }

  if (loading) {
    return <p>Ładowanie...</p>;
  }

  return (
    <div>
      <h1>Moje filmy</h1>
      {watchedMovies.length === 0 ? (
        <p>Nie masz jeszcze obejrzanych filmów.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {watchedMovies.map((movie) => (
            <div key={movie.movieId} style={{ textAlign: "center" }}>
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMovies;
