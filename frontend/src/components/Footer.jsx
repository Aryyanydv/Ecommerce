import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <Link
        to="/home"
        className="footer-item"
      >
        <span>🏠</span>
        <p>Home</p>
      </Link>

      <Link
        to="/orders"
        className="footer-item"
      >
        <span>📦</span>
        <p>Orders</p>
      </Link>

      <Link
        to="/cart"
        className="footer-item"
      >
        <span>🛒</span>
        <p>Cart</p>
      </Link>

      <Link
        to="/profile"
        className="footer-item"
      >
        <span>👤</span>
        <p>Profile</p>
      </Link>

    </footer>
  );
}

export default Footer;

