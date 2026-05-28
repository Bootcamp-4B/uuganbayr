"use client";

import { useState } from "react";
import MovieCard from "@/components/MovieCard";

export default function GenresClient({ genres, movies }) {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const filteredMovies =
    selectedGenres.length === 0
      ? movies
      : movies.filter((movie) => {
          const movieGenres = new Set([movie.genre, ...(movie.tags || [])].filter(Boolean));

          return selectedGenres.some((genre) => movieGenres.has(genre));
        });
  const resultsLabel = selectedGenres.length === 0 ? "All" : selectedGenres.join(", ");

  function toggleGenre(genre) {
    if (genre === "All") {
      setSelectedGenres([]);
      return;
    }

    setSelectedGenres((currentGenres) => {
      if (currentGenres.includes(genre)) {
        return currentGenres.filter((currentGenre) => currentGenre !== genre);
      }

      return [...currentGenres, genre];
    });
  }

  return (
    <main className="page genre-page">
      <div className="genre-results">
        <h1>Search results</h1>
        <h2>
          {filteredMovies.length} results for &quot;{resultsLabel}&quot;
        </h2>

        {filteredMovies.length === 0 ? (
          <div className="empty-box">No results found.</div>
        ) : (
          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      <div className="genre-sidebar">
        <h1>Search by genre</h1>
        <p>See lists of movies by genre</p>

        <div className="genre-list">
          {genres.map((genre) => {
            const isActive =
              genre === "All" ? selectedGenres.length === 0 : selectedGenres.includes(genre);

            return (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={isActive ? "active-genre" : ""}
                type="button"
                aria-pressed={isActive}
              >
                {genre} <span>{isActive && genre !== "All" ? "✓" : "›"}</span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
