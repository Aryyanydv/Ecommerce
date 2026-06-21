import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [emailId, setEmailId] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [
    showOtpBox,
    setShowOtpBox
  ] = useState(false);

  const [
    successMessage,
    setSuccessMessage
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage
  ] = useState("");

  // LOGIN
  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        const response =
          await axios.post(
            "http://localhost:5000/user/login",
            {
              emailId,
              password
            },
            {
              withCredentials: true
            }
          );

        setSuccessMessage(
          response.data.message
        );

        setErrorMessage("");
        setShowOtpBox(true);

      } catch (error) {
        setErrorMessage(
          error.response?.data
            ?.message ||
          "Login failed"
        );

        console.log(error);
      }
    };

  // VERIFY OTP
  const handleVerifyOtp =
    async () => {
      try {
        const response =
          await axios.post(
            "http://localhost:5000/user/verify-otp",
            {
              emailId,
              otp
            },
            {
              withCredentials: true
            }
          );

        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data.user
          )
        );

        localStorage.setItem(
          "token",
          response.data.token
        );

        navigate("/home");

      } catch (error) {
        setErrorMessage(
          error.response?.data
            ?.message ||
          "OTP verification failed"
        );

        console.log(error);
      }
    };

  return (
    <div className="login-page">

      <div className="login-container">

        <h1 className="login-title">
           👟
        </h1>

        <p className="login-subtitle">
          Login to continue shopping
        </p>

        {successMessage && (
          <div className="success-msg">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="error-msg">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter email"
              value={emailId}
              onChange={(e) =>
                setEmailId(
                  e.target.value
                )
              }
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
            />
          </div>

          <button
            type="submit"
            className="login-btn"
          >
            Login
          </button>

        </form>

        {showOtpBox && (

          <div className="otp-box">

            <h3>
              Verify OTP
            </h3>

            <p>
              OTP sent to your email
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                )
              }
            />

            <button
              onClick={
                handleVerifyOtp
              }
              className="login-btn"
            >
              Verify OTP
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default LoginPage;