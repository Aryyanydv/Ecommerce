import {
  useState,
  useEffect
} from "react";

import axios from "axios";

import {
  useSearchParams,
  useNavigate
} from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/SearchResults.css";

function SearchResults() {
  const [searchParams] =
    useSearchParams();

  const navigate =
    useNavigate();

  const searchQuery =
    searchParams.get("q") || "";

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const getAuthConfig = () => {
    const token =
      localStorage.getItem(
        "token"
      );

    return {
      headers: token
        ? {
            Authorization:
              `Bearer ${token}`,
          }
        : {},
      withCredentials: true,
    };
  };

  const fetchSearchResults =
    async () => {
      if (!searchQuery.trim()) {
        setProducts([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response =
          await axios.get(
            `http://localhost:5000/products/search?search=${encodeURIComponent(
              searchQuery
            )}`
          );

        setProducts(
          response.data.data || []
        );

        if (
          !response.data.data ||
          response.data.data.length ===
            0
        ) {
          setError(
            "No products found"
          );
        }
      } catch (err) {
        console.log(
          "Search error",
          err
        );

        setError(
          "Error fetching search results"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchSearchResults();
  }, [searchQuery]);

  return (
    <div className="search-results-page">
      <Header />

      <div className="search-results-container">
        <h1 className="search-title">
          Search Results for "
          {searchQuery}"
        </h1>

        {loading && (
          <h2 className="loading-text">
            Loading...
          </h2>
        )}

        {error && !loading && (
          <div className="error-message">
            {error}
          </div>
        )}

        {products.length > 0 && (
          <div className="results-grid">
            {products.map(
              (product) => (
                <div
                  key={product._id}
                  className="search-product-card"
                  onClick={() =>
                    navigate(
                      `/product/${product._id}`
                    )
                  }
                >
                  <div className="product-image-wrapper">
                    <img
                      src={`http://localhost:5000/${product.images?.[0]?.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt={product.name}
                      className="product-image"
                    />
                  </div>

                  <h3 className="product-name">
                    {product.name}
                  </h3>

                  <p className="product-brand">
                    {product.brand}
                  </p>

                  <p className="product-price">
                    ₹
                    {
                      product
                        .variants?.[0]
                        ?.price
                    }
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default SearchResults;
