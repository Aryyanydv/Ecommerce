import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/ContactUs.css";

function ContactUs() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const [name, setName] = useState(storedUser?.name || "");
  const [emailId, setEmailId] = useState(storedUser?.emailId || "");
  const [phoneNumber, setPhoneNumber] = useState(storedUser?.phoneNumber || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:5000/contact", {
        name,
        emailId,
        phoneNumber,
        subject,
        message,
      });

      if (response.data.success) {
        setSuccessMessage("Your message has been sent successfully. We will contact you soon.");
        setSubject("");
        setMessage("");
      } else {
        setErrorMessage(response.data.message || "Unable to send your message. Please try again.");
      }
    } catch (error) {
      console.error("Contact form error", error);
      setErrorMessage(error.response?.data?.message || "Unable to contact support. Please try again later.");
    }
  };

  return (
    <div className="contact-page">
      <Header />
      <div className="contact-container">
        <div className="contact-card">
          <h1>Contact Us</h1>
          <p className="contact-subtitle">Send us your query and we’ll get back to you shortly.</p>

          {successMessage && <div className="success-msg">{successMessage}</div>}
          {errorMessage && <div className="error-msg">{errorMessage}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Subject</label>
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Message</label>
              <textarea
                placeholder="Write your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
              />
            </div>

            <button className="contact-btn" type="submit">
              Send Message
            </button>
          </form>

          <button className="back-btn" onClick={() => navigate("/profile")}>Back to Profile</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ContactUs;
