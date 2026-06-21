import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "../styles/MenPage.css";

function CategoryPage({ category, title }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/products/search?search=${encodeURIComponent(
        category
      )}`
    );

    console.log(response.data);

    setProducts(response.data.data);

  } catch (error) {
    console.log("Error fetching products", error);
  }
};

    

  useEffect(() => {
    fetchProducts();
  }, [category]);

  return (
    <div className="men-page">
      <Header />

      <div className="mens-container">
        <h1 className="mens-heading">{title}</h1>

        <div className="mens-products">
          {products.map((product, index) => (
            <div
              key={`${product._id}-${index}`}
              className="product-card"
              onClick={() =>
                navigate(`/product/${product._id}`)
              }
            >
              <img
  src={`http://localhost:5000/${product?.images?.[0]?.replace(
    /\\/g,
    "/"
  )}`}
  alt={product?.name}
  className="product-image"
/>

              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CategoryPage;