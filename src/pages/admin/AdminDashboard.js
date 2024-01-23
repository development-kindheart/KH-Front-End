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
export const AdminDashboard = () => {
  const [Dashboard, setDashboard] = useState("");
  const fetchAdminDashBoardData = async () => {
    let result = await apiClient.get("admin/dashboard");
    if (result.status === 200) {
      setDashboard(result.data);
      console.log(result.data);
    }
  };
  useEffect(() => {
    fetchAdminDashBoardData();
  }, []);
  return (
    <div className="admin-page">
     <div className="admin">
          <div className="total-cash">
            <span className="title">Total Cash:</span>
            <span>{Dashboard?.totalCash}</span>
          </div>
          <div className="total-foundation">
              <span>Total Foundation:</span>
              <span>{Dashboard?.TotalFoundation}</span>
          </div>
          <div className="total-store">
              <span>Total Store:</span>
              <span>{Dashboard?.TotalStore}</span>
          </div>
          <div className="active-foundation">
              <span>Active Foundation:</span>
              <span>{Dashboard?.activeFoundation}</span>
          </div>
      </div>
      <div className="graph">
        <a href="#">
          <img src={graphimg} alt="" />
        </a>
      </div>
    </div>
  );
};
