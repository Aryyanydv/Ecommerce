import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import SingleProduct from "../components/SingleProduct";
import HeroSection from "../components/HeroSection";
import GenderPage from "../components/GenderPage";
import ShoeCategory from "../components/ShoeCategory";
import AuthPopup from "../components/AuthPopup";

import { FaInstagram, FaGithub, FaEnvelope } from "react-icons/fa";

import "../styles/HomePage.css";

function HomePage() {
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowPopup(true);
    }
  }, []);

  return (
    <div className="home-page">
      <Header />

      {showPopup && <AuthPopup onClose={() => setShowPopup(false)} />}

      
      <SingleProduct />

    
      <GenderPage />

      <ShoeCategory />
      <HeroSection />

      <section className="products-section">
        <ProductCard brand="Nike" />
      </section>

      <section className="products-section">
        <ProductCard brand="Adidas" />
      </section>

      <section className="home-footer">
        <div className="footer-content">
          <div className="footer-box brand-box">
            <h2>ShoeStore</h2>
            <p>Find premium sneakers and trending footwear for every style.</p>
          </div>

          <div className="footer-box">
            <h3>Shop</h3>
            <p>Men</p>
            <p>Women</p>
            <p>Sports</p>
            <p>Casual</p>
          </div>

          <div className="footer-box">
            <h3>Support</h3>
            <p>Help Center</p>
            <p>Returns</p>
            <p>Shipping</p>
            <p>Privacy Policy</p>
          </div>

          <div className="footer-box">
            <h3>Connect With Me</h3>

            <div className="social-icons">
              <a href="#" target="_blank" rel="noreferrer">
                <FaInstagram />
              </a>

              <a href="#" target="_blank" rel="noreferrer">
                <FaGithub />
              </a>

              <a href="mailto:yourmail@gmail.com">
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 ShoeStore. All Rights Reserved.
        </div>
      </section>

      
      <Footer />
    </div>
  );
}

export default HomePage;
