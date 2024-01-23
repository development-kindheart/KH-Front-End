import React, { useState } from "react";
import logo1 from "../../img/logoicon.png";
import logo from "../../img/kindheart.png";
import { Link } from 'react-router-dom';
import  desimg  from "../../img/des-img.png";


export const SignupMain = () => {
  return (
    <div className="container">
      <div className="signup-fields">
        <div className="logo">
            <div className="logo-wrapper">
              <Link>
                <img src={logo} alt="Logo" />
              </Link>
            </div>
          </div>
        <div className="signup-buttons">
            <div className="signup-store">
                <Link to="/signupstore">Sign up for Store</Link>
            </div>
            <div className="signup-foundation">
                <Link to="/signup-foundation">Sign up for Foundation</Link>
            </div>
        </div>
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
      <img src={desimg} alt="" />
        <div className="content">
          <h2>Welcome to Kindheart</h2>
          <p>
          Welcome to the Kind Heart community! We're thrilled to have you on board and excited to share this journey of making a positive impact with you. Your decision to join us is a significant step towards creating a better world through the power of kindness and generosity.
          </p>
        </div>
      </div>
    </div>
  );
};
