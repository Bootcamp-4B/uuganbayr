import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MovieCard({ movie }) {
  return (
    <Link href={`/movies/${movie.id}`} className="movie-card">
      <span className="movie-card-media">
        <Image
          src={movie.image}
          alt={movie.title}
          width={160}
          height={235}
          className="movie-poster"
        />
        <span className="movie-rating-badge">⭐ {movie.rating}</span>
        <span className="movie-card-overlay">
          <span>
            View details
            <ArrowRight size={15} strokeWidth={2} />
          </span>
        </span>
      </span>
      <h3>{movie.title}</h3>
      <p>
        {movie.year} • ⭐ {movie.rating}
      </p>
    </Link>
  );
}
