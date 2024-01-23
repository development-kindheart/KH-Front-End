import React, { useEffect, useState } from "react";
import logo from "../../img/kindheart.png";
import apiClient from "../../api/apiClient";
import { Link } from "react-router-dom";
import  desimg  from "../../img/des-img.png";
import Toast from "../Toast";

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [token, settoken] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastData, SetToastData] = useState({
    bg: null,
    message: null,
  });

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const gettoken = urlSearchParams.get("token");
    settoken(gettoken);
    console.log("Token:", token);
  }, []);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post(`/user/resetPassword?token=${token}`, {
        password: password,
      });
      if (res.ok) {
        setPassword("");
        setShowToast(true);
        SetToastData({
          message: res.data.message,
          bg: "bg-success",
        });
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
      } else {
        SetToastData({
          message: res.data.message,
          bg: "bg-danger",
        });
        setShowToast(true);
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
        <div className="logo">
            <div className="logo-wrapper">
              <Link>
                <img src={logo} alt="Logo" />
              </Link>
            </div>
          </div>
          
          <form className="login-form" onSubmit={handleResetPassword}>
          <div className="forgot-pass">
            <h3>Reset Your Password</h3>
          </div>
            <div className="password">
              <input
                type="Password"
                placeholder="New Password"
                required
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <button type="submit">Save</button>
          </form>
          <div className="Redirect-pages">
            <div className="forget-page">
              <Link to="/forgotpassword">Forgot Password</Link>
            </div>
            <div className="signup-page">
              <Link to="/signup-option">Create your Account</Link>
            </div>
          </div>
        </div>
        <div className="login-description">
        <img src={desimg} alt="" />
          <div className="content">
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
