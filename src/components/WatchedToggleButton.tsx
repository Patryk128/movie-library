import React from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig.ts";

interface WatchedToggleButtonProps {
  movieId: string;
  isWatched: boolean;
  userId: string | undefined;
  onToggle: (movieId: string, newWatchedState: boolean) => void;
  setErrorMessage: (message: string | null) => void;
}

const WatchedToggleButton: React.FC<WatchedToggleButtonProps> = ({
  movieId,
  isWatched,
  userId,
  onToggle,
  setErrorMessage,
}) => {
  const handleToggle = async () => {
    if (!userId) {
      setErrorMessage("Musisz być zalogowany, aby oznaczać filmy!");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    const movieRef = doc(db, `users/${userId}/watchedMovies`, movieId);

    try {
      if (isWatched) {
        await deleteDoc(movieRef);
      } else {
        await setDoc(movieRef, { movieId });
      }
      onToggle(movieId, !isWatched);
    } catch (error) {
      setErrorMessage(
        "Wystąpił błąd podczas oznaczania filmu. Spróbuj ponownie."
      );
      console.error("Błąd podczas oznaczania filmu:", error);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`watch-button ${isWatched ? "watched" : "unwatched"}`}
    >
      {isWatched ? "Oznacz jako nieobejrzany" : "Oznacz jako obejrzany"}
    </button>
  );
};

export default WatchedToggleButton;
