import React, { useState } from "react";
import logo from "../../img/kindheart.png";
import apiClient from "../../api/apiClient";
import { Link } from "react-router-dom";
import Toast from "../Toast";
import  desimg  from "../../img/des-img.png";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastData, SetToastData] = useState({
    bg: null,
    message: null,
  });

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    console.log("here is me also ");
    try {
      const res = await apiClient.post("/user/forgotPassword", {
        email: email,
      });
      if (res.ok) {
        setEmail("");
        SetToastData({
          message: "Please Check your inbox , we have sent you an email",
          bg: "bg-success",
        });
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
      } else if (res.status === 404) {
        setShowToast(true);
        SetToastData({
          message: "Email Does not exist",
          bg: "bg-danger",
        });
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
    }
  };

  return (
    <>
      {showToast ? (
        <Toast bg={toastData.bg} message={toastData.message} />
      ) : null}
      <div className="container">
        <div className="login">
      
       
          <form className="login-form" onSubmit={handleForgotPassword}>
          <div className="forgot-pass">
            <h3>Forgot Your Password</h3>
          </div>
            <div className="email-login">
              <input
                type="text"
                placeholder="Email"
                required
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <button type="submit">Forgot Password</button>
          </form>
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
            Welcome to the Kind Heart community! We're thrilled to have you on board and excited to share this journey of making a positive impact with you. Your decision to join us is a significant step towards creating a better world through the power of kindness and generosity.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
