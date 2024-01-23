import React, { useState } from "react";
import logo1 from "../../img/logoicon.png";
import logo from "../../img/kindheart.png";
import useApi from "../../hooks/useApi";
import apiClient, { setAuthToken } from "../../api/apiClient";
import { login } from "../../redux/counterSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import desimg from "../../img/des-img.png";
import Loader from "../Loader";
import Toast from "../Toast";

export const SignupFoundation = () => {
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
  const dispatch = useDispatch();
  const [submitData, setSubmitData] = useState(initialValue);
  const [showToast, setShowToast] = useState(false);
  const [image, setImage] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toastData, SetToastData] = useState({
    bg: null,
    message: null,
  });

  const handleChange = (key, value) => {
    const maxPhoneNumberLength = 11;
    if (key === "phoneNumber" && value.length > maxPhoneNumberLength) {
      value = value.slice(0, maxPhoneNumberLength);
    }
    if (key === "logo") setImage(value);
    setSubmitData({ ...submitData, [key]: value });
  };
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };
  const { request, loading, error } = useApi((data) =>
    apiClient.post("/user/registerFoundation", data)
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const minLength = 5;
    const maxLength = 10;
    const capitalLetterPattern = /[A-Z]/;
    const specialCharPattern = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/;
    const { logo } = submitData.logo;
    const maxSize = 2 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (submitData.password !== confirmPassword) {
      console.log("password does not matched");
      SetToastData({
        message: "Password does not matched",
        bg: "bg-danger",
      });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } else if (
      submitData.password.length < minLength ||
      submitData.password.length > maxLength
    ) {
      SetToastData({
        message: "Password must be between 5 and 10 characters.",
        bg: "bg-danger",
      });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } else if (!capitalLetterPattern.test(submitData.password)) {
      SetToastData({
        message: "Password must contain at least one capital letter.",
        bg: "bg-danger",
      });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } else if (!specialCharPattern.test(submitData.password)) {
      SetToastData({
        message: "Password must contain at least one special character.",
        bg: "bg-danger",
      });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } else {
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
        SetToastData({
          message: result.data.message,
          bg: "bg-success",
        });
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setAuthToken(result?.data?.token);
          dispatch(
            login({
              token: result?.data?.token,
              userId: result?.data?.userId,
              role: result?.data?.role,
              active: result?.data?.active,
            })
          );
          navigate("/dashboard");
        }, 2000);
      } else {
        SetToastData({
          message: result.data.message,
          bg: "bg-danger",
        });
        setTimeout(() => {
          setShowToast(false);
        }, 1000);
      }
    }
  };
  return (
    <>
      {loading && <Loader />}

      {showToast ? (
        <Toast bg={toastData.bg} message={toastData.message} />
      ) : null}
      <div className="container">
        <div className="signup-fields">
          <div className="form-wrapper-foundation" style={{padding:"2rem 0 2rem 0"}}>
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
                maxLength={20}
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
                maxLength={10}
                placeholder="Password"
                required
                value={submitData.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>
            <div className="retypepassword">
              <input
                type="Password"
                maxLength={10}
                placeholder="Retype Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
            </div>

            <button type="submit">Sign up</button>
          </form>
          <div className="signup-page">
              <span>Alredy have an account? </span>
              <Link to="/login">Sign in</Link>
          </div>

          </div>
          
        </div>
        <div className="login-description">
          <img src={desimg} alt="" />
          <div className="content">
          <div className="logo">
            <div className="logo-wrapper">
              <Link>
                <img src={logo} alt="Logo" />
              </Link>
            </div>
          </div>
            <h2>Welcome to Kindheart</h2>
            <p>
              Welcome to the Kind Heart community! We're thrilled to have you on
              board and excited to share this journey of making a positive
              impact with you. Your decision to join us is a significant step
              towards creating a better world through the power of kindness and
              generosity.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
