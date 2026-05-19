import Image from "next/image";
import Link from "next/link";
import { movies } from "@/data/movies";
import TrailerButton from "@/components/TrailerButton";

export function generateStaticParams() {
  return movies.map((movie) => ({
    id: movie.id.toString(),
  }));
}

function getYouTubeVideoId(url) {
  if (!url) {
    return "";
  }

  const parsedUrl = new URL(url);

  if (parsedUrl.hostname.includes("youtu.be")) {
    return parsedUrl.pathname.slice(1);
  }

  if (parsedUrl.pathname.startsWith("/embed/")) {
    return parsedUrl.pathname.split("/embed/")[1];
  }

  return parsedUrl.searchParams.get("v") || "";
}

export default function MovieDetailsPage({ params }) {
  const movie = movies.find((item) => item.id === Number(params.id));
  const similarMovies = movies.filter((item) => item.id !== movie?.id).slice(0, 6);

  if (!movie) {
    return (
      <main className="page simple-page">
        <h1>Movie not found</h1>
        <Link href="/" className="primary-button">
          Back home
        </Link>
      </main>
    );
  }

  const movieTags = movie.tags || [movie.genre];
  const trailerVideoId = movie.videoId || getYouTubeVideoId(movie.trailer);

  return (
    <main className="details-page">
      <section className="details-layout">
        <div className="details-title-row">
          <div>
            <h1>{movie.title}</h1>
            <p className="movie-meta">
              {movie.year} · PG · {movie.duration}
            </p>
          </div>

          <div className="rating-box">
            <p>Rating</p>
            <strong>⭐ {movie.rating}<span>/10</span></strong>
          </div>
        </div>

        <div className="details-media">
          <Image
            src={movie.image}
            alt={movie.title}
            width={240}
            height={360}
            className="details-poster"
            priority
          />

          <div className="trailer-preview">
            <Image
              src={movie.cover}
              alt={`${movie.title} trailer`}
              fill
              className="hero-image"
              priority
            />
            <div className="trailer-shade" />
            <TrailerButton title={movie.title} videoId={trailerVideoId} />
          </div>
        </div>

        <div className="details-tags">
          {movieTags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <p className="details-text">{movie.description}</p>

        <div className="movie-info-table">
          <div>
            <b>Director</b>
            <span>{movie.director}</span>
          </div>
          <div>
            <b>Writers</b>
            <span>{movie.writers || movie.director}</span>
          </div>
          <div>
            <b>Stars</b>
            <span>{movie.cast.join(" · ")}</span>
          </div>
        </div>

        <div className="more-heading">
          <h2>More like this</h2>
          <Link href="/">See more →</Link>
        </div>

        <div className="details-more-grid">
          {similarMovies.slice(0, 5).map((item) => (
            <Link href={`/movies/${item.id}`} className="details-more-card" key={item.id}>
              <Image
                src={item.image}
                alt={item.title}
                width={160}
                height={235}
                className="movie-poster"
              />
              <p>⭐ {item.rating}/10</p>
              <h3>{item.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
