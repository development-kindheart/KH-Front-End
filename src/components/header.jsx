import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/counterSlice";
import { useNavigate } from "react-router-dom";
import {ReactComponent as GrChatOption } from "../img/chat1.svg";
import { LuLogOut } from "react-icons/lu";
import apiClient from "../api/apiClient";

import { Box } from "@mui/material";

const Header = ({ seteditProfileModal, editProfileModal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const location = useLocation();
  const [userDetails, setUserDetails] = useState();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);
  const fetchUserDetails = async () => {
    const res = await apiClient.get(`/user/details/${userId}`);
    if (res.status === 200) {
      setUserDetails(res.data);
    }
  };

  // Check if the current route is /chat
  const isChatRoute = location.pathname === "/chat";

  return (
    <div
      className="d-flex w-100"
      style={{
        color:`white`,
        background: `#1a2942`,
        minHeight: `64px`,
        padding: `0 24px`,
      }}
    >
      <Box className="d-flex justify-content-center align-items-center">
        <h4 onClick={() => navigate("/")} className="brand-name" style={{ cursor: "pointer" }}>
          {userDetails?.name}
        </h4>
      </Box>

      <Box
        className="d-flex align-items-center"
        style={{ margin: "auto 0 auto auto" }}
      >
        {!isChatRoute && (
            <>
                <Link to="/chat" style={{ paddingRight: "20px" }}>
                <GrChatOption  style={{ fill: 'white', height: '40px', width:'40px' }} />
                </Link>
                <Box style={{ paddingRight: "20px" }}>
                <div className="user-dropdown">
                    <img
                    onClick={() => seteditProfileModal(!editProfileModal)}
                    src={userDetails?.logo || ""}
                    className="img-fluid"
                    style={{
                        width: "100%",
                        height: "50px",
                        borderRadius: "50px",
                    }}
                    alt="logo"
                    />
                </div>
                </Box>
            </>
        )}
        <Box>
          <div className="user-dropdown">
            <div className="user-icon">
              <LuLogOut onClick={() => handleLogout()} />
            </div>
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default Header;
