import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/WishlistPage.css";

function WishlistPage() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const getAuthConfig = () => {
    const token =
      localStorage.getItem("token");

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

  const fetchWishlist =
    async () => {
      try {
        const response =
          await axios.get(
            "http://localhost:5000/wishlist",
            getAuthConfig()
          );

        setWishlist(
          response.data.data.items
        );
      } catch (error) {
        console.log(
          "Wishlist error",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeWishlist =
    async (
      productId,
      variantId
    ) => {
      try {
        await axios.post(
          "http://localhost:5000/wishlist/remove",
          {
            productId,
            variantId,
          },
          getAuthConfig()
        );

        setWishlist((prev) =>
          prev.filter(
            (item) =>
              !(
                item.productId._id ===
                  productId &&
                item.variantId._id ===
                  variantId
              )
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

  const moveToCart =
    async (itemId) => {
      try {
        await axios.post(
          `http://localhost:5000/move-to-cart/${itemId}`,
          {},
          getAuthConfig()
        );

        fetchWishlist();
      } catch (error) {
        console.log(error);
      }
    };

  if (loading) {
    return (
      <>
        <Header />
        <h2 className="wishlist-loading">
          Loading...
        </h2>
        <Footer />
      </>
    );
  }

  if (wishlist.length === 0) {
    return (
      <>
        <Header />

        <div className="wishlist-empty">
          <h1>
            Your Wishlist is Empty
            🤍
          </h1>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="wishlist-page">
        <h1 className="wishlist-title">
          My Wishlist
        </h1>

        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="wishlist-card"
              onClick={() =>
                navigate(
                  `/product/${item.productId._id}`
                )
              }
            >
              <img
                src={`http://localhost:5000/${item.productId.images?.[0]?.replace(
                  /\\/g,
                  "/"
                )}`}
                alt={
                  item.productId.name
                }
                className="wishlist-image"
              />
             {console.log(item)}
              <div className="wishlist-info">
                <h3 style={{ color: "#fff" }}>
                  {
                    item.productId
                      .name
                  }
                </h3>

                <p style={{ color: "#fff" }}>
                  {
                    item.productId
                      .brand
                  }
                </p>

                <p style={{ color: "#fff" }}>
                  Size:{" "}
                  {
                    item.variantId
                      ?.size
                  }
                </p>

                <p style={{ color: "#fff" }}>
                  Color:{" "}
                  {
                    item.variantId
                      ?.color
                  }
                </p>

                <h2 style={{ color: "#fff" }}>
                  ₹
                  {
                    item.variantId
                      ?.price
                  }
                </h2>

                <div className="wishlist-actions">
                  <button
                    className="move-btn"
                    onClick={(e) => {
                      e.stopPropagation();

                      moveToCart(
                        item._id
                      );
                    }}
                  >
                    Move To Cart
                  </button>

                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();

                      removeWishlist(
                        item.productId
                          ._id,
                        item.variantId
                          ._id
                      );
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default WishlistPage;