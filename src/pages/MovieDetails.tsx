import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const MovieDetails: React.FC = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pl-PL`
        );
        setMovie(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania szczegółów filmu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <p>Ładowanie...</p>;
  if (!movie) return <p>Nie znaleziono filmu.</p>;

  return (
    <div>
      <Link to="/">← Powrót</Link>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
      <p>Ocena: {movie.vote_average} / 10</p>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
    </div>
  );
};

export default MovieDetails;
