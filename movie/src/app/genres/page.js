"use client";

import { useState } from "react";
import MovieCard from "@/components/MovieCard";
import { genres, movies } from "@/data/movies";

export default function GenresPage() {
  const [selectedGenre, setSelectedGenre] = useState("All");

  const filteredMovies =
    selectedGenre === "All"
      ? movies
      : movies.filter((movie) => movie.genre === selectedGenre);

  return (
    <main className="page genre-page">
      <div className="genre-results">
        <h1>Search results</h1>
        <h2>
          {filteredMovies.length} results for “{selectedGenre}”
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
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={selectedGenre === genre ? "active-genre" : ""}
            >
              {genre} <span>›</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
