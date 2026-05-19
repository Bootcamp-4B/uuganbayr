"use client";

import { useState } from "react";
import MovieCard from "@/components/MovieCard";

export default function SearchClient({ movies }) {
  const [searchText, setSearchText] = useState("");

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <main className="page simple-page">
      <h1>Search</h1>
      <input
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="Search movie..."
        className="search-input"
      />

      {filteredMovies.length === 0 ? (
        <div className="empty-box">No movie found.</div>
      ) : (
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </main>
  );
}
