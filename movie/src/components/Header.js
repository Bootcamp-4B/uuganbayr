import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="header">
      <Link href="/" className="logo">
        <Logo />
      </Link>

      <nav className="top-nav">
        <Link href="/genres" className="genre-select">
         ⌄ Genre
        </Link>
        <Link href="/search" className="header-search">
          <span>⌕</span>
          <span className="header-search-text">Search...</span>
        </Link>
      </nav>

      <div className="header-actions">
        <ThemeToggle />
      </div>
    </header>
  );
}
