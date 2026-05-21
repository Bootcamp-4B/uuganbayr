import { movies as localMovies } from "@/data/movies";
import { getTmdbMovieById, getTmdbMovies } from "@/lib/tmdb";

export async function getMovies() {
  const tmdbMovies = await getTmdbMovies();
  const tmdbIds = new Set(tmdbMovies.map((movie) => movie.id));

  return [
    ...tmdbMovies,
    ...localMovies.filter((movie) => !tmdbIds.has(movie.id)),
  ];
}

export async function getMovieById(id) {
  const movieId = Number(id);
  const localMovie = localMovies.find((movie) => movie.id === movieId);

  if (localMovie) {
    return localMovie;
  }

  return getTmdbMovieById(movieId);
}
