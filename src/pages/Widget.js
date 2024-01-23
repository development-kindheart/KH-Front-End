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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Widget = () => {
  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const initialValue = {
    title: "",
    description: "",
    logo: "",
    id: "",
  };
  const [submitData, setSubmitData] = useState(initialValue);
  const handleChange = (key, value) => {
    setSubmitData({ ...submitData, [key]: value });
  };
  const [showModal, setShowModal] = useState(false);
  const [showRemoveModal, setRemoveModal] = useState(false);
  const [showWidget, setshowWidget] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastData, SetToastData] = useState({
    bg: null,
    message: null,
  });
  const [widgets, setWidgets] = useState([]);
  const [widgetId, setWidgetId] = useState("");
  const [widgetData, setWidgetData] = useState({});

  const handleModalToggle = async (widgetId = "") => {
    setShowModal(!showModal);
    const res = await apiClient.get(`/widget/find/${widgetId}`);
    if (res.status === 200) {
      let resData = {
        title: res.data.title,
        description: res.data.description,
        logo: "",
        id: res.data._id,
      };
      setSubmitData(resData);
    }
  };
  const resetSubmitData = () => {
    setSubmitData({
      title: "",
      description: "",
      logo: "",
      id: "",
    });
    setShowModal(!showModal);
  };
  const handleRemoveToggle = (widgetId = "") => {
    setWidgetId(widgetId);
    setRemoveModal(!showRemoveModal);
  };
  const handleWidgetToggle = async (widgetId = "") => {
    const res = await apiClient.get(`/widget/find/${widgetId}`);
    if (res.status === 200) {
      setWidgetData(res.data);
      setshowWidget(!showWidget);
    }
  };
  const removeWidget = async () => {
    const res = await apiClient.delete(`/widget/delete/${widgetId}`);
    if (res.status === 200) {
      toast.success(res.data.message, {
        style: {
          width: '300px',
          background: '#198754',
          color:'white'
        },
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          setRemoveModal(!showRemoveModal);
          setSubmitData({
            storeId: "",
            storeName: "",
            widgetId: "",
          });
          fetchWidgets();
        },
      });
    }
  };

  const { request, loading, error } = useApi((data, id = "") =>
    id
      ? apiClient.put(`/widget/edit/${submitData.id}`, data)
      : apiClient.post("/widget/save", data)
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", submitData.title);
    formData.append("description", submitData.description);
    formData.append("logo", submitData.logo);
    // if submit data has id then we will do edit operation else add operation
    if (submitData.id) {
      const result = await request(formData, submitData.id);
      if (result.ok) {
        setSubmitData({
          title: "",
          description: "",
          logo: "",
          id: "",
        });
        fetchWidgets();
        toast.success(result.data.message, {
          style: {
            width: '300px',
            background: '#198754',
            color:'white'
          },
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setShowModal(!showModal);
      }
    } else {
      const result = await request(formData, submitData.id);
      if (result.ok) {
        toast.success(result.data.message, {
          style: {
            width: '300px',
            background: '#198754',
            color:'white'
          },
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => {
            setShowModal(!showModal);
            setSubmitData({
              title: "",
              description: "",
              logo: "",
              id: "",
            });
            fetchWidgets();
          },
        });
      }
    }
  };

  const fetchWidgets = async () => {
    const res = await apiClient.get("/widget/findAll");
    if (res.status === 200) {
      setWidgets(res.data);
    }
  };
  useEffect(() => {
    fetchWidgets();
  }, []);

  return (
    <>
      {loading && <Loader />}
      {showToast ? <Toast bg={toastData.bg} message={toastData.message} /> : null}
      <div className="widget-page">
        <div className="title">
          <h3>All Widgets</h3>
        </div>
        <div className="new-widget">
          <button
            className="btn btn-info"
            onClick={() => setShowModal(!showModal)}
          >
            Add New Widget
          </button>
        </div>
        <div className="widgetList">
          {widgets?.map((data, index) => {
            return (
              <div key={index} className="widget-data">
                <div className="name">
                  <h3>{data.title}</h3>
                </div>
                <div className="buttons">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleModalToggle(data._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleRemoveToggle(data._id)}
                  >
                    Remove
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleWidgetToggle(data._id)}
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })}
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
        {showWidget && <div onClick={handleWidgetToggle} />}

        {showRemoveModal && (
          <div className="romoveModal">
            <div
              className="modal"
              tabIndex="-1"
              role="dialog"
              style={{ display: "block" }}
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-body">
                    <div className="removeContent">
                      <div className="title">
                        <span>Do you want to Remove store</span>
                      </div>
                      <div className="confirm">
                        <button
                          type="button btn"
                          className="close"
                          onClick={handleRemoveToggle}
                        >
                          No
                        </button>
                        <button
                          type="button btn"
                          className="conf"
                          onClick={removeWidget}
                        >
                          Yes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showRemoveModal && <div onClick={handleRemoveToggle} />}

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
                    <h5 className="modal-title">
                      {submitData.id ? "Edit Widget" : "Add Widget"}
                    </h5>
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
                          className="form-control"
                          id="exampleFormControlInput1"
                          placeholder="Title"
                          required
                          value={submitData.title}
                          onChange={(e) =>
                            handleChange("title", e.target.value)
                          }
                        />
                      </div>
                      <div className="form-group">
                        <textarea
                          type="textarea"
                          className="form-control"
                          id="exampleFormControlInput1"
                          placeholder="Widget Description"
                          required
                          value={submitData.description}
                          onChange={(e) =>
                            handleChange("description", e.target.value)
                          }
                        />
                      </div>
                      <div className="choosefile">
                        <input
                          type="file"
                          placeholder="Choose logo"
                          required={!submitData.id ? true : false}
                          onChange={(e) =>
                            handleChange("logo", e.target.files[0])
                          }
                        />
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
        {showModal && <div onClick={handleModalToggle} />}
      </div>
    </>
  );
};
