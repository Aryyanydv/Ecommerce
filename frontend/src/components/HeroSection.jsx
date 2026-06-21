import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/SingleProduct.css";

function HeroSection() {
  const [product, setProduct] = useState(null);

  const navigate = useNavigate();

  const fetchHeroProduct = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/products?search=panda"
      );

      setProduct(response.data[0]);
    } catch (error) {
      console.log(
        "Error fetching product:",
        error
      );
    }
  };

  useEffect(() => {
    fetchHeroProduct();
  }, []);

  if (!product) {
    return (
      <div className="hero-loading">
        Discovering Style...
      </div>
    );
  }

  return (
    <section
      className="hero-section"
      onClick={() =>
        navigate(
          `/product/${product._id}`
        )
      }
    >
      <div className="hero-overlay"></div>

      <div className="hero-container">

        {/* LEFT CONTENT */}
        <div className="hero-left">

          <span className="hero-bg-text">
            STYLE
          </span>

          <p className="hero-tag">
            TRENDY • FASHION • CLASSY
          </p>

          <h1 className="hero-title">
            Fashion
            <br />
            Starts
            <br />
            Here
          </h1>

          <p className="hero-description">
            Discover fashionable,
            trendy, and premium
            footwear crafted for
            every lifestyle.
            From streetwear vibes
            to timeless elegance,
            every pair is designed
            to elevate your look
            with confidence,
            comfort, and class.
          </p>

        </div>

        {/* RIGHT IMAGE */}
        <div className="hero-right">

          <div className="shoe-glow"></div>

          <img
            src={`http://localhost:5000/${product.images?.[0]?.replace(
              /\\/g,
              "/"
            )}`}
            alt={product.name}
            className="hero-shoe"
          />

        </div>

      </div>
    </section>
  );
}

export default HeroSection;