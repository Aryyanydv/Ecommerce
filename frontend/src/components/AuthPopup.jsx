import { useNavigate } from "react-router-dom";
import "../styles/AuthPopup.css";

function AuthPopup({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="popup-overlay">
      <div className="auth-popup">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h1>Welcome to ShoeStore 👟</h1>

        <p>
          Login or create an account to explore premium sneakers,
          wishlist products and enjoy the best experience.
        </p>

        <div className="popup-buttons">
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="signup-btn"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPopup;