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
import Pagination from "../../components/Pagination";
export const AdminDonation = () => {
  const initialFilterData = {
    fromDate: "",
    toDate: "",
    name: "",
  };
  const [totalFoundations, setTotalFoundations] = useState("");
  const [foundations, setFoundations] = useState([]);
  const [filterData, setFilterData] = useState(initialFilterData);
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();

  const handleFilter = (key, value) => {
    setFilterData({ ...filterData, [key]: value });
  };

  const fetchData = async () => {
    let result = await apiClient.get(`admin/donation?page=${currentPage}`);
    if (result.ok) {

      setFoundations(result.data.data);
      setTotalPages(result.data.totalPages);
      setCurrentPage(result.data.currentPage);

      console.log(result);
      setFoundations(result?.data?.data);
      setTotalPages(result?.data?.totalPages);
      setCurrentPage(result?.data?.currentPage);

    }
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    let status = "";
    if (filterData.status) {
      status = filterData.status;
    }
    const res = await apiClient.get(
      `/admin/Donationfilter?fromDate=${filterData.fromDate}&toDate=${filterData.toDate}&name=${filterData.name}&status=${status}`
    );
    if (res.ok) {
      console.log(res.data);
      setFoundations(res.data.data);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
              placeholder="Store Name"
            />
          </div>
          <div className="form-group">
            <select
              className="form-control status"
              id="exampleFormControlSelect3"
              onChange={(e) => handleFilter("status", e.target.value)}
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
                <th scope="col" className="bg-secondary text-white">Store Name</th>
                <th scope="col" className="bg-secondary text-white">Date</th>
                <th scope="col" className="bg-secondary text-white">Amount</th>
                <th scope="col" className="bg-secondary text-white">Status</th>
              </tr>
            </thead>

            <tbody>
              {foundations?.map((foundation, index) =>
                foundation?.donations?.map((item, itemIndex) => (
                  <tr key={itemIndex}>
                    <td>{item.orderID}</td>
                    <td>{item.storeName}</td>
                    <td>{item.date}</td>
                    <td>{item.amount}</td>
                    <td>{item.paymentStatus}</td>
                  </tr>
                ))
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
