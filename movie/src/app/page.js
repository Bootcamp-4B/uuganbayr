import Image from "next/image";
import Link from "next/link";
import MovieSection from "@/components/MovieSection";
import { movies } from "@/data/movies";

export default function Home() {
  const firstMovie = movies[0];

  return (
    <main className="page">
      <section className="hero">
        <Image
          src={firstMovie.cover}
          alt={firstMovie.title}
          fill
          priority
          className="hero-image"
        />
        <div className="hero-dark" />
        <div className="hero-content">
          <p className="small-title">Featured movie</p>
          <h1>{firstMovie.title}</h1>
          <p>{firstMovie.description}</p>
          <Link href={`/movies/${firstMovie.id}`} className="primary-button">
            Movie details
          </Link>
        </div>
      </section>

      <MovieSection title="Popular Movies" movies={movies.slice(0, 6)} />
      <MovieSection title="Top Rated" movies={movies.slice(3, 9)} />
      <MovieSection title="Coming Soon" movies={movies.slice(1, 7)} />
    </main>
  );
}
