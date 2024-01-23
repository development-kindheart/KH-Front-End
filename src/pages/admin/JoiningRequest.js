import "../../scss/home.scss";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import apiClient from "../../api/apiClient";
import Pagination from "../../components/Pagination";
import { Socket } from "socket.io-client";
import { useSocketContext } from "../../redux/SocketContext";
import { socketEmitEvent } from "../../socket/emit";

export const JoiningRequest = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showStore, setshowStore] = useState(false);
  const [selectedId, setSelectedId] = useState();
  console.log(selectedId,'selele')
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [unActive, setUnActive] = useState([]);
  const [show, setshow] = useState(false);
  const [modalData, setModalData] = useState({});

  const handleviewFoundation = async (foundationId, role, ele) => {
    const res = await apiClient.get(`/${role}/getProfile/${foundationId}`);
    if (res.status === 200) {
      const updatedEle = { ...ele };
      Object.assign(updatedEle, res.data[role]);
      setModalData(updatedEle);
      setshow(!show);
    }
  };
  const {
    socketValue: { socket },
  } = useSocketContext();
  const handleviewStore = () => {
    setshowStore(!showStore);
  };

  const confirmUpdateUserStatus = () => {
    setShowConfirmModal(!showConfirmModal);
  };
  const closeConfirmModal = () => {
    setShowConfirmModal(!showConfirmModal);
  };
  const updateStatus = () => {
    socketEmitEvent(socket).acceptStatus({
      userId: selectedId,
    });
    setShowConfirmModal(!showConfirmModal);
    setActiveStatus();
  };
  const setActiveStatus = async () => {
    let result = await apiClient.put("/admin/updateActiveStatus", {
      id: selectedId,
    });
    if (result.ok) {
      fetchData();
    }
  };

  const fetchData = async () => {
    setUnActive([]);
    let result = await apiClient.get(
      `admin/activeRequests?page=${currentPage}`
    );
    if (result.ok) {
      setUnActive(result.data.users.data);
      setTotalPages(result.data.users.totalPages);
      setCurrentPage(result.data.users.currentPage);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="joining-page">
      <div className="data-table">
        <table className="table table-striped table-responsive text-center table-hover border">
          <thead>
            <tr>
              <th scope="col" className="bg-secondary text-white">
                Email
              </th>
              <th scope="col" className="bg-secondary text-white">
                View Info
              </th>
              <th scope="col" className="bg-secondary text-white">
                Role
              </th>
              <th scope="col" className="bg-secondary text-white">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {unActive.map((ele, index) => (
              <tr key={index}>
                <td scope="col">{ele.email}</td>
                <td scope="col">
                  <button
                    style={{
                      fontWeight: "bold",
                      border: "none",
                      background: "transparent",
                    }}
                    onClick={() => handleviewFoundation(ele._id, ele.role, ele)}
                  >
                    <a onClick={() => setshow(!show)}>View</a>
                  </button>
                </td>
                <td scope="col">{ele.role}</td>
                <td scope="col">
                  <select
                    value={ele.active}
                    className="form-select"
                    onChange={(e) => {
                      confirmUpdateUserStatus();
                      setSelectedId(ele._id);
                    }}
                  >
                    <option selected>Status</option>
                    <option value="true">Accept</option>
                    <option value="false">Decline</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {show && (
        <div className="get-foundation-joining">
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
                    style={{
                      color: "red",
                      background: "transparent",
                      border: "none",
                      fontSize: "25px",
                      fontWeight: "bold",
                    }}
                    onClick={() => setshow(!show)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="slide-content">
                    <label>
                      <span className="fw-bold me-2">Id:</span>
                      {modalData._id}
                    </label>
                    {modalData.storenName ? (
                      <label>
                        <span className="fw-bold me-2">Store Name:</span>
                        {modalData.storenName}
                      </label>
                    ) : (
                      <label>
                        <span className="fw-bold me-2">Foundation Name:</span>
                        {modalData.foundationName}
                      </label>
                    )}
                    <label>
                      <span className="fw-bold me-2">Website Url:</span>
                      {modalData.websiteUrl || modalData.website}
                    </label>
                    <label>
                      <span className="fw-bold me-2">Email:</span>
                      {modalData.email}
                    </label>
                    <label>
                      <span className="fw-bold me-2">Phone Number:</span>
                      {modalData.phoneNumber}
                    </label>
                    <label>
                      <span className="fw-bold me-2">Address:</span>
                      {modalData.address}
                    </label>
                    <label>
                      <span className="fw-bold me-2">City:</span>
                      {modalData.city}
                    </label>
                    <label>
                      <span className="fw-bold me-2">Logo:</span>
                      <img
                        alt="Foundation Logo"
                        className="img-fluid w-25"
                        src={modalData.logo}
                      />
                    </label>
                    <label>
                      <span className="fw-bold me-2">User Name:</span>
                      {modalData.username}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />

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
          <Button variant="primary" onClick={updateStatus}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
