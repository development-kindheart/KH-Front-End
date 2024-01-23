import React, { useEffect, useState } from "react";
import "../..//scss/home.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import apiClient from "../../api/apiClient";
import useApi from "../../hooks/useApi";
import { current } from "@reduxjs/toolkit";
import Pagination from "../../components/Pagination";

export const StoreDonation = () => {
  const initialFilterData = {
    fromDate: "",
    toDate: "",
    name: "",
  };
  const [totalFoundations, setTotalFoundations] = useState("");
  const [foundations, setFoundations] = useState([]);
  const [filterData, setFilterData] = useState(initialFilterData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const handleFilter = (key, value) => {
    setFilterData({ ...filterData, [key]: value });
  };
  console.log(foundations, "testing don");
  const fetchStoreDonationData = async () => {
    const res = await apiClient.get(
      `/store/getDonationData?page=${currentPage}`
    );
    if (res.status === 200) {
      setTotalFoundations(res.data.totalFoundations);
      setFoundations(res.data.foundations.data);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    }
  };
  useEffect(() => {
    fetchStoreDonationData();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCheck = (foundation, item) => {
    // Check if the foundation has a pausedBy array
    if (foundation.pausedBy && foundation.pausedBy.includes(item.storeId)) {
      return "pause";
    } else {
      return "active";
    }
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    let paymentStatus = "";
    if (filterData.paymentStatus) {
      paymentStatus = filterData.paymentStatus;
    }
    const res = await apiClient.get(
      `/store/filter?fromDate=${filterData.fromDate}&toDate=${filterData.toDate}&name=${filterData.name}&paymentStatus=${paymentStatus}`
    );
    if (res.ok) {
      setFoundations(res.data.foundation);
    }
  };

  return (
    <div className="donation-page">
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
              placeholder="Founadtion Name"
            />
          </div>
          <div className="form-group">
            <select
              className="form-control status"
              id="exampleFormControlSelect3"
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
        {foundations.length > 0 ? (
          <table className="table table-striped table-responsive text-center table-hover">
            <thead>
              <tr>
                <th scope="col" className="bg-secondary text-white">OrderId</th>
                <th scope="col"  className="bg-secondary text-white">FoundationName</th>
                <th scope="col"  className="bg-secondary text-white">Date</th>
                <th scope="col"  className="bg-secondary text-white">Amount</th>
                <th scope="col"  className="bg-secondary text-white">paymentStatus</th>
              </tr>
            </thead>

            <tbody>
              {foundations?.map((foundation, index) =>
                foundation?.donations?.map((item, itemIndex) =>
                  item.orderID !== "0" || item.amount !== 0 ? (
                    <tr key={itemIndex}>
                      <td>{item.orderID}</td>
                      <td>{foundation.foundationName}</td>
                      <td>{item.date}</td>
                      <td>{item.amount}</td>
                      <td>{item.paymentStatus}</td>
                    </tr>
                  ) : null
                )
              )}
            </tbody>
          </table>
        ) : (
          "No donation Exist"
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};
