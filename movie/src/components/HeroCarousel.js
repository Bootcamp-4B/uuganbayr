"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroCarousel({ movies }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = movies.slice(0, 3);

  useEffect(() => {
    if (slides.length < 2) {
      return undefined;
    }

    const timer = setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) {
    return null;
  }

  function showPrevious() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? slides.length - 1 : currentIndex - 1,
    );
  }

  function showNext() {
    setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
  }

  return (
    <section className="hero hero-carousel" aria-label="Top movies">
      <div
        className="hero-track"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((movie, index) => (
          <article className="hero-slide" key={movie.id}>
            <Image
              src={movie.cover}
              alt={movie.title}
              fill
              priority={index === 0}
              className="hero-image"
            />
            <div className="hero-dark" />
            <div className="hero-content">
              <p className="small-title">Top movie #{index + 1}</p>
              <h1>{movie.title}</h1>
              <p>{movie.description}</p>
              <Link href={`/movies/${movie.id}`} className="primary-button">
                Movie details
              </Link>
            </div>
          </article>
        ))}
      </div>

      {slides.length > 1 ? (
        <>
          <button
            className="hero-nav hero-nav-left"
            type="button"
            onClick={showPrevious}
            aria-label="Previous movie"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            className="hero-nav hero-nav-right"
            type="button"
            onClick={showNext}
            aria-label="Next movie"
          >
            <ChevronRight size={22} />
          </button>
          <div className="hero-dots" aria-label="Choose top movie">
            {slides.map((movie, index) => (
              <button
                key={movie.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={activeIndex === index ? "active-dot" : ""}
                aria-label={`Show ${movie.title}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
