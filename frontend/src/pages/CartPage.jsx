import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/CartPage.css";


function CartPage() {
  const [cart, setCart] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [fallbackInfo, setFallbackInfo] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [address, setAddress] = useState({ fullName: "", phone: "", pincode: "", city: "", state: "", addressLine: "" });
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [useWallet, setUseWallet] = useState(false);
  const navigate = useNavigate();

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true
    };
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:5000/cart", getAuthConfig());
      setCart(response.data);
    } catch (error) {
      console.log("error in fetching cart", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, variantId, quantity) => {
    try {
      await axios.put("http://localhost:5000/cart/update", { productId, variantId, quantity }, getAuthConfig());
      fetchCart();
    } catch (error) {
      console.log("error in updating the quantity", error);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${cartItemId}`, getAuthConfig());
      fetchCart();
    } catch (error) {
      console.log("Error removing item:", error);
    }
  };

  const applyCoupon = async () => {
    try {
      await axios.post("http://localhost:5000/coupon/apply", { couponCode }, getAuthConfig());
      fetchCart();
      setCouponCode("");
    } catch (error) {
      console.log("Coupon error:", error);
    }
  };

  const removeCoupon = async () => {
    try {
      await axios.post("http://localhost:5000/cart/remove-coupon", {}, getAuthConfig());
      fetchCart();
    } catch (error) {
      console.log("Error removing coupon:", error);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (!cart || !cart.items.length) return;
    setCheckoutError("");
    setShowCheckoutModal(true);
  };

  const confirmCheckout = async () => {
    setShowCheckoutModal(false);
    setIsCheckingOut(true);
    setCheckoutError("");
    try {
      if (paymentMethod === "COD") {
        const placeResponse = await axios.post(
          "http://localhost:5000/order/place",
          { address, paymentMethod: "COD", useWallet, couponCode: cart.coupon || null },
          getAuthConfig()
        );
        if (placeResponse.data.success) {
          navigate("/orders");
        }
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/create-razorpay-order",
        { couponCode: cart.coupon || null, useWallet },
        getAuthConfig()
      );
      if (!response.data.success) throw new Error(response.data.message || "Checkout error");
      const data = response.data.data;
      if (data.fallback === "razorpay_limit") {
        setCheckoutError(`Razorpay limit error: ${data.razorpayError || "Amount exceeds maximum allowed."}`);
        setFallbackInfo(data);
        return;
      }
      if (!data.paymentRequired) {
        const placeResponse = await axios.post(
          "http://localhost:5000/order/place",
          { address, paymentMethod: "ONLINE", useWallet, couponCode: data.coupon || null },
          getAuthConfig()
        );
        if (placeResponse.data.success) navigate("/orders");
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setCheckoutError("Unable to load Razorpay checkout. Please try again.");
        return;
      }

      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const options = {
        key: "rzp_test_SYtgn2sWZzGPAa",
        amount: data.amount,
        currency: data.currency,
        name: "eCommerce Shop",
        description: "Complete your purchase",
        order_id: data.razorpayOrderId,
        prefill: { email: userData.emailId || "", contact: userData.phoneNumber || "" },
        theme: { color: "#3399cc" },
        handler: async function (razorpayResponse) {
          try {
            const verifyResponse = await axios.post(
              "http://localhost:5000/verify-payment",
              {
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
                address,
                couponCode: cart.coupon || null,
                useWallet
              },
              getAuthConfig()
            );
            if (verifyResponse.data.success) {
              navigate("/orders");
            } else {
              setCheckoutError(verifyResponse.data.message || "Payment verification failed");
            }
          } catch (err) {
            console.error("Payment verify failed", err);
            setCheckoutError("Payment verification failed. Please contact support.");
          }
        }
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("confirmCheckout error", err);
      setCheckoutError(err.response?.data?.message || err.message || "Checkout failed");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
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

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <Header />
        <div className="empty-cart">
          <h1>
            Your Cart is Empty ??
          </h1>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="cart-page">
  
      <h1 className="cart-heading">
        Shopping Cart
      </h1>
      <div className="cart-container">
        <div className="cart-items-section">
          {cart.items.map((item) => (
            <div key={item.cartItemId} className="cart-item">
              <img
                src={`http://localhost:5000/${item.image?.replace(/\\/g, "/")}`}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-info">
                <h2 className="cart-item-name">{item.name}</h2>
                <p className="cart-item-brand">{item.brand}</p>
                <p className="cart-item-size">
                  Size: {" "}
                  {item.variant.size}
                </p>
                <p className="cart-item-color">
                  Color: {" "}
                  {item.variant.color}
                </p>
                <h3 className="cart-item-price">₹{item.variant.price}</h3>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.productId, item.variant.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.productId, item.variant.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button className="remove-btn" onClick={() => removeItem(item.cartItemId)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary-section">
          <h2 className="summary-title">Coupon</h2>
          {!cart.coupon ? (
            <div className="coupon-section">
              <input
                type="text"
                placeholder="Enter coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="coupon-input"
              />
              <button className="apply-coupon-btn" onClick={applyCoupon}>
                Apply
              </button>
            </div>
          ) : (
            <div className="coupon-applied">
              <p>
                Coupon: <strong>{cart.coupon}</strong>
              </p>
              <button className="remove-coupon-btn" onClick={removeCoupon}>
                Remove Coupon
              </button>
            </div>
          )}

          <div className="price-details">
            <h3>Subtotal: ₹{cart.totalPrice}</h3>
            <h3>Discount: ₹{cart.discount}</h3>
            <h2>Total: ₹{cart.finalPrice}</h2>
          </div>
          {checkoutError && (
            <div className="checkout-error">
              <p>{checkoutError}</p>
              {fallbackInfo && fallbackInfo.fallback === "razorpay_limit" && (
                <>
                  <p>This amount exceeds Razorpay test gateway limits.</p>
                  <button
                    className="retry-btn"
                    onClick={async () => {
                      setCheckoutError("");
                      setIsCheckingOut(true);
                      try {
                        const placeResponse = await axios.post(
                          "http://localhost:5000/order/place",
                          {
                            address: null,
                            paymentMethod: "ONLINE",
                            useWallet: false,
                            couponCode: cart.coupon || null,
                            forcePaymentSuccess: true
                          },
                          getAuthConfig()
                        );
                        if (placeResponse.data.success) {
                          navigate("/orders");
                        }
                      } catch (err) {
                        console.error("Fallback order failed", err);
                        setCheckoutError(err.response?.data?.message || err.message || "Fallback order failed");
                      } finally {
                        setIsCheckingOut(false);
                        setFallbackInfo(null);
                      }
                    }}
                    disabled={isCheckingOut}
                  >
                    Place order without Razorpay
                  </button>
                </>
              )}
              {!fallbackInfo && (
                <div style={{ marginTop: 8 }}>
                  <button className="retry-btn" onClick={() => { setCheckoutError(""); handleCheckout(); }} disabled={isCheckingOut}>
                    Retry Payment
                  </button>
                </div>
              )}
            </div>
          )}
          <button className="checkout-btn" onClick={handleCheckout} disabled={isCheckingOut}>
            {isCheckingOut ? "Processing..." : "Proceed To Checkout"}
          </button>
          {showCheckoutModal && (
            <div className="checkout-modal-backdrop">
              <div className="checkout-modal">
                <h3>Select / Add Address</h3>
                <div className="address-form">
                  <input placeholder="Full name" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
                  <input placeholder="Phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                  <input placeholder="Pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
                  <input placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                  <input placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                  <input placeholder="Address line" value={address.addressLine} onChange={(e) => setAddress({ ...address, addressLine: e.target.value })} />
                </div>
                <h3>Payment Method</h3>
                <div className="payment-methods">
                  <label>
                    <input type="radio" name="payment" value="ONLINE" checked={paymentMethod === "ONLINE"} onChange={() => setPaymentMethod("ONLINE")} /> Online
                  </label>
                  <label>
                    <input type="radio" name="payment" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} /> Cash on Delivery
                  </label>
                </div>
                <label style={{ display: "block", marginTop: 8 }}>
                  <input type="checkbox" checked={useWallet} onChange={(e) => setUseWallet(e.target.checked)} /> Use wallet balance (if available)
                </label>
                <div style={{ marginTop: 12 }}>
                  <button className="confirm-btn" onClick={confirmCheckout}>Confirm &amp; Pay</button>
                  <button className="cancel-btn" onClick={() => setShowCheckoutModal(false)} style={{ marginLeft: 8 }}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
    <Footer />
    </>
  );
}

export default CartPage;
