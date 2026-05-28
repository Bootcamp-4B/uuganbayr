import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "@/components/MovieCard";

const PAGE_SIZE = 12;

function getPageItems(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "end-ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "start-ellipsis", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "start-ellipsis", currentPage, "end-ellipsis", totalPages];
}

function getCurrentPage(searchParams, totalPages) {
  const requestedPage = Number(searchParams?.page || 1);
  const validPage = Number.isFinite(requestedPage) ? requestedPage : 1;

  return Math.min(Math.max(validPage, 1), totalPages);
}

function pageHref(basePath, page) {
  return page === 1 ? basePath : `${basePath}?page=${page}`;
}

export default function PaginatedMoviePage({ basePath, movies, searchParams, title }) {
  const totalPages = Math.max(1, Math.ceil(movies.length / PAGE_SIZE));
  const currentPage = getCurrentPage(searchParams, totalPages);
  const pageMovies = movies.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pageItems = getPageItems(currentPage, totalPages);

  return (
    <main className="page popular-page">
      <div className="popular-header">
        <h1>{title}</h1>
      </div>

      <div className="movie-grid">
        {pageMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <nav className="pagination" aria-label={`${title} pagination`}>
        <Link
          href={pageHref(basePath, Math.max(1, currentPage - 1))}
          className={`pagination-step ${currentPage === 1 ? "disabled" : ""}`}
          aria-disabled={currentPage === 1}
        >
          <ChevronLeft size={24} strokeWidth={2.2} />
          <span>Previous</span>
        </Link>

        <div className="pagination-pages">
          {pageItems.map((item) =>
            typeof item === "number" ? (
              <Link
                href={pageHref(basePath, item)}
                className={`pagination-number ${item === currentPage ? "active" : ""}`}
                aria-current={item === currentPage ? "page" : undefined}
                key={item}
              >
                {item}
              </Link>
            ) : (
              <span className="pagination-ellipsis" key={item}>
                ...
              </span>
            ),
          )}
        </div>

        <Link
          href={pageHref(basePath, Math.min(totalPages, currentPage + 1))}
          className={`pagination-step ${currentPage === totalPages ? "disabled" : ""}`}
          aria-disabled={currentPage === totalPages}
        >
          <span>Next</span>
          <ChevronRight size={24} strokeWidth={2.2} />
        </Link>
      </nav>
    </main>
  );
}
