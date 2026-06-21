import { useNavigate } from "react-router-dom";
import "../styles/GenderPage.css";

function GenderPage() {
  const navigate = useNavigate();

  return (
    <div className="gender-page">

      {/* Men's Section */}
      <div
        className="gender-card"
        onClick={() => navigate("/products/men")}
      >
        <span className="gender-title">Men</span>
        <img
          src="https://images.prismic.io/bobbies/ahbl-rK9tuLqELs9_Rectangle267.jpg?lossless=1"
          alt="Men"
        />
      </div>

      {/* Women's Section */}
      <div
        className="gender-card"
        onClick={() => navigate("/products/women")}
      >
        <span className="gender-title">Women</span>
        <img
          src="https://s.yimg.com/ny/api/res/1.2/WLWWT.3ez7UfLSzRdkWPAQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTEyNzk-/https://media.zenfs.com/en/who_what_wear_561/707b99f9ec78fda045cfe4b632c8fe19"
          alt="Women"
        />
      </div>

      {/* Unisex Section */}
      <div
        className="gender-card"
        onClick={() => navigate("/products/unisex")}
      >
        <span className="gender-title">Unisex</span>
        <img
          src="https://static.vecteezy.com/system/resources/previews/017/660/113/non_2x/love-story-told-by-boots-human-feet-close-up-man-and-woman-in-sneakers-girl-in-white-shoes-guy-in-black-sneakers-and-denim-hipster-couple-in-summer-legs-close-up-photo.jpg"
          alt="Unisex"
        />
      </div>

    </div>
  );
}

export default GenderPage;