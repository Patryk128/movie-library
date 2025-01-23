import React from "react";
import "../styles/MovieDetailsModal.css";

interface MovieDetailsModalProps {
  movie: {
    title: string;
    overview?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !movie) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2>{movie.title}</h2>
        <p>{movie.overview || "Brak opisu"}</p>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
