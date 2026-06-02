"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";

export default function SearchClient({ initialQuery, movies }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState(initialQuery);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  useEffect(() => {
    setSearchText(searchParams.get("q") || "");
  }, [searchParams]);

  function updateSearchText(nextSearchText) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextSearchText.trim()) {
      params.set("q", nextSearchText);
    } else {
      params.delete("q");
    }

    setSearchText(nextSearchText);
    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname, {
      scroll: false,
    });
  }

  return (
    <main className="page simple-page">
      <h1>Search</h1>
      <input
        value={searchText}
        onChange={(event) => updateSearchText(event.target.value)}
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
