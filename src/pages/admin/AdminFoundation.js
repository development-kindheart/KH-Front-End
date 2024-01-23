import React, { useEffect, useState } from "react";
import "../../scss/home.scss";
import { Button } from "react-bootstrap";
import apiClient from "../../api/apiClient";
import { async } from "q";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";
import Pagination from "../../components/Pagination";

export const AdminFoundation = () => {
  const [showFoundation, setshowFoundation] = useState(false);
  const [foundations, setFoundations] = useState([]);
  const [foundationModelData, setFoundationModelData] = useState("");
  const [registerStores, setRegisterStores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [showStore, setShowStore] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userId, setUserId] = useState("");
  const handleviewFoundation = (foundationData, userData) => {
    let mergedObject = { ...foundationData, ...userData };
    setFoundationModelData(mergedObject);
    setshowFoundation(!showFoundation);
  };

  const fetchData = async () => {
    let result = await apiClient.get(`/admin/foundations?page=${currentPage}`);
    console.log("here is foundation data", result);
    if (result.ok) {
      setFoundations(result.data.data);
      setTotalPages(result.data.totalPages);
      setCurrentPage(result.data.currentPage);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewStore = async (foundationId) => {
    let result = await apiClient.get("admin/getRegisterStores", {
      foundationId: foundationId,
    });
    if (result.ok) {
      console.log("result.data", result.data);
      setRegisterStores(result.data);
      setShowStore(!showStore);
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

  return (
    <div className="admin-foundation">
      <div className="foundation">
        <div className="data-table">
          <table className="table table-striped table-responsive text-center table-hover">
            <thead>
              <tr>
                <th scope="col" className="bg-secondary text-white">Foundation Name</th>
                <th scope="col" className="bg-secondary text-white">Foundation Info</th>
                <th scope="col" className="bg-secondary text-white">Register Store</th>
                <th scope="col" className="bg-secondary text-white">Amount</th>
                <th scope="col" className="bg-secondary text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {foundations?.map((item, index) => (
                <tr>
                  <td>{item.foundationData.foundationName}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleviewFoundation(item.foundationData, item.user[0])
                      }
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleViewStore(item.foundationData.user)}
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
                        onChange={(e) =>
                          confirmUpdateUserStatus(item.foundationData.user)
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                      <label>Id:{foundationModelData.user}</label>
                      <label>
                        Foundation Name:{foundationModelData.foundationName}
                      </label>
                      <label>
                        Website Url:{foundationModelData.websiteUrl}
                      </label>
                      <label>Foundation Type:Charity</label>
                      <label>Email:{foundationModelData.email}</label>
                      <label>
                        Phone Number:{foundationModelData.phoneNumber}
                      </label>
                      <label>Address:{foundationModelData.address}</label>
                      <label>City:{foundationModelData.city}</label>
                      <label>
                        Logo:
                        <img
                          alt="Foundation Logo"
                          src={foundationModelData.logo}
                        />
                      </label>
                      <label>User Name:{foundationModelData.username}</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
                    <h5 className="modal-title">Registered Stores</h5>
                    <button
                      type="button btn"
                      className="close"
                      onClick={() => setShowStore(!showStore)}
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
                              <th scope="col-lg-6">Store Name</th>
                              <th scope="col-lg-6">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {registerStores?.map((item, index) => (
                              <tr key={index}>
                                <td>{item.storeName}</td>
                                <td>{item.totalAmount}</td>
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
        {/* {showFoundation && <div onClick={handleviewFoundation} />} */}
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
          <Button variant="primary" onClick={updateUserStatus}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
