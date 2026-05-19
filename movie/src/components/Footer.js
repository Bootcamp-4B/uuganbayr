import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-column">
        <div className="footer-logo">
          <Logo />
        </div>
        <p>© 2026clea Movie Z. All Rights Reserved.</p>
      </div>

      <div className="footer-column">
        <h3>Contact Information</h3>
        <div className="footer-info">
          <span>✉</span>
          <p>
            <b>Email:</b>
            <br />
            support@movieZ.com
          </p>
        </div>
        <div className="footer-info">
          <span>⌕</span>
          <p>
            <b>Phone:</b>
            <br />
            +976 (11) 123-4567
          </p>
        </div>
      </div>

      <div className="footer-column">
        <h3>Follow us</h3>
        <div className="footer-links">
          <a href="#">Pinecone</a>
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">Twitter</a>
          <a href="#">Youtube</a>
        </div>
      </div>
    </footer>
  );
}
