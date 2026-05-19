import MovieCard from "./MovieCard";

export default function MovieSection({ title, movies }) {
  return (
    <section className="movie-section">
      <h2>{title}</h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
