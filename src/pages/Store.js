import React, { useEffect, useState } from "react";
import "../scss/home.scss";
import Slider from "react-slick";
import useApi from "../hooks/useApi";
import apiClient from "../api/apiClient";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import logo1 from "../assets/logo.png";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Store = () => {
  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const initialValue = {
    storeId: "",
    storeName: "",
    widgetId: "",
  };
  const [submitData, setSubmitData] = useState(initialValue);
  const [stores, setstores] = useState([]);
  const handleChange = (key, value) => {
    setSubmitData({ ...submitData, [key]: value });
  };
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [widgetData, setWidgetData] = useState({});
  const [toastData, SetToastData] = useState({
    bg: null,
    message: null,
  });
  // list of all widgets related to foundation
  const [allwidgets, setAllWidgets] = useState([]);
  const getStoreData = async (storeId) => {
    let storeName = "";
    if (storeId.length === 24) {
      const result = await apiClient.get(`/store/find/${storeId}`);
      if (result.ok) {
        storeName = result.data.storeName;
      }
    }
    setSubmitData({ ...submitData, storeName: storeName });
  };
  const getAllWidgets = async () => {
    const res = await apiClient.get("/widget/findAll");
    if (res.status === 200) {
      setAllWidgets(res.data);
    }
  };

  useEffect(() => {
    getStoreData(submitData.storeId);
  }, [submitData.storeId]);
  useEffect(() => {
    getAllWidgets();
  }, []);
  const resetSubmitData = () => {
    setSubmitData({
      storeId: "",
      storeName: "",
      widgetId: "",
    });
    setShowModal(!showModal);
  };

  const { request, loading, error } = useApi((data) =>
    apiClient.post("/widget/assign", data)
  );
  const handleWidgetShow = async (id) => {
    const res = await apiClient.get(`/widget/find/${id}`);
    if (res.status === 200) {
      setWidgetData(res.data);
      setShowWidgetModal(!showWidgetModal);
    }
  };
  const edit = async (storeId, widgetIds) => {
    const result = await apiClient.put(`/widget/editAssignWidget`, {
      storeId: storeId,
      widgetId: widgetIds,
    });
    if (result.ok) {
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
        onClose: fetchstores,
      });
    } else {
      toast.error(result.data.message, {
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

  const removeAssignWidget = async (storeId, widgetDataID) => {
    const result = await apiClient.put(`widget/removeAssignWidget`, {
      storeId: storeId,
      widgetId: widgetDataID,
    });
    if (result.ok) {
      toast.error(result.data.message, {
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
        onClose: fetchstores,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await request(submitData);
    if (result.ok) {
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
          setShowModal(!showModal);
          setSubmitData({
            storeId: "",
            storeName: "",
            widgetId: "",
          });
          fetchstores();
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
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  const fetchstores = async () => {
    const res = await apiClient.get("/widget/findWidgetAssignedStores");
    if (res.status === 200) {
      setstores(res.data);
    }
  };
  useEffect(() => {
    fetchstores();
  }, []);
  return (
    <>
      {loading && <Loader />}
      {showToast ? (
        <Toast bg={toastData.bg} message={toastData.message} />
      ) : null}

      <div className="widget-page">
        <div className="title">
          <h3>All E-Commerce Store</h3>
        </div>
        <div className="new-widget">
          <button
            className="btn btn-info"
            onClick={() => setShowModal(!showModal)}
          >
            Add New Store
          </button>
        </div>
        <div className="Stores-list">
          {stores?.stores?.map((data, index) => {
            let widgetDataID = data.assignWidget[0].widgetID;
            let storeId = data._id;
            return (
              <div key={data._id} className="widget-data">
                <div className="widget-inf">
                  <div className="name">
                    <h3>{data.storeName}</h3>
                  </div>
                  <div className="widget-dropdown">
                    <select
                      onChange={(e) => edit(storeId, e.target.value)}
                      className="form-control"
                    >
                      {stores?.widgets?.map((val) => {
                        return (
                          <option
                            selected={widgetDataID === val._id ? true : false}
                            key={val._id}
                            value={`${widgetDataID},${val._id}`}
                          >
                            {val.title}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="buttons">
                  <button
                    className="btn btn-primary"
                    onClick={() => removeAssignWidget(storeId, widgetDataID)}
                  >
                    Remove
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleWidgetShow(widgetDataID)}
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {showModal && (
          <div className="widgetModal">
            <div
              className="modal"
              tabIndex="-1"
              role="dialog"
              style={{ display: "block" }}
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Add Store</h5>
                    <button
                      type="button btn"
                      className="close"
                      onClick={resetSubmitData}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <input
                          type="text"
                          required
                          className="form-control"
                          id="exampleFormControlInput1"
                          placeholder="Enter Store Id"
                          value={submitData.storeId}
                          onChange={(e) => {
                            handleChange("storeId", e.target.value);
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          required
                          className="form-control"
                          readOnly
                          value={submitData.storeName}
                          id="exampleFormControlInput2"
                          placeholder="Enter Store Name"
                          onChange={(e) =>
                            handleChange("storeName", e.target.value)
                          }
                        />
                      </div>
                      <div className="form-group">
                        <Form.Select
                          onChange={(e) =>
                            handleChange("widgetId", e.target.value)
                          }
                          required
                          className="form-control"
                          aria-label="Default select example"
                        >
                          <option>Select Widget</option>
                          {allwidgets.map((data) => {
                            return (
                              <option key={data._id} value={data._id}>
                                {data.title}
                              </option>
                            );
                          })}
                        </Form.Select>
                      </div>
                      <button type="submit" className="btn">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showWidgetModal && (
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
                      onClick={() => setShowWidgetModal(!showWidgetModal)}
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
                          <img src={widgetData?.logo} alt="" />
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
      </div>
    </>
  );
};
