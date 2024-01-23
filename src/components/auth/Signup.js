import React, { useState } from "react";
import logo1 from "../../img/logoicon.png";
import logo from "../../img/heart.png";
import useApi from "../../hooks/useApi";
import apiClient from "../../api/apiClient";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import Toast from "../Toast";

export const Signup = () => {
  const navigate = useNavigate();
  const initialValue = {
    govtIssuedFoundationId: "",
    foundationType: "",
    username: "",
    email: "",
    password: "",
    websiteUrl: "",
    foundationName: "",
    phoneNumber: "",
    address: "",
    city: "",
    logo: "",
  };
  const [submitData, setSubmitData] = useState(initialValue);
  const [showToast, setShowToast] = useState(false);
  console.log(submitData, "test");
  const handleChange = (key, value) => {
    setSubmitData({ ...submitData, [key]: value });
  };
  const { request, loading, error } = useApi((data) =>
    apiClient.post("/user/registerFoundation", data)
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(
      "govtIssuedFoundationId",
      submitData.govtIssuedFoundationId
    );
    formData.append("email", submitData.email);
    formData.append("username", submitData.username);
    formData.append("password", submitData.password);
    formData.append("websiteUrl", submitData.websiteUrl);
    formData.append("foundationName", submitData.foundationName);
    formData.append("phoneNumber", submitData.phoneNumber);
    formData.append("address", submitData.address);
    formData.append("city", submitData.city);
    formData.append("logo", submitData.logo);
    formData.append("role", "foundation");
    const result = await request(formData);
    if (result.ok) {
      navigate("/login");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
  };
  return (
    <>
      {loading && <Loader />}

      {showToast ? <Toast bg="bg-success" message="sign up Successfull" /> : null}
      <div className="container">
        <div className="signup-fields">
          <div className="logo">
            <a href="#">
              <img src={logo} alt="Logo" />
            </a>
          </div>
          <div className="title">
            <h1>Sign up For Foundation</h1>
          </div>
          <form className="signup" onSubmit={handleSubmit}>
            <div className="nameid">
              <input
                type="text"
                value={submitData.govtIssuedFoundationId}
                placeholder="Govt issued Foundation id"
                onChange={(e) =>
                  handleChange("govtIssuedFoundationId", e.target.value)
                }
                required
              />
            </div>
            <div className="foundationType">
              <input
                type="text"
                placeholder="foundationType"
                value={submitData.foundationType}
                onChange={(e) => handleChange("foundationType", e.target.value)}
              />
            </div>
            <div className="websiteUrl">
              <input
                type="text"
                placeholder="Website URL"
                required
                value={submitData.websiteUrl}
                onChange={(e) => handleChange("websiteUrl", e.target.value)}
              />
            </div>
            <div className="foundation">
              <input
                type="text"
                className="foundation"
                placeholder="Foundation Name"
                required
                value={submitData.foundationName}
                onChange={(e) => handleChange("foundationName", e.target.value)}
              />
            </div>
            <div className="email">
              <input
                type="email"
                placeholder="Email"
                required
                value={submitData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div className="phoneNumber">
              <input
                type="number"
                placeholder="Phone Number"
                required
                value={submitData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
              />
            </div>
            <div className="address">
              <input
                type="text"
                placeholder="Address"
                required
                value={submitData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
            <div className="city">
              <input
                type="text"
                placeholder="City"
                required
                value={submitData.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>
            <div className="choosefile">
              <input
                type="file"
                placeholder="Choose logo"
                required
                accept="image/*"
                onChange={(e) => handleChange("logo", e.target.files[0])}
              />
            </div>
            <div className="username">
              <input
                type="text"
                placeholder="Username"
                required
                value={submitData.username}
                onChange={(e) => handleChange("username", e.target.value)}
              />
            </div>
            <div className="password">
              <input
                type="password"
                placeholder="Password"
                required
                value={submitData.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>
            <div className="retypepassword">
              <input type="Password" placeholder="Retype Password" required />
            </div>

            <button type="submit">Sign up</button>
          </form>
          <div className="Redirect-pages">
            <div className="forget-page">
              <Link to="/forgotpassword">Need Help?</Link>
            </div>
            <div className="signup-page">
              <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>
        <div className="login-description">
          <div className="content">
            <h2>Welcome to Kindheart</h2>
            <p>
              Welcome to our store! We are delighted to have you here. At our
              store, we offer a wide range of products to cater to your needs.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
