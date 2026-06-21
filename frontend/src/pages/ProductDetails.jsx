import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] =
    useState(null);

  const [selectedImage,
    setSelectedImage] =
    useState("");

  const [selectedVariant,
    setSelectedVariant] =
    useState(null);

  const [quantity,
    setQuantity] =
    useState(1);

  const fetchProductDetails =
    async () => {
      try {
        const response =
          await axios.get(
            `http://localhost:5000/product/${id}`
          );

        setProduct(
          response.data
        );

        // Default variant
        if (
          response.data
            ?.variants?.length
        ) {
          setSelectedVariant(
            response.data
              .variants[0]
          );
        }

        // Default image
        setSelectedImage(
          response.data
            .images?.[0]
        );

      } catch (error) {
        console.log(
          "Error fetching product details:",
          error
        );
      }
    };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleAddToCart =
    async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const response =
          await axios.post(
            "http://localhost:5000/cart/add",
            {
              productId:
                product._id,

              variantId:
                selectedVariant._id,

              quantity
            },
            {
              headers,
              withCredentials: true
            }
          );

        console.log(
          response.data
        );
        navigate("/cart");

      } catch (error) {
        console.log(
          "Error in handleAddToCart:",
          error
        );
      }
    };

  // Loading state
  if (!product) {
    return (
      <>
        <Header />
        <h2 className="loading-text">
          Loading...
        </h2>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="product-details-page">

      <div className="product-details-container">
        <div className="product-image-section">
          <div className="main-image-container">
            <img
              src={`http://localhost:5000/${selectedImage?.replace(
                /\\/g,
                "/"
              )}`}
              alt={product?.name}
              className="product-image"
            />
          </div>
          <div className="thumbnail-container">
            {product.images?.map(
              (
                image,
                index
              ) => (
                <img
                  key={index}
                  src={`http://localhost:5000/${image.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt={`thumbnail-${index}`}
                  className={`thumbnail-image ${
                    selectedImage ===
                    image
                      ? "active-thumbnail"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedImage(
                      image
                    )
                  }
                />
              )
            )}
          </div>

        </div>
        <div className="product-info-section">

          <h1 className="product-name">
            {product?.name}
          </h1>

          <p className="product-brand">
            {product?.brand}
          </p>

          <div className="rating-section">
            ⭐{" "}
            {product?.averageRating ??
              "No ratings"}{" "}
            (
            {
              product?.totalReviews
            }{" "}
            reviews)
          </div>

          <p className="product-description">
            {
              product?.description
            }
          </p>

          <h2 className="product-price">
            ₹
            {
              selectedVariant?.price
            }
          </h2>

          <p className="product-color">
            Color:{" "}
            {
              selectedVariant?.color
            }
          </p>
          <div className="size-section">
            <h3 className="size-title">
              Select Size
            </h3>
            <div className="size-container">
              {product.variants?.map(
                (
                  variant
                ) => (
                  <button
                    key={
                      variant._id
                    }
                    className={`size-button ${
                      selectedVariant?._id ===
                      variant._id
                        ? "active-size"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedVariant(
                        variant
                      )
                    }
                  >
                    {
                      variant.size
                    }
                  </button>
                )
              )}
            </div>

          </div>

          <div className="quantity-section">

            <h3 className="quantity-title">
              Quantity
            </h3>

            <div className="quantity-controls">

              <button
                className="quantity-button"
                onClick={() =>
                  setQuantity(
                    Math.max(
                      1,
                      quantity -
                        1
                    )
                  )
                }
              >
                -
              </button>

              <span className="quantity-value">
                {quantity}
              </span>

              <button
                className="quantity-button"
                onClick={() =>
                  setQuantity(
                    quantity +
                      1
                  )
                }
              >
                +
              </button>

            </div>

          </div>
          <p className="stock-info">
            Stock Available:{" "}
            {
              selectedVariant?.stock
            }
          </p>

          <button
            className="add-to-cart-button"
            onClick={
              handleAddToCart
            }
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default ProductDetails;