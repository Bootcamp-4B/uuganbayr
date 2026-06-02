"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MovieCard from "@/components/MovieCard";

function getGenresFromParams(searchParams, genres) {
  const genreValues = searchParams.getAll("genre").flatMap((genreValue) => genreValue.split(","));

  return [...new Set(
    genreValues
      .map((genre) => genre.trim())
      .filter((genre) => genre && genre !== "All" && genres.includes(genre)),
  )];
}

export default function GenresClient({ genres, movies }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedGenres = getGenresFromParams(searchParams, genres);

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
      updateGenreParams([]);
      return;
    }

    const nextGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((currentGenre) => currentGenre !== genre)
      : [...selectedGenres, genre];

    updateGenreParams(nextGenres);
  }

  function updateGenreParams(nextGenres) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("genre");

    if (nextGenres.length > 0) {
      params.set("genre", nextGenres.join(","));
    }

    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname, {
      scroll: false,
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
