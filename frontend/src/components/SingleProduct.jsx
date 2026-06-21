import {
  useEffect,
  useState
} from "react";

import axios from "axios";
import {
  useNavigate
} from "react-router-dom";

import "../styles/SingleProduct.css";

function SingleProduct() {
  const [product, setProduct] =
    useState(null);

  const navigate =
    useNavigate();

  const fetchDiorProduct =
    async () => {
      try {
        const response =
          await axios.get(
            "http://localhost:5000/products?search=dior"
          );

        setProduct(
          response.data[0]
        );
      } catch (error) {
        console.log(
          "Error fetching Dior product:",
          error
        );
      }
    };

  useEffect(() => {
    fetchDiorProduct();
  }, []);

  if (!product) {
    return (
      <div className="hero-loading">
        Loading...
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

        {/* LEFT */}
        <div className="hero-left">

          <span className="hero-bg-text">
            ELEGANCE
          </span>

          <p className="hero-tag">
            MAISON DIOR × JORDAN
          </p>

          <h1 className="hero-title">
            Luxury
            <br />
            Has A Pace
          </h1>

          <p className="hero-description">
            More than
            footwear —
            an expression of
            prestige.
            Crafted for those
            who appreciate
            rare details,
            timeless design,
            and effortless
            elegance.
          </p>

          <div className="hero-price">
            ₹
            {
              product
                ?.variants?.[0]
                ?.price
            }
          </div>

        </div>

        {/* RIGHT */}
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

export default SingleProduct;