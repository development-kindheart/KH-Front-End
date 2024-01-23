import React, { useEffect, useState } from "react";
import "../../scss/home.scss";
import apiClient from "../../api/apiClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Pagination from "../../components/Pagination";

export const AdminStore = () => {
  const [showStore, setshowStore] = useState(false);
  const [storeData, setstoreData] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [showFoundation, setshowFoundation] = useState(false);
  const [foundations, setFoundations] = useState([]);
  const [registerFoundations, setRegisterFoundations] = useState([]);
  const handleviewStore = (storeData, userData) => {
    let mergedObject = { ...storeData, ...userData };
    setstoreData(mergedObject);
    setshowStore(!showStore);
  };
  const fetchData = async () => {
    let result = await apiClient.get(`admin/storeDonations?page=${currentPage}`);
    if (result.ok) {
      console.log("result.data", result.data);
      setFoundations(result.data.data);
      setTotalPages(result.data.totalPages);
      setCurrentPage(result.data.currentPage);
    }
  };
  const confirmUpdateUserStatus = (userId) => {
    setUserId(userId);
    setShowConfirmModal(!showConfirmModal);
  };
  const closeConfirmModal = () => {
    setShowConfirmModal(!showConfirmModal);
    fetchData();
  };
  const updateUserStatus = async () => {
    // storeId mean primary key of use document
    let result = await apiClient.put("admin/updateUserStatus", {
      userId: userId,
    });
    if (result.ok) {
      setShowConfirmModal(!showConfirmModal);
      toast.success(result.data.message, {
        style: {
          width: "300px",
          background: "#198754",
          color: "white",
        },
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error(result.data.message, {
        style: {
          width: "300px",
          background: "red",
          color: "white",
        },
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage]);
  const handleviewFoundation = async (storeId) => {
    let result = await apiClient.get("admin/getRegisterFoundations", {
      storeId: storeId,
    });
    if (result.ok) {
      console.log("result.data", result.data);
      setRegisterFoundations(result.data);
      setshowFoundation(!showFoundation);
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className="store-admin">
      <div className="store-data">
        <div className="data-table">
          <table className="table table-striped table-responsive text-center table-hover">
            <thead>
              <tr>
                <th scope="col" className="bg-secondary text-white">Store Name</th>
                <th scope="col" className="bg-secondary text-white">Store Info</th>
                <th scope="col" className="bg-secondary text-white">Registered Foundation</th>
                <th scope="col" className="bg-secondary text-white">Total Amount</th>
                <th scope="col" className="bg-secondary text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {foundations?.map((item, index) => (
                <tr key={index}>
                  <td>{item.store[0].storeName}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleviewStore(item.store[0], item.user[0])
                      }
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleviewFoundation(item.store[0].user)}
                    >
                      View
                    </button>
                  </td>
                  <td>{item.totalAmount}</td>
                  <td>
                    <div className="form-group">
                      <select
                        className="form-control status"
                        id="exampleFormControlSelect2"
                        // onChange={(e) => updateUserStatus(item.store[0].user)}
                        onChange={(e) =>
                          confirmUpdateUserStatus(item.store[0].user)
                        }
                      >
                        <option
                          selected={item.user[0].pause ? true : false}
                          value="true"
                        >
                          Active
                        </option>
                        <option
                          selected={item.user[0].pause ? true : false}
                          value="false"
                        >
                          Pause
                        </option>
                      </select>
                    </div>
                  </td>
                  <td>{item.user[0].pause}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showStore && (
          <div className="get-store">
            <div
              className="modal"
              tabIndex="-1"
              role="dialog"
              style={{ display: "block" }}
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Store Information</h5>
                    <button
                      type="button btn"
                      className="close"
                      onClick={() => setshowStore(!showStore)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="slide-content">
                      <label>Store Name: {storeData.storeName}</label>
                      <label>Website Url: {storeData.website}</label>
                      <label>Email: {storeData.email}</label>
                      <label>Phone Number: {storeData.phoneNumber}</label>
                      <label>Address: {storeData.address}</label>
                      <label>City: {storeData.city}</label>
                      <label>
                        Logo:
                        <img alt="storeImage" src={storeData.logo} />
                      </label>
                      <label>User Name: {storeData.username}</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showStore && <div onClick={handleviewStore} />}
        {showFoundation && (
          <div className="get-store">
            <div
              className="modal"
              tabIndex="-1"
              role="dialog"
              style={{ display: "block" }}
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Registered Foundations</h5>
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
                      <div className="data-table">
                        <table className="table table-striped table-responsive table-hover">
                          <thead>
                            <tr>
                              <th scope="col-lg-6">Foundation Name</th>
                              <th scope="col-lg-6">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {registerFoundations?.map((item, index) => (
                              <tr key={index}>
                                <td>{item.foundationName}</td>
                                <td>
                                  {item.user[0].pause ? "Pause" : "Active"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showFoundation && <div onClick={handleviewFoundation} />}
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
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Aye you sure to change the status?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeConfirmModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={updateUserStatus}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
