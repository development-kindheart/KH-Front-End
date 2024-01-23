import React, { useEffect, useState } from "react";
import "../../scss/home.scss";
import cashimg from "../../assets/cash.png";
import totalstore from "../../assets/totalstore.png";
import graphimg from "../../assets/reported.PNG";
import useApi from "../../hooks/useApi";
import apiClient from "../../api/apiClient";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../../components/Toast";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";
import Pagination from "../../components/Pagination";
import BarChartComponent from "../../components/BarChartComponent";
export const StoreDashboard = () => {
  const { role } = useSelector((state) => state.auth);
  const [showToast, setShowToast] = useState(false);
  const [showWidget, setshowWidget] = useState(false);
  const [showFoundation, setshowFoundation] = useState(false);
  const [foundationData, setfoundationData] = useState({});
  const [widgetData, setWidgetData] = useState({});
  const [weeklyDonation, setWeeklyDonation] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [UserId, setUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [toastData, SetToastData] = useState({
    bg: null,
    message: null,
  });
  const baseURL = process.env.REACT_APP_FE_URL;
  const { userId } = useSelector((state) => state.auth);
  const copyToClickBord = () => {
    navigator.clipboard.writeText(`${baseURL}store/widgets/${userId}`);
    SetToastData({ bg: "bg-success", message: "Url Added in the clipboard" });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };
  const fetchStoreDashboardData = async () => {
    const res = await apiClient.get(
      `/store/getDashboardData?page=${currentPage}`
    );
    if (res.status === 200) {
      setDashboard(res.data);
      console.log(res.data);
      setTotalPages(res.data.foundations.totalPages);
      setCurrentPage(res.data.foundations.currentPage);
    }
  };

  const getDashboardWeeklyData = async () => {
    const res = await apiClient.get("/store/getDashboardWeeklyData");
    if (res.ok) {
      console.log(res.data);
      setWeeklyDonation(res.data);
    }
  };

  const handleviewFoundation = async (foundationId) => {
    const res = await apiClient.get(`/foundation/getProfile/${foundationId}`);
    console.log("here is res", res);
    if (res.status === 200) {
      setfoundationData(res.data);
      setshowFoundation(!showFoundation);
    }
  };
  const handleviewWidget = async (widgetId, foundationUserId) => {
    const res = await apiClient.get(`/store/findWidget`, {
      foundationUserId: foundationUserId,
    });
    if (res.status === 200) {
      setWidgetData(res.data);
      setshowWidget(!showWidget);
    }
  };
  useEffect(() => {
    fetchStoreDashboardData();
    getDashboardWeeklyData();
  }, [currentPage]);
  const { request, loading, error } = useApi((updateStatusData) =>
    apiClient.put("/foundation/updateStatus", updateStatusData)
  );

  const confirmUpdateUserStatus = (UserId) => {
    setUserId(UserId);
    setShowConfirmModal(!showConfirmModal);
  };
  const closeConfirmModal = () => {
    setShowConfirmModal(!showConfirmModal);
    fetchStoreDashboardData();
  };

  const handleStatusUpdate = async (storeId, value, foundationid) => {
    const updateStatusData = {
      storeid: storeId,
      status: value,
      foundationid: foundationid,
    };
    const res = await request(updateStatusData);
    console.log(res, "-----Result-----");
    if (res.ok) {
      setShowConfirmModal(!showConfirmModal);
      toast.success("status updated successfully", {
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
        onClose: fetchStoreDashboardData,
      });
    }
  };
  const handleCheck = (foundation, userId) => {
    if (
      foundation.foundationData.pausedBy &&
      foundation.foundationData.pausedBy.includes(userId)
    ) {
      return "pause";
    } else {
      return "active";
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [Dashboard, setDashboard] = useState({});
  const getDayOfWeek = (timestamp) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const date = new Date(timestamp);
    const dayOfWeek = date.getDay();
    return daysOfWeek[dayOfWeek];
  };

  const getLast7DaysData = () => {
    const currentDate = new Date();
    const last7DaysData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - i);
      const timestamp = date.getTime();
      last7DaysData.push({
        date: getDayOfWeek(timestamp),
        Donation: 0,
      });
    }
    return last7DaysData;
  };

  const [chartData, setChartData] = useState(getLast7DaysData());

  useEffect(() => {
    updateChartData();
  }, [Dashboard?.foundations?.data]);

  const updateChartData = () => {
    const newData = [...chartData];
    const weeklyTransactions = weeklyDonation?.weeklyTransactions || {};

    newData.forEach((dayData, index) => {
      const day = dayData.date;
      const amount = weeklyTransactions[day] || 0;
      newData[index] = { date: day, Donation: amount };
    });

    setChartData(newData);
    console.log(weeklyTransactions, "333333333333333333333");

  };

  return (
    <div className="donation-page">
      <div className="donation">
        {showToast && <Loader />}
        {showToast ? (
          <Toast bg={toastData.bg} message={toastData.message} />
        ) : null}
        <div>
          <Button className="clip-btn" size="sm" onClick={copyToClickBord}>
            Copy url in Clipboard
          </Button>
        </div>
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="store-dashboard">
              <div className="private-key">
                <span className="title">Private Key:&nbsp;</span>
                <span style={{ fontSize: '10px' }}>{userId}</span>
              </div>
              <div className="total-foundation bg-info">
                <div className="foundation">
                  <div>
                    <span className="title">Total Foundation&nbsp;</span>
                    <span>{Dashboard?.totalFoundations}</span>
                  </div>
                  <a href="#">
                    <img src={totalstore} alt="" />
                  </a>
                </div>
              </div>
              <div className="active-foundation bg-success">
                <div className="active-found">
                  <span className="title">Active Foundation:&nbsp;</span>
                  <span>{Dashboard?.activeFoundations}</span>
                </div>
              </div>
              <div className="pause-foundation">
                <div className="pause">
                  <span className="title">Pause Foundation:&nbsp;</span>
                  <span>{Dashboard?.pauseFoundations}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <BarChartComponent data={chartData} />
          </div>
        </div>

        <div></div>
      </div>
      <div className="data-table">
        {Dashboard?.totalFoundations > 0 ? (
          <>
            <table className="table table-striped table-responsive text-center table-hover table-responsive-sm">
              <thead>
                <tr>
                  <th scope="col" className="bg-secondary text-white">
                    Fondation Name
                  </th>
                  <th scope="col" className="bg-secondary text-white">
                    Donation
                  </th>
                  <th scope="col" className="bg-secondary text-white">
                    Widget
                  </th>
                  <th scope="col" className="bg-secondary text-white">
                    Information
                  </th>
                  <th scope="col" className="bg-secondary text-white">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {Dashboard?.foundations?.data?.map((foundation, index) => (
                  <tr key={index}>
                    <td>{foundation.foundationData.foundationName}</td>
                    <td>{foundation.donations.totalAmount}</td>
                    <td>
                      <button
                        onClick={() =>
                          handleviewWidget(
                            foundation.donations.widgetId,
                            foundation.foundationData.user,
                            foundation.foundationData.donations.storeId
                          )
                        }
                      >
                        <a onClick={() => setshowWidget(!showWidget)}> View </a>
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          handleviewFoundation(foundation.foundationData.user)
                        }
                      >
                        <a onClick={() => setshowFoundation(!showFoundation)}>
                          View
                        </a>
                      </button>
                    </td>
                    <td>
                      <select
                        value={handleCheck(foundation, userId)}
                        onChange={(e) =>
                          confirmUpdateUserStatus(
                            userId,
                            e.target.value,
                            foundation.foundationData.user
                          )
                        }
                        className="form-select"
                      >
                        <option
                          selected={
                            foundation.foundationData.user[0].pause
                              ? true
                              : false
                          }
                          value="active"
                        >
                          Active
                        </option>
                        <option
                          selected={
                            foundation.foundationData.user[0].pause
                              ? true
                              : false
                          }
                          value="pause"
                        >
                          Pause
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          "No donation Exist"
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
      {showWidget && (
        <div className="widget">
          <div
            className="modal"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Kind Heart</h5>
                  <button
                    type="button btn"
                    className="close"
                    onClick={() => setshowWidget(!showWidget)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="slide-content">
                    <div className="title">
                      <span className="name">{widgetData?.title}</span>
                    </div>
                    <div className="logo-des">
                      <div className="logo col-2">
                        <a href="#">
                          <img src={widgetData?.logo} alt="" />
                        </a>
                      </div>
                      <div className="description col-10">
                        <p>{widgetData?.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="payment">
                    <a href="#">10</a>
                    <a className="active" href="#">
                      20
                    </a>
                    <a href="#">30</a>
                    <input type="text" placeholder="Custom Amonut" />
                  </div>
                  <div className="donate">
                    <button>Donate</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showWidget && <div onClick={handleviewWidget} />}
      {showFoundation && (
        <div className="get-foundation">
          <div
            className="modal"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Foundation Information</h5>
                  <button
                    type="button btn"
                    className="close"
                    onClick={() => setshowFoundation(!showFoundation)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="slide-content">
                    <label>Id:{foundationData?.user?._id}</label>
                    <label>
                      Foundation Name:
                      {foundationData?.foundation?.foundationName}
                    </label>
                    <label>
                      Website Url:{foundationData?.foundation?.websiteUrl}
                    </label>
                    <label>Foundation Type:Charity</label>
                    <label>Email:{foundationData?.user?.email}</label>
                    <label>
                      Phone Number:{foundationData?.foundation?.phoneNumber}
                    </label>
                    <label>Address:{foundationData?.foundation?.address}</label>
                    <label>City:{foundationData?.foundation?.city}</label>
                    <label>
                      Logo:
                      <img
                        alt="Foundation"
                        src={foundationData?.foundation?.logo}
                      />
                    </label>
                    <label>
                      User Name:{foundationData?.foundation?.username}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFoundation && <div onClick={handleviewFoundation} />}
      <Modal
        show={showConfirmModal}
        onHide={closeConfirmModal}
        style={{ top: "5%" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Kind Heart</Modal.Title>
        </Modal.Header>
        <Modal.Body>Aye you sure to change the status?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeConfirmModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStatusUpdate}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
