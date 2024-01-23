import React, { useState } from "react";
import "../../scss/auth.scss";
import useApi from "../../hooks/useApi";
import apiClient, { setAuthToken } from "../../api/apiClient";
import { useDispatch } from "react-redux";
import desimg from "../../img/des-img.png";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/counterSlice";
import logo from "../../img/kindheart.png";
import { Link } from "react-router-dom";
import Loader from "../Loader";
import Toast from "../Toast";
import { useSocketContext } from "../../redux/SocketContext";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialValue = {
    email: "",
    password: "",
  };
  const [submitData, setSubmitData] = useState(initialValue);
  const [showToast, setShowToast] = useState(false);
  const [toastData, SetToastData] = useState({
    bg: null,
    message: null,
  });
  const {
    socketValue: { messageData },
  } = useSocketContext();
  console.log(messageData,'mess')
  const [showModal, setshowModal] = useState(false);

  const [showToastError, setShowToastError] = useState(false);
  const handleChange = (key, value) => {
    setSubmitData({ ...submitData, [key]: value });
  };
  const handleModalToggle = async () => {
    setshowModal(!showModal);
  };
  const { request, loading, error } = useApi((data) =>
    apiClient.post("/user/login", data)
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await request(submitData);
    if (result.ok) {
      SetToastData({
        message: "Login Successfull",
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
        if (result.data.role === "foundation") {
          navigate("/dashboard");
        } else if (result.data.role === "store") {
          navigate("/store/dashboard");
        } else if (result.data.role === "admin") {
          navigate("/admin/dashboard");
        }
      }, 2000);
    } else {
      SetToastData({
        message: result.data.message,
        bg: "bg-danger",
      });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
  };
  return (
    <>
      {loading && <Loader />}
      {showToast ? (
        <Toast bg={toastData.bg} message={toastData.message} />
      ) : null}

      <div className="container">
        <div className="login">
          <div className="logo">
            
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="title">
              <h1>Sign in</h1>
            </div>
            <div className="email-login">
              <input
                type="text"
                placeholder="Email"
                required
                value={submitData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div className="password-login">
              <input
                type="Password"
                placeholder="Password"
                required
                value={submitData.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>
            <div className="forget-page text-right">
              <Link  to="/forgotpassword">Forgot Password</Link>
            </div>
            <button type="submit">Login</button>
            <div className="signup-page">
              <span>Didn't have an account?</span> <Link to="" onClick={() => handleModalToggle()}>Sign Up</Link>
            </div>
          </form>
        </div>
        <div className="login-description">
          <img src={desimg} alt="" />
          <div className="content">
          <div className="logo-wrapper">
              <Link>
                <img src={logo} alt="Logo" />
              </Link>
            </div>
            <h2>Welcome to Kindheart</h2>
            <p>
            Welcome to the Kind Heart community! We're thrilled to have you on board and excited to share this journey of making a positive impact with you. Your decision to join us is a significant step towards creating a better world through the power of kindness and generosity.
            </p>
          </div>
        </div>
      </div>
      {showModal && (
          <div className="signup-Modal">
            <div
              className="modal"
              tabIndex="-1"
              role="dialog"
              style={{ display: "block" }}
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                      <div className="logo-wrapper">
                        <Link>
                          <img src={logo} alt="Logo" />
                        </Link>
                      </div>
                    <h5 className="modal-title" >Kind Heart</h5>
                    <button
                      type="button btn"
                      className="close"
                      style={{ color: "red", fontSize:"25px", border:"none", background:"transparent", fontWeight:"bold" }}
                      onClick={() => setshowModal(!showModal)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="slide-content">
                      <div className="logo-des">
                        <div className="signup-buttons">
                          <div className="signup-store">
                              <Link to="/signupstore">Sign up for Store</Link>
                          </div>
                          <div className="signup-foundation">
                              <Link to="/signup-foundation">Sign up for Foundation</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}
    </>
  );
};
