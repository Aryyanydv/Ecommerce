import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  useNavigate,
  Link
} from "react-router-dom";

import "../styles/ProfilePage.css";

function ProfilePage() {

  const navigate =
    useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  
  const handleLogout = async () => {
  try {
    const token =
      localStorage.getItem("token");

    await fetch(
      "http://localhost:5000/logout",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }

  // Remove user data
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  navigate("/login");
};

  return (
    <div className="profile-page">

      <Header />

      <div className="profile-container">

        <div className="profile-card">

          <img
            src={
              user?.profileImage
                ? `http://localhost:5000/${user.profileImage.replace(
                    /\\/g,
                    "/"
                  )}`
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="profile"
            className="profile-image"
          />

          <h2>
            {user?.name}
          </h2>

          <p className="profile-email">
            {user?.emailId}
          </p>

          <div className="profile-info">

            <div className="profile-item">
              📱 {user?.phoneNumber}
            </div>

            <div className="profile-item">
              🚻 {user?.gender}
            </div>

            <div className="profile-item">
              💰 Wallet ₹0
            </div>

            <Link
              to="/orders"
              className="profile-item link-item"
            >
              📦 My Orders
            </Link>

            <Link
              to="/contact"
              className="profile-item link-item"
            >
              📞 Contact Us
            </Link>

          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

      <Footer />

    </div>
  );
}

export default ProfilePage;