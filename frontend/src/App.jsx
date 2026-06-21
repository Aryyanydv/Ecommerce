import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/Orders";
import WishlistPage from "./pages/Wishlist";
import ContactUs from "./pages/ContactUs";
import SearchResults from "./pages/SearchResults";
import  WomenPage from "./pages/WomenPage";
import MenPage from "./pages/MenPage";
import UnisexPage from "./pages/UnisexPage";
import SportsPage from "./pages/SportsPage";
import SneakersPage from "./pages/SneakersPage";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Navigate to="/login" />
          }
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<SignUp />}
        />

       <Route path="/home" element={ <HomePage /> } />

       <Route path="/profile" element={ <ProfilePage /> } />

       <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

       <Route
          path="/cart"
          element={<CartPage />}
        />

       <Route
          path="/orders"
          element={<OrdersPage />}
        />

       <Route
          path="/wishlist"
          element={<WishlistPage />}
        />

       <Route
          path="/contact"
          element={<ContactUs />}
        />

       <Route
          path="/search"
          element={<SearchResults />}
        />

        <Route path="products/men" element={<MenPage />} />
        <Route path="/products/women" element={<WomenPage />} />
        <Route path="/products/unisex" element={<UnisexPage />} />

        <Route path="/sneakers/shoes" element={<SneakersPage />} />
        <Route path="/sports/shoes" element={<SportsPage />} /> 

      </Routes>

      

    </BrowserRouter>
  );
}

export default App;

