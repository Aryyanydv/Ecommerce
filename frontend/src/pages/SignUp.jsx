import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/SignUp.css";

function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const signUpData = new FormData();

    signUpData.append("name", name);
    signUpData.append("emailId", emailId);
    signUpData.append("phoneNumber", phoneNumber);
    signUpData.append("gender", gender);
    signUpData.append("password", password);

    if (profileImage) {
      signUpData.append(
        "profileImage",
        profileImage
      );
    }

    try {
      const response =
        await axios.post(
          "http://localhost:5000/user/signUp",
          signUpData
        );

      console.log(response.data);

      setSuccessMessage(
        "🎉 Account created successfully!"
      );

      setErrorMessage("");

      setName("");
      setEmailId("");
      setPhoneNumber("");
      setGender("");
      setPassword("");
      setProfileImage(null);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      setErrorMessage(
        error.response?.data
          ?.message ||
          "Signup failed"
      );

      console.log(error);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">

          <h1 className="signup-title">
            👟
          </h1>

          <p className="signup-subtitle">
            Create your premium account
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

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Name</label>

              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                required
              />
            </div>

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
              <label>
                Phone Number
              </label>

              <input
                type="text"
                placeholder="Enter phone"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="input-group">
              <label>Gender</label>

              <select
                value={gender}
                onChange={(e) =>
                  setGender(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select Gender
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
              />
            </div>

            <div className="input-group">
              <label>
                Profile Image
              </label>

              <input
                type="file"
                onChange={(e) =>
                  setProfileImage(
                    e.target.files[0]
                  )
                }
              />
            </div>

            <button
              className="signup-btn"
              type="submit"
            >
              Create Account
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default SignUp;