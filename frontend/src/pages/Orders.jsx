import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Orders.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productsMap, setProductsMap] = useState({});
  const navigate = useNavigate();

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    };
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/order/history",
        getAuthConfig(),
      );
      setOrders(response.data.data || []);
    } catch (err) {
      console.log("Error fetching orders", err);
      setError("Could not load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchProductsForOrders = async () => {
      try {

  let productMap = {};

  for (
    let i = 0;
    i < orders.length;
    i++
  ) {

    const order =
      orders[i];

    for (
      let j = 0;
      j <
      order.items.length;
      j++
    ) {

      const item =
        order.items[j];

      // Skip if already fetched
      if (
        productMap[
          item.productId
        ]
      ) {
        continue;
      }

      const response =
        await axios.get(
          `http://localhost:5000/product/${item.productId}`
        );

      productMap[
        item.productId
      ] =
        response.data;
    }
  }

  setProductsMap(
    productMap
  );

} catch (err) {

  console.log(
    "Error fetching products",
    err
  );
}
    };
    fetchProductsForOrders();
  }, [orders]);

  if (loading) {
    return (
      <>
        <Header />
        <h2 className="orders-loading">Loading orders...</h2>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="orders-error">{error}</div>
        <Footer />
      </>
    );
  }

  if (!orders.length) {
    return (
      <>
        <Header />
        <div className="orders-empty">
          <h2>No orders yet</h2>
          <p>Your placed orders will appear here once checkout is complete.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="orders-page">
        <h1 className="orders-title">My Orders</h1>
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h2>Order #{order._id.slice(-8)}</h2>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="order-status">
                  <span>{order.orderStatus}</span>
                </div>
              </div>

              <div className="order-details">
                <p>
                  <strong>Payment:</strong> {order.paymentMethod} /{" "}
                  {order.paymentStatus}
                </p>
                <p>
                  <strong>Total:</strong> ₹{order.finalAmount}
                </p>
                <p>
                  <strong>Discount:</strong> ₹{order.discount}
                </p>
                <p>
                  <strong>Wallet Used:</strong> ₹{order.walletUsed || 0}
                </p>
                <p>
                  <strong>Coupon:</strong> {order.coupon || "None"}
                </p>
                <p style={{ gridColumn: "1 / -1" }}>
                  <strong>Shipping:</strong> {order.address?.fullName || ""} —{" "}
                  {order.address?.addressLine || ""},{" "}
                  {order.address?.city || ""}, {order.address?.state || ""}{" "}
                  {order.address?.pincode || ""} · {order.address?.phone || ""}
                </p>
                <p style={{ gridColumn: "1 / -1" }}>
                  <strong>Order ID:</strong> {order._id}
                </p>
              </div>

              <div className="order-items">
                <h4>Items</h4>
                {order.items.map((item) => {
                  const prod = productsMap[item.productId];
                  return (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="order-item"
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => prod && navigate(`/product/${prod._id}`)}
                      >
                        <img
                          src={
                            prod?.images?.[0]
                              ? `http://localhost:5000/${prod.images[0].replace(/\\/g, "/")}`
                              : `http://localhost:5000/uploads/1774783497933.avif`
                          }
                          alt={prod?.name || "Product"}
                          style={{
                            width: 72,
                            height: 72,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                        <div>
                          <p className="item-name">
                            {prod?.name || item.productId}
                          </p>
                          <p>Qty: {item.quantity}</p>
                          <p>Variant: {item.variantId}</p>
                        </div>
                      </div>
                      <div>
                        <p className="item-price">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default OrdersPage;
