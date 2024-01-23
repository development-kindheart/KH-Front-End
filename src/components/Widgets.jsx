import "../scss/widget.scss";
import React, { useState, useEffect } from "react";
import { Button, Modal, FormControl, InputGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Slider from "react-slick";
import logo from "../img/kindheart.png";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams } from "react-router-dom";
import apiClient from "../api/apiClient";
import useApi from "../hooks/useApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WidgetPopup = () => {
  const { id } = useParams();
  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const [showModal, setShowModal] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [donationDetails, setDonationData] = useState([]);
  const [customAmounts, setCustomAmounts] = useState({});
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [organizations, setOrganizations] = useState([]);
  const [errors, setError] = useState();

  useEffect(() => {
    const storedData = localStorage.getItem("DonationData");
    const storedTotalAmount = localStorage.getItem("TotalAmount");
    setDonationData(JSON.parse(storedData) || []);
    setTotalAmount(parseInt(storedTotalAmount || 0));
    window.addEventListener("message", handleMessage);
    fetchStoreWidgets(id);
  }, []);
  const { request, loading, error } = useApi((submitData) =>
    apiClient.post("/foundation/donation", submitData)
  );
  const removeAllCart = () => {
    setDonationData([]);
    setTotalAmount(0);
    localStorage.removeItem("DonationData");
    localStorage.removeItem("TotalAmount");
  };
  const handleMessage = async (event) => {
    if (event.data.message) {
      const res = await request(event.data.message);
      if (res.ok) {
        removeAllCart();
      }
    } else if (event.data.eraseAll) {
      removeAllCart();
    }
  };

  const fetchStoreWidgets = async (id) => {
    try {
      const response = await apiClient.get(`/store/widget?id=${id}`);
      if (response.status === 200) {
        if (response.data.widgetData.length === 0) {
          setError("No Widget Assigned");
          return;
        }
        const updatedData = response.data.widgetData.map((item) => ({
          foundationName: item.title,
          ...item,
        }));

        setOrganizations(updatedData);
      } else if (response.status === 401) {
        setError(response.data.message);
      } else {
        setError("No Widget Assigned");
      }
    } catch (error) {
      console.error("Error fetching widget data:", error);
      setError("Error fetching widget data");
    }
  };
  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAmountClick = (org, amount) => {
    const newAmount = parseFloat(amount);
    if (newAmount < 10) {
      toast.error("You can donate 10 or more than 10", {
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

      return;
    }
    if (isNaN(newAmount)) {
      console.error("Invalid amount entered.");
      return;
    }
    const updatedDonationData = [...donationDetails];

    const existingDonationIndex = updatedDonationData.findIndex(
      (item) => item.foundationName === org.foundationName
    );

    if (existingDonationIndex !== -1) {
      updatedDonationData[existingDonationIndex].amount = newAmount;
    } else {
      const donation = {
        foundationName: org.foundationName,
        amount: newAmount,
        foundationid: org.foundationId,
        widgetId: org._id,
        widgetLogo: org.logo,
      };
      updatedDonationData.push(donation);
    }

    try {
      localStorage.setItem("DonationData", JSON.stringify(updatedDonationData));
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }
    const updatedTotalAmount = updatedDonationData.reduce(
      (total, item) => total + item.amount,
      0
    );
    setTotalAmount(updatedTotalAmount);
    localStorage.setItem("TotalAmount", updatedTotalAmount.toString());
    setDonationData(updatedDonationData);
  };

  const handleRemoveDonation = (org) => {
    const updatedDonationData = donationDetails.filter(
      (donation) => donation.foundationName !== org.foundationName
    );

    const removedDonation = donationDetails.find(
      (donation) => donation.foundationName === org.foundationName
    );

    if (removedDonation) {
      const newTotalAmount = totalAmount - removedDonation.amount;
      setTotalAmount(newTotalAmount);

      localStorage.setItem("DonationData", JSON.stringify(updatedDonationData));
      localStorage.setItem("TotalAmount", newTotalAmount.toString());
      handleRemoveAndSubmit(updatedDonationData, newTotalAmount);
    }

    setDonationData(updatedDonationData);
  };

  const handleRemoveAndSubmit = (updatedDonationData, newTotalAmount) => {
    window.parent.postMessage(
      { donationDetails: updatedDonationData, totalAmount: newTotalAmount },
      "*"
    );
  };
  const handleDonation = () => {
    window.parent.postMessage({ donationDetails, totalAmount }, "*");
  };

  return (
    <div className="widget">
      {!showModal && (
        <div
          className="widget-button"
          style={{ backgroundColor: "transparent" }}
        >
          <Button className="btn text-white" onClick={handleButtonClick}>
            <img
              className="img-icon"
              width="30px"
              src={require("../assets/logo2.png")}
              alt="Button Image"
            />
            Let's Donate
          </Button>
        </div>
      )}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="widget-popup rounded-4"
      >
        <Modal.Header closeButton>
          <div className="row align-items-center">
            <div className="col-4 text-start">
              <Link>
                <img className="logo-img " src={logo} alt="Logo" />
              </Link>
            </div>
            <div className="col-7">
              <div className="d-flex align-items-center justify-content-end">
                {totalAmount !== 0 && (
                  <div>
                    <Button
                      className="btn text-white donate-btn"
                      variant="secondary"
                      onClick={handleDonation}
                    >
                      Donate
                    </Button>
                  </div>
                )}
                <div className="dropdown">
                  <i className="bi bi-bag-heart-fill display-6 ms-3">
                    {donationDetails.length > 0 && (
                      <span
                        className="badge bg-danger position-absolute top-0 start-100 translate-middle"
                        style={{
                          padding: "0.2rem 0.4rem",
                          fontSize: "0.75rem",
                        }}
                      >
                        {donationDetails.length}
                      </span>
                    )}
                  </i>

                  <div className="dropdown-content p-3">
                    <p>Selected Donations:</p>
                    <ul>
                      {donationDetails.map((donation, index) => (
                        <li key={index}>
                          <div className="row">
                            <div className="col-9">
                              <strong>{donation.foundationName}</strong>
                            </div>
                            <div className="col text-end">
                              <i
                                onClick={() => handleRemoveDonation(donation)}
                                className="bi bi-x"
                              ></i>
                            </div>
                          </div>
                          <div className="content">
                            <img src={donation.widgetLogo} alt="Widget logo" />
                            <span>Amount: {donation.amount}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <p className="text-center">Total Amount: {totalAmount}</p>
                    {totalAmount !== 0 && (
                      <Button
                        className="btn text-white donate-btn2"
                        variant="secondary"
                        onClick={handleDonation}
                      >
                        Donate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Header>
        <div className="total-amount">
          <h5 className="text-end me-3">Total Amount: {totalAmount}</h5>
        </div>
        <Modal.Body>
          {organizations.length > 0 ? (
            <div>
              <Slider {...settings}>
                {organizations.map((org, index) => {
                  const selectedOrg = donationDetails.find(
                    (item) => item.foundationName === org.foundationName
                  );
                  const selectedAmount = selectedOrg ? selectedOrg.amount : 0;
                  return (
                    <div className="main-slide" key={index}>
                      <div className="title-logo">
                        <a href="#">
                          <img src={org.logo} alt="" />
                        </a>
                        <h5 className="text-dark">{org.foundationName}</h5>
                      </div>
                      <div className="com-info">
                        <p className="text-dark">{org.description}</p>
                      </div>
                      <div className="Actions">
                        <Button
                          className={`btn-1 ${
                            selectedAmount === 10 ? "active" : ""
                          }`}
                          onClick={() => handleAmountClick(org, 10)}
                        >
                          10
                        </Button>
                        <Button
                          className={`btn-2 ${
                            selectedAmount === 20 ? "active" : ""
                          }`}
                          onClick={() => handleAmountClick(org, 20)}
                        >
                          20
                        </Button>
                        <Button
                          className={`btn-3 ${
                            selectedAmount === 30 ? "active" : ""
                          }`}
                          onClick={() => handleAmountClick(org, 30)}
                        >
                          30
                        </Button>
                        <div className="input-field">
                          <InputGroup className="field">
                            <FormControl
                              style={{ maxWidth: "100%" }}
                              type="number"
                              placeholder="Custom Amount"
                              value={
                                isInputFocused
                                  ? customAmounts.id === org._id &&
                                    customAmounts.amount
                                  : selectedAmount
                              }
                              min={10}
                              onChange={(e) => {
                                setCustomAmounts({
                                  id: org._id,
                                  amount: e.target.value,
                                });
                              }}
                              onFocus={() => setIsInputFocused(true)}
                              onBlur={() => setIsInputFocused(false)}
                            />
                            {customAmounts.id === org._id &&
                              customAmounts.amount && (
                                <input
                                  className="add-btn"
                                  type="button"
                                  value="add"
                                  onClick={(e) => {
                                    handleAmountClick(
                                      org,
                                      customAmounts.amount
                                    );
                                  }}
                                />
                              )}

                            {amountError && (
                              <>
                                <br />
                                <small className="text-danger">
                                  Please Add Atleast 10
                                </small>
                              </>
                            )}
                          </InputGroup>
                        </div>
                      </div>
                      {selectedAmount > 0 && (
                        <Button
                          className="btn text-white remove-btn"
                          variant="secondary"
                          onClick={() => handleRemoveDonation(org)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  );
                })}
              </Slider>
            </div>
          ) : (
            <div>{errors}</div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default WidgetPopup;
