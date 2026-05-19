import Image from "next/image";
import Link from "next/link";

export default function MovieCard({ movie }) {
  return (
    <Link href={`/movies/${movie.id}`} className="movie-card">
      <Image
        src={movie.image}
        alt={movie.title}
        width={160}
        height={235}
        className="movie-poster"
      />
      <h3>{movie.title}</h3>
      <p>
        {movie.year} • ⭐ {movie.rating}
      </p>
    </Link>
  );
}
