const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:1234",
    "http://127.0.0.1:1234",
  ],
  credentials: true,
}));

// Expose specific headers to the browser (helps when frontend reads custom response headers)
app.use((req, res, next) => {
  res.header(
    "Access-Control-Expose-Headers",
    "x-rtb-fingerprint-id, request-id"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({extended : true}));
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, "..", "frontend")));
const {connectDb} = require("./config/database.js");
const userAuth = require("./middlewares/auth");
const userRouter = require("./routes/user.route");
app.use(userRouter);
const attributeRouter = require("./routes/attribute.route");
app.use(attributeRouter);
const productRouter = require("./routes/product.route");
app.use(productRouter);
const reviewRouter = require("./routes/review.route");
app.use(reviewRouter);
const cartRoute = require('./routes/cart.route');
app.use(cartRoute);
const couponRoute = require("./routes/coupon.route");
app.use(couponRoute);
const orderRoute = require("./routes/order.route");
app.use(orderRoute);
const wishlistRoute = require("./routes/wishlist.route");
app.use(wishlistRoute);
const walletRoute = require("./routes/wallet.route");
app.use(walletRoute);
const contactRoute = require("./routes/contact.route");
app.use(contactRoute);

app.get("/", (req,res) => {
  res.send("Hello World");
});

app.get("/api", (req, res) => {
    res.send("This is the products endpoint");
});



connectDb().then(() => {
    console.log("Database connected successfully");
    app.listen(5000, () => {
           console.log("Server is running on port 5000");
});
}).catch((error) => {
    console.error("Database connection failed:", error);
});