import React from "react";
import { Link } from "react-router-dom";
import "../styles/NotFound.css"; 

const NotFound: React.FC = () => (
  <div className="not-found-container">
    <h1 className="not-found-title">404</h1>
    <p className="not-found-message">
      Strona, której szukasz, nie została znaleziona.
    </p>
    <Link to="/" className="not-found-link">
      Wróć na stronę główną
    </Link>
  </div>
);

export default NotFound;
