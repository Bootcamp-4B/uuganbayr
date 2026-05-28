import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MovieCard from "./MovieCard";

export default function MovieSection({ title, movies, seeMoreHref }) {
  return (
    <section className="movie-section">
      <div className="movie-section-head">
        <h2>{title}</h2>
      </div>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      {seeMoreHref ? (
        <Link href={seeMoreHref} className="section-see-more">
          <span>See more</span>
          <ArrowRight size={28} strokeWidth={1.8} />
        </Link>
      ) : null}
    </section>
  );
}
