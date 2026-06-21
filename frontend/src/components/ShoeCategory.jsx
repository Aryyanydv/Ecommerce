import { useNavigate } from "react-router-dom";
import "../styles/ShoeCategory.css";

function ShoeCategory() {
  const navigate = useNavigate();

  return (
    <div className="shoe-category-container">

      <div
        className="shoe-category-card"
        onClick={() => navigate("/sneakers/shoes")}
      >
        <span className="shoe-category-title">
          Sneakers
        </span>

        <img
          src="https://tse3.mm.bing.net/th/id/OIP.dWnFGCTrWU6Hv3IkOV46aAHaFj?pid=Api&P=0&h=180"
          alt="Sneakers"
          className="shoe-category-image"
        />
      </div>

      <div
        className="shoe-category-card"
        onClick={() => navigate("/sports/shoes")}
      >
        <span className="shoe-category-title">
          Sports
        </span>

        <img
          src="https://thumbs.dreamstime.com/b/closeup-athletes-wearing-sports-shoes-standing-circle-green-grass-top-view-157334858.jpg"
          alt="Sports"
          className="shoe-category-image"
        />
      </div>

    </div>
  );
}

export default ShoeCategory;