import React, { useEffect, useState } from "react";
import "..//scss/home.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import apiClient from "../api/apiClient";
import Toast from "../components/Toast";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import Pagination from "../components/Pagination";

export const Donation = () => {
  const initialFilterData = {
    fromDate: "",
    toDate: "",
    name: "",
  };
  const [filterData, setFilterData] = useState(initialFilterData);
  const [updatePaymentStatusObj, setUpdatePaymentStatusObj] = useState({
    userId: "",
    donationKey: "",
    statusValue: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const handleFilter = (key, value) => {
    setFilterData({ ...filterData, [key]: value });
  };
  const [showToast, setShowToast] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [UserId, setUserId] = useState("");
  const [toastData, SetToastData] = useState({
    bg: null,
    message: null,
  });
  const [Foundation, setFoundation] = useState([]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const fetchFoundations = async () => {
    const res = await apiClient.get(
      `/foundation/getFoundation?page=${currentPage}`
    );
    if (res.status === 200) {
      console.log("res.status", res.data);
      setFoundation(res.data.data);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    }
  };
  useEffect(() => {
    fetchFoundations();
  }, [currentPage]);

  const confirmUpdateUserStatus = (userId, donationKey, statusValue) => {
    setUpdatePaymentStatusObj({
      userId: userId,
      donationKey: donationKey,
      statusValue: statusValue,
    });
    setShowConfirmModal(!showConfirmModal);
  };
  const closeConfirmModal = () => {
    fetchFoundations();
    setShowConfirmModal(!showConfirmModal);
  };

  const updatePaymentStatus = async () => {
    const res = await apiClient.put(`/foundation/updatePaymentStatus`, {
      userId: updatePaymentStatusObj.userId,
      donationKey: updatePaymentStatusObj.donationKey,
      statusValue: updatePaymentStatusObj.statusValue,
    });
    if (res.ok) {
      setShowConfirmModal(!showConfirmModal);
      toast.success(res.data.message, {
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
        onClose: fetchFoundations,
      });
    } else {
      toast.error(res.data.message, {
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
    }
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    let paymentStatus = "";
    if (filterData.paymentStatus) {
      paymentStatus = filterData.paymentStatus;
    }
    const res = await apiClient.get(
      `/foundation/filter?fromDate=${filterData.fromDate}&toDate=${filterData.toDate}&name=${filterData.name}&paymentStatus=${paymentStatus}`
    );
    if (res.ok) {
      console.log("res.data", res.data.foundation);
      setFoundation(res.data.foundation);
    }
  };

  return (
    <div className="donation-page">
      {showToast ? (
        <Toast bg={toastData.bg} message={toastData.message} />
      ) : null}
      <div className="donation">
        <form onSubmit={handleFilterSubmit}>
          <div className="form-group">
            <input
              value={filterData.fromDate}
              onChange={(e) => handleFilter("fromDate", e.target.value)}
              type="date"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder=""
            />
          </div>
          <div className="form-group">
            <input
              value={filterData.toDate}
              onChange={(e) => handleFilter("toDate", e.target.value)}
              type="date"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder=""
            />
          </div>
          <div className="form-group">
            <input
              value={filterData.name}
              onChange={(e) => handleFilter("name", e.target.value)}
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Type Store Name"
            />
          </div>
          <div className="form-group">
            <select
              className="form-control status"
              id="exampleFormControlSelect2"
              onChange={(e) => handleFilter("paymentStatus", e.target.value)}
            >
              <option value="" selected>
                Status
              </option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Filter
          </button>
        </form>
      </div>
      <div className="data-table">
        <table className="table table-striped table-responsive text-center table-hover">
          <thead>
            <tr>
              <th scope="col" className="bg-secondary text-white">Order Id</th>
              <th scope="col" className="bg-secondary text-white">Store Name</th>
              <th scope="col" className="bg-secondary text-white">Date</th>
              <th scope="col" className="bg-secondary text-white">Amount</th>
              <th scope="col" className="bg-secondary text-white">PaymentStatus</th>
            </tr>
          </thead>

          <tbody>
            {Foundation?.map((item, index) =>
              item.donations.map((childItem, childIndex) =>
                childItem.orderID !== "0" || childItem.amount !== 0 ? (
                  <tr key={`${index}${childIndex}`}>
                    <td>{childItem.orderID}</td>
                    <td>{childItem.storeName}</td>
                    <td>{childItem.date}</td>
                    <td>{childItem.amount}</td>
                    <td>
                      <div className="form-group">
                        <select
                          onChange={(e) =>
                            confirmUpdateUserStatus(
                              item.user,
                              childItem._id,
                              e.target.value
                            )
                          }
                          className="form-control status"
                          id="exampleFormControlSelect1"
                        >
                          <option
                            value="Approved"
                            selected={
                              childItem.paymentStatus === "Approved"
                                ? true
                                : false
                            }
                          >
                            Approved
                          </option>
                          <option
                            value="Pending"
                            selected={
                              childItem.paymentStatus === "Pending"
                                ? true
                                : false
                            }
                          >
                            Pending
                          </option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ) : null
              )
            )}

            {/* <tr> */}
            {/* <th scope="row">002</th>
              <td>Diners</td>
              <td>06/07/2023</td>
              <td>60,000</td>
              <td>Active</td>
            </tr>
            <tr>
            <th scope="row">005</th>
              <td>Ismail</td>
              <td>06/07/2023</td>
              <td>100,000</td>
              <td>Active</td>
            </tr> */}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
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
          <Button variant="primary" onClick={updatePaymentStatus}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
