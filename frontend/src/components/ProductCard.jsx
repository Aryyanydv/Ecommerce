import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ProductCard.css";

function ProductCard({ brand }) {
  const navigate =
    useNavigate();

  const [products, setProducts] =
    useState([]);

  const [wishlist, setWishlist] =
    useState([]);

  /* AUTH */

  const getAuthConfig =
    () => {
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

  /* PRODUCTS */

  const fetchProduct =
    async () => {
      try {
        const response =
          await axios.get(
            `http://localhost:5000/products/brand/${brand}`
          );

        setProducts(
          response.data
        );
      } catch (error) {
        console.log(
          "Error fetching products",
          error
        );
      }
    };

  /* WISHLIST */

  const fetchWishlist =
    async () => {
      try {
        const response =
          await axios.get(
            "http://localhost:5000/wishlist",
            getAuthConfig()
          );

        const wishlistIds =
          response.data.items.map(
            (item) =>
              item.productId
                ?._id ||
              item.productId
          );

        setWishlist(
          wishlistIds
        );
      } catch (error) {
        console.log(
          "Error fetching wishlist",
          error
        );
      }
    };

  useEffect(() => {
    fetchProduct();
    fetchWishlist();
  }, [brand]);

  /* TOGGLE */

  const toggleWishlist =
    async (
      e,
      productId,
      variantId
    ) => {
      e.stopPropagation();

      const isWishlisted =
        wishlist.includes(
          productId
        );

      try {
        if (
          isWishlisted
        ) {
          await axios.post(
            "http://localhost:5000/wishlist/remove",
            {
              productId,
              variantId,
            },
            getAuthConfig()
          );

          setWishlist(
            (prev) =>
              prev.filter(
                (id) =>
                  id !==
                  productId
              )
          );
        } else {
          await axios.post(
            "http://localhost:5000/wishlist/add",
            {
              productId,
              variantId,
            },
            getAuthConfig()
          );

          setWishlist(
            (prev) => [
              ...prev,
              productId,
            ]
          );
        }
      } catch (error) {
        console.log(
          "Wishlist error",
          error
        );
      }
    };

  return (
    <div className="product-section">

      <h2 className="section-title">
        {brand} Products
      </h2>

      <div className="product-container">

        {products.map(
          (
            product
          ) => {
            const isWishlisted =
              wishlist.includes(
                product._id
              );

            return (
              <div
                key={
                  product._id
                }
                className="product-card"
                onClick={() =>
                  navigate(
                    `/product/${product._id}`
                  )
                }
              >

                <div className="product-image-container">

                  <img
                    src={`http://localhost:5000/${product.images?.[0]?.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={
                      product.name
                    }
                    className="product-image"
                  />

                  {/* HEART BUTTON */}

                  <button
                    className={`product-heart-btn ${
                      isWishlisted
                        ? "heart-active"
                        : ""
                    }`}
                    onClick={(
                      e
                    ) =>
                      toggleWishlist(
                        e,
                        product._id,
                        product
                          .variants?.[0]
                          ?._id
                      )
                    }
                  >
                    ♥
                  </button>

                </div>

                <div className="product-info">

                  <h3 className="product-name">
                    {
                      product.name
                    }
                  </h3>

                  <p className="product-brand">
                    {
                      product.brand
                    }
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

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}

export default ProductCard;