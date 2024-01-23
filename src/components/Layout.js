import React, { useState, useEffect } from "react";
import "../scss/home.scss";
import home from "../assets/home.png";
import logo from "../assets/heart.png";
import guideimg from "../img/guidelines.png";
import dashimg from "../img/homeicon.svg";
import { ReactComponent as HomeSvg } from "../img/homeicon.svg";
import donationimg from "../img/donation.svg";
import storeimg from "../img/store.svg";
import { ReactComponent as DonationSvg } from "../img/donation.svg";
import { ReactComponent as StoreSvg } from "../img/store.svg";
import { ReactComponent as WidgetSvg } from "../img/widget.svg";
import { ReactComponent as FoundationSvg } from "../img/foundation.svg";
import { ReactComponent as JoiningSvg } from "../img/joining-resuest.svg";
import { ReactComponent as ConnectSvg } from "../img/connect.svg";
import widgetimg from "../img/homeicon.svg";
import joiningimg from "../img/add-friend.png";
import logoutImg from "../assets/logout.png";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import useApi from "../hooks/useApi";
import widget from "../assets/widget.png";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import Header from "./header";
import { logout } from "../redux/counterSlice";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { useLocation } from "react-router-dom";

import {
  Drawer,
  Button,
  Box,
  CssBaseline,
  Toolbar,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  List,
  Divider,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { Sidebar } from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../api/apiClient";
import Toast from "./Toast";
import { Modal } from "react-bootstrap";
const drawerWidth = 240;
export const Layout = () => {
  const location = useLocation();
  const { userId, active, role } = useSelector((state) => state.auth);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [userDetails, setUserDetails] = useState();

  const [toastData, SetToastData] = useState({
    bg: null,
    message: null,
  });
  const [showToast, setShowToast] = useState(false);
  const currentPath = location?.pathname;

  const [activePath, setActivePath] = useState(currentPath);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [editProfileModal, seteditProfileModal] = useState(false);
  const initialData = {
    storeName: "",
    foundationName: "",
    website: "",
    websiteUrl: "",
    phoneNumber: "",
    address: "",
    city: "",
    username: "",
    password: "",
    logo: "",
    repassword: "",
  };
  const [submitData, setSubmitData] = useState(initialData);

  const handleChange = (key, value) => {
    setSubmitData({ ...submitData, [key]: value });
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (active === "false" || active === false) {
      setShowConfirmModal(true);
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  useEffect(() => {
    setActivePath(currentPath);
    if (currentPath === "/") {
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "foundation") {
        navigate("/dashboard");
      } else if (role === "store") {
        navigate("/store/dashboard");
      }
    }
  }, [currentPath]);
  useEffect(() => {
    fetchUserDetails();
  }, []);
  const fetchUserDetails = async () => {
    const res = await apiClient.get(`/user/details/${userId}`);
    if (res.status === 200) {
      setUserDetails(res.data);
    }
  };
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const resetSubmitData = () => {
    seteditProfileModal(!editProfileModal);
  };
  const editModal = async () => {
    seteditProfileModal(!editProfileModal);
    let result;
    if (role === "foundation") {
      result = await apiClient.get(`/foundation/getProfile/${userId}`);
      if (result.ok) {
        let foundation = result.data.foundation;
        let user = result.data.user;
        setSubmitData({
          foundationName: foundation.foundationName,
          websiteUrl: foundation.websiteUrl,
          email: user.email,
          phoneNumber: foundation.phoneNumber,
          address: foundation.address,
          city: foundation.city,
          username: foundation.username,
        });
      }
    } else if (role === "store") {
      result = await apiClient.get(`/store/getProfile/${userId}`);
      if (result.ok) {
        let store = result.data.store;
        let user = result.data.user;
        setSubmitData({
          storeName: store.storeName,
          website: store.website,
          email: user.email,
          phoneNumber: store.phoneNumber,
          address: store.address,
          city: store.city,
          username: store.username,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitData.password !== submitData.repassword) {
      toast.error("Password does not matched", {
        style: {
          width: "450px",
          background: "#bb2124",
          color: "white",
        },
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return false;
    }

    let password = "";
    let logo = "";
    let result;
    if (role === "store") {
      const formData = new FormData();
      formData.append("storeName", submitData.storeName);
      formData.append("website", submitData.website);
      // formData.append("email", submitData.email);
      formData.append("phoneNumber", submitData.phoneNumber);
      formData.append("address", submitData.address);
      formData.append("city", submitData.city);
      formData.append("username", submitData.username);
      if (submitData && submitData.logo) {
        logo = submitData.logo;
      }
      if (submitData && submitData.password) {
        password = submitData.password;
      }
      formData.append("password", password);
      formData.append("logo", logo);
      formData.append("userId", userId);
      result = await apiClient.post("/store/updateProfile", formData);
    } else if (role === "foundation") {
      const formData = new FormData();
      formData.append("foundationName", submitData.foundationName);
      formData.append("websiteUrl", submitData.websiteUrl);
      // formData.append("email", submitData.email);
      formData.append("phoneNumber", submitData.phoneNumber);
      formData.append("address", submitData.address);
      formData.append("city", submitData.city);
      formData.append("username", submitData.username);
      if (submitData && submitData.logo) {
        logo = submitData.logo;
      }
      if (submitData && submitData.password) {
        password = submitData.password;
      }
      formData.append("password", password);
      formData.append("logo", logo);
      formData.append("userId", userId);
      result = await apiClient.post("/foundation/updateProfile", formData);
    }
    if (result.ok) {
      fetchUserDetails();
      toast.success(result.data.message, {
        style: {
          width: "450px",
          background: "#198754",
          color: "white",
        },
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          setSubmitData("");
          resetSubmitData();
        },
      });
    } else {
      toast.success(result.data.message, {
        style: {
          width: "450px",
          background: "#198754",
          color: "white",
        },
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });
  const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });
  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));
  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));
  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    backgroundColor: "#1a2942",
    color:"white",
    backgroundColor: "#1a2942",
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));
  const drawer = (
    <div className="drwer">
      <List>
        {role === "admin" && (
          <>
            <ListItem
              onClick={() => {
                navigate("/admin/dashboard");
              }}
              className={activePath === "/admin/dashboard" ? "active" : ""}
            >
              <ListItemButton>
              <HomeSvg style={{ fill: 'white', height: '25px', width:'25px'}} />
                <ListItemText className="ps-2" primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem
              onClick={() => {
                navigate("/admin/donation");
              }}
              className={activePath === "/admin/donation" ? "active" : ""}
            >
              <ListItemButton>
              <DonationSvg style={{ fill: 'white', height: '25px', width:'25px'}} />
                <ListItemText className="ps-2" primary="Donations" />
              </ListItemButton>
            </ListItem>
            <ListItem
              onClick={() => {
                navigate("/admin/store");
              }}
              className={activePath === "/admin/store" ? "active" : ""}
            >
              <ListItemButton>
              <StoreSvg style={{ fill: 'white', height: '25px', width:'25px'}} />
                <ListItemText className="ps-2" primary="Store" />
              </ListItemButton>
            </ListItem>
            <ListItem
              onClick={() => {
                navigate("/admin/foundation");
              }}
              className={activePath === "/admin/foundation" ? "active" : ""}
            >
              <ListItemButton>
              <FoundationSvg style={{ fill: 'white', height: '25px', width:'25px'}} />
                <ListItemText className="ps-2" primary="Foundation" />
              </ListItemButton>
            </ListItem>
            <ListItem
              onClick={() => {
                navigate("/admin/joiningRequest");
              }}
              className={activePath === "/admin/joiningRequest" ? "active" : ""}
            >
              <ListItemButton>
              <JoiningSvg style={{ fill: 'white', height: '25px', width:'25px'}} />
                <ListItemText className="ps-2" primary="Joining Request" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        {role === "foundation" && (
          <>
            <ListItem
              onClick={() => {
                navigate("/dashboard");
              }}
              className={activePath === "/dashboard" ? "active" : ""}
            >
              <ListItemButton>
                <HomeSvg style={{ fill: 'white', height: '25px', width:'25px'}} />
                <ListItemText className="ps-2" primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem
              onClick={() => {
                navigate("/dashboard/donation");
              }}
              className={activePath === "/dashboard/donation" ? "active" : ""}
            >
              <ListItemButton>
                <DonationSvg style={{ fill: 'white', height: '25px', width:'25px'}} />
                <ListItemText className="ps-2" primary="Donation" />
              </ListItemButton>
            </ListItem>
            <ListItem
              onClick={() => {
                navigate("/dashboard/store");
              }}
              className={activePath === "/dashboard/store" ? "active" : ""}
            >
              <ListItemButton>
                <StoreSvg style={{ fill: 'white', height: '25px', width:'25px'}} />
                <ListItemText className="ps-2" primary="Store" />
              </ListItemButton>
            </ListItem>
            <ListItem
              onClick={() => {
                navigate("/dashboard/widget");
              }}
              className={activePath === "/dashboard/widget" ? "active" : ""}
            >
              <ListItemButton>
                <WidgetSvg style={{ fill: 'white', height: '25px', width:'25px' }} />
                <ListItemText className="ps-2" primary="Widgets" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        {role === "store" && (
          <>
            <ListItem
              onClick={() => {
                navigate("/store/dashboard");
              }}
              className={activePath === "/store/dashboard" ? "active" : ""}
            >
              <ListItemButton>
                <HomeSvg style={{ fill: 'white', height: '25px', width:'25px'}} />
                <ListItemText className="ps-2 ms-1" primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem
              onClick={() => {
                navigate("/store/donation");
              }}
              className={activePath === "/store/donation" ? "active" : ""}
            >
              <ListItemButton>
                <DonationSvg style={{ fill: 'white', height: '25px', width:'25px'}} />
                <ListItemText className="ps-2 ms-1" primary="Donations" />
              </ListItemButton>
            </ListItem>
            <ListItem
              onClick={() => {
                navigate("/store/guideline");
              }}
              className={activePath === "/store/guideline" ? "active" : ""}
            >
              <ListItemButton>
              <ConnectSvg style={{ fill: 'white', height: '25px', width:'25px'}} />
                <ListItemText className="ps-2 ms-1" primary="How to Connect" />
              </ListItemButton>
            </ListItem>
            <ListItem
              onClick={() => {
                navigate(`/store/widgets/${userId}`);
              }}
              className={activePath === "/store/widgets" ? "active" : ""}
            >
              <ListItemButton>
              <WidgetSvg style={{ fill: 'white', height: '25px', width:'25px' }} />
                <ListItemText
                  className="ps-2 ms-1"
                  primary="Donate Widget Preview"
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </div>
  );
  return (
    <>
      {showToast && <Loader />}
      {showToast ? (
        <Toast bg={toastData.bg} message={toastData.message} />
      ) : null}
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          open={open}
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            background: `#fff
              
            `,
            background: `#1a2942`,
          }}
        >
          <Toolbar>
            <IconButton
              color="black"
              // color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Header />
            <Box>
                <Box className="d-flex justify-content-center align-items-center d-none">
                    <Link to="/">
                    <img
                        src={userDetails?.logo}
                        className="img-fluid"
                        style={{ width: "100%", height: "50px" }}
                        alt=""
                    />
                    </Link>
                    <h4 onClick={() => navigate("/")} className="brand-name">
                    {userDetails?.name}
                    </h4>
                </Box>
                
                <Box className="d-flex d-none" style={{ margin: "auto 0 auto auto" }}>
                    <Link to="/chat">
                        <img
                            //src={chatImg}
                            className="img-fluid"
                            style={{ width: "100%", height: "50px" }}
                            alt=""
                        />
                    </Link>
                    <Box style={{ paddingRight: "20px" }}>
                        <div className="user-dropdown">
                        <div className="user-icon" onClick={toggleDropdown}>
                            {/*<img src={chatImg} alt="" />*/}
                        </div>
                        {dropdownVisible && (
                            <div className="dropdown-content">
                            <a onClick={() => handleLogout()}>Logout</a>
                            <a onClick={editModal}>Edit Profile</a>
                            </div>
                        )}
                        </div>
                    </Box>
                    <Box>
                        <div className="user-dropdown">
                        <div className="user-icon" onClick={toggleDropdown}>
                            <img src={logoutImg} alt="" />
                        </div>
                        {dropdownVisible && (
                            <div className="dropdown-content">
                            <a onClick={() => handleLogout()}>Logout</a>
                            <a onClick={editModal}>Edit Profile</a>
                            </div>
                        )}
                        </div>
                    </Box>
                </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          {drawer}
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
      {/* Store Modal */}
      {editProfileModal && role === "store" && (
        <div className="ProfileModal">
          <div
            className="modal"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Store Profile</h5>
                  <div>
                    <a onClick={() => handleLogout()}>
                      <img src={logoutImg} alt="" />
                    </a>
                  </div>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="profile-edit">
                      <div className="name">
                        <input
                          type="text"
                          placeholder="Store Name"
                          required
                          value={submitData?.storeName}
                          onChange={(e) =>
                            handleChange("storeName", e.target.value)
                          }
                        />
                      </div>
                      <div className="websiteUrl">
                        <input
                          type="text"
                          placeholder="Website URL"
                          required
                          value={submitData?.website}
                          onChange={(e) =>
                            handleChange("website", e.target.value)
                          }
                        />
                      </div>
                      <div className="email">
                        <input
                          type="email"
                          placeholder="Email"
                          readOnly
                          required
                          value={submitData?.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                        />
                      </div>
                      <div className="phoneNumber">
                        <input
                          type="number"
                          maxLength={11}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="Phone Number"
                          required
                          value={submitData?.phoneNumber}
                          onChange={(e) =>
                            handleChange("phoneNumber", e.target.value)
                          }
                        />
                      </div>
                      <div className="address">
                        <input
                          type="text"
                          placeholder="Address"
                          required
                          value={submitData?.address}
                          onChange={(e) =>
                            handleChange("address", e.target.value)
                          }
                        />
                      </div>
                      <div className="city">
                        <input
                          type="text"
                          placeholder="City"
                          required
                          value={submitData?.city}
                          onChange={(e) => handleChange("city", e.target.value)}
                        />
                      </div>
                      <div className="choosefile">
                        <input
                          type="file"
                          placeholder="Choose logo"
                          onChange={(e) =>
                            handleChange("logo", e.target.files[0])
                          }
                        />
                      </div>
                      <div className="username">
                        <input
                          type="text"
                          placeholder="Username"
                          required
                          value={submitData?.username}
                          onChange={(e) =>
                            handleChange("username", e.target.value)
                          }
                        />
                      </div>
                      <div className="password">
                        <input
                          type="Password"
                          placeholder="Password"
                          // value={submitData.password}
                          onChange={(e) =>
                            handleChange("password", e.target.value)
                          }
                        />
                      </div>
                      <div className="retypepassword">
                        <input
                          type="Password"
                          placeholder="Retype Password"
                          onChange={(e) =>
                            handleChange("repassword", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="action-btns">
                      <button onClick={resetSubmitData} className="btn-cancel">
                        Cancel
                      </button>
                      <button className="btn-submit" type="submit">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* foundation Modal */}
      {editProfileModal && role === "foundation" && (
        <div className="ProfileModal">
          <div
            className="modal"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Foundation Profile</h5>
                  <div>
                    <a onClick={() => handleLogout()}>
                      <img src={logoutImg} alt="" />
                    </a>
                  </div>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="profile-edit">
                      <div className="name">
                        <input
                          type="text"
                          placeholder="foundationName"
                          required
                          value={submitData?.foundationName}
                          onChange={(e) =>
                            handleChange("foundationName", e.target.value)
                          }
                        />
                      </div>
                      <div className="websiteUrl">
                        <input
                          type="text"
                          placeholder="Website URL"
                          required
                          value={submitData?.websiteUrl}
                          onChange={(e) =>
                            handleChange("websiteUrl", e.target.value)
                          }
                        />
                      </div>
                      <div className="email">
                        <input
                          type="email"
                          placeholder="Email"
                          readOnly
                          required
                          value={submitData?.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                        />
                      </div>
                      <div className="phoneNumber">
                        <input
                          type="number"
                          maxLength={11}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="Phone Number"
                          required
                          value={submitData?.phoneNumber}
                          onChange={(e) =>
                            handleChange("phoneNumber", e.target.value)
                          }
                        />
                      </div>
                      <div className="address">
                        <input
                          type="text"
                          placeholder="Address"
                          required
                          value={submitData?.address}
                          onChange={(e) =>
                            handleChange("address", e.target.value)
                          }
                        />
                      </div>
                      <div className="city">
                        <input
                          type="text"
                          placeholder="City"
                          required
                          value={submitData?.city}
                          onChange={(e) => handleChange("city", e.target.value)}
                        />
                      </div>
                      <div className="choosefile">
                        <input
                          type="file"
                          placeholder="Choose logo"
                          onChange={(e) =>
                            handleChange("logo", e.target.files[0])
                          }
                        />
                      </div>
                      <div className="username">
                        <input
                          type="text"
                          placeholder="Username"
                          required
                          value={submitData?.username}
                          onChange={(e) =>
                            handleChange("username", e.target.value)
                          }
                        />
                      </div>
                      <div className="password">
                        <input
                          type="Password"
                          placeholder="Password"
                          // value={submitData.password}
                          onChange={(e) =>
                            handleChange("password", e.target.value)
                          }
                        />
                      </div>
                      <div className="retypepassword">
                        <input
                          type="Password"
                          placeholder="Retype Password"
                          onChange={(e) =>
                            handleChange("repassword", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="action-btns">
                      <button onClick={resetSubmitData} className="btn-cancel">
                        Cancel
                      </button>
                      <button className="btn-submit" type="submit">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal show={showConfirmModal} style={{ top: "15%" }}>
        <Modal.Header>
          <Modal.Title>Kind Heart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Your request is in progress. We are reviewing your request, in a
            short your request will b approved.
          </p>
          <p style={{ fontWeight: "bold" }}>
            If you have any query please contact us on{" "}
          </p>
          <ul>
            <li>Email: kindheartdonationapp@gmail.com</li>
            <li>Phone No: 0000-0000000</li>
          </ul>
          <p style={{ fontWeight: "bold", textDecoration: "none" }}>
            How kind Heart works:
          </p>
          <Link
            style={{ textDecoration: "none" }}
            to="https://www.youtube.com/"
          >
            Watch the video here
          </Link>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="primary">Confirm</Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};
