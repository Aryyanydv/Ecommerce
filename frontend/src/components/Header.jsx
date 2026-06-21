import "../styles/Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Header() {
  const navigate = useNavigate();

  const [walletBalance, setWalletBalance] = useState(0);

  const [searchInput, setSearchInput] = useState("");

  const [editions, setEditions] = useState([]);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
      withCredentials: true,
    };
  };

  const fetchWallet = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/wallet",
        getAuthConfig(),
      );

      setWalletBalance(response.data.balance || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEditions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");

      const uniqueEditions = [
        ...new Set(response.data.map((item) => item.name)),
      ];

      setEditions(uniqueEditions.slice(0, 6));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchInput.trim()) return;

    navigate(`/search?q=${encodeURIComponent(searchInput)}`);

    setSearchInput("");
  };

  useEffect(() => {
    fetchWallet();
    fetchEditions();
  }, []);

  return (
    <header className="luxury-header">
      <div className="upper-header">
        <div className="logo-box">
          <Link to="/home">
            <img src="" alt="logo" className="logo-image" />
          </Link>
        </div>
        <div className="search-box">
          <form onSubmit={handleSearch}>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search premium sneakers..."
                className="search-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />

              <button type="submit" className="search-btn">
                ⌕
              </button>
            </div>
          </form>
        </div>

       
        <div className="wishlist-box">
          <Link to="/wishlist" className="wishlist-btn">
            <span>♡</span>
            Wishlist
          </Link>
        </div>

     
        <div className="wallet-box">
          <div className="wallet-wrapper">
            <button className="wallet-btn">
              <span>◈</span>

              <div className="wallet-text">
                <small>Wallet</small>

                <p>₹{walletBalance}</p>
              </div>
            </button>

            <div className="wallet-popup">
              <h3>Wallet Balance</h3>

              <h2>₹{walletBalance}</h2>

              <p>Available Balance</p>
            </div>
          </div>
        </div>
      </div>

     
      <nav className="lower-header">
        <div className="dropdown">
          <span>Collection</span>

          <div className="dropdown-menu">
            <Link to="/products/men">Men's Shoes</Link>

            <Link to="/products/women">Women's Shoes</Link>

            <Link to="/products/unisex">Unisex</Link>
          </div>
        </div>

        <div className="dropdown">
          <span>Edition</span>

          <div className="dropdown-menu">
            {editions.map((edition, index) => (
              <Link key={index} to={`/search?q=${edition}`}>
                {edition}
              </Link>
            ))}
          </div>
        </div>

        <div className="dropdown">
          <span>Type</span>

          <div className="dropdown-menu">
            <Link to="/sports/shoes">Sports</Link>

            <Link to="/sneakers/shoes">Sneakers</Link>
          </div>
        </div>

        <div className="dropdown">
          <span>About Us</span>

          <div className="dropdown-menu">
            <Link to="/contact">Contact Us</Link>

            <Link to="/orders">Orders</Link>

            <Link to="/profile">Profile</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
