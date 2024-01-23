import React, { useEffect, useState } from "react";
import "../scss/home.scss";
import "../scss/store.scss";
import cashimg from "../assets/cash.png";
import totalstore from "../assets/totalstore.png";
import graphimg from "../assets/reported.PNG";
import apiClient from "../api/apiClient";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../components/Toast";
import BarChartComponent from "../components/BarChartComponent";
export const Dashboard = () => {
    const { role } = useSelector((state) => state.auth);
    const [Dashboard, setDashboard] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [widgetData, setWidgetData] = useState({});
    const [showWidget, setshowWidget] = useState(false);
    const [weeklyDonation, setWeeklyDonation] = useState({});
    const [toastData, SetToastData] = useState({
        bg: null,
        message: null,
    });
    const baseURL = process.env.REACT_APP_FE_URL;
    const fetchDashboardData = async () => {
        const res = await apiClient.get("/foundation/dashboard");
        if (res.status === 200) {
            setDashboard(res.data);
            console.log(res.data);
        }
    };
    const getDashboardWeeklyData = async () => {
        const res = await apiClient.get("/foundation/getFoundationWeeklyData");
        if (res.ok) {
          console.log(res.data,'foum');
          setWeeklyDonation(res.data);
        }
      };
    useEffect(() => {
        fetchDashboardData();
        getDashboardWeeklyData()
    }, []);
    const getDayOfWeek = (timestamp) => {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
        console.log(weeklyTransactions, "33333333");
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

    return (
        <div className="home-page-1">
            <div className="donation">
                {showToast ? (
                    <Toast bg={toastData.bg} message={toastData.message} />
                ) : null}
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="home">
                            <div className="cash">
                                <a href="#">
                                    <img src={cashimg} alt="" />
                                </a>
                                <strong>Total Cash</strong>
                                <span>{Dashboard?.totalDonation}</span>
                            </div>
                        </div>
                        <div className="store">
                            <div className="cash">
                                <a href="#">
                                    <img src={totalstore} alt="" />
                                </a>
                                <strong>Total Store</strong>
                                <span>{Dashboard?.totalStores}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="graph">
                            <BarChartComponent data={chartData} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="data-table">
                {Dashboard?.totalStores > 0 ? (
                    <>
                        <table className="table table-striped table-responsive text-center table-hover table-responsive-sm">
                            <thead>
                                <tr>
                                    <th scope="col" className="bg-secondary text-white">Store Name</th>
                                    <th scope="col" className="bg-secondary text-white">Store Id</th>
                                    <th scope="col" className="bg-secondary text-white">Widget</th>
                                    <th scope="col" className="bg-secondary text-white">Donations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Dashboard?.storeDonations?.map((store, index) => (
                                    <tr key={index}>
                                        <td>{store.storeName}</td>
                                        <td>{store.storeId}</td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    handleviewWidget(
                                                        //foundation.donations.widgetId,
                                                        //foundation.foundationData.user,
                                                        //foundation.foundationData.donations.storeId
                                                    )
                                                }
                                            >
                                                <a onClick={() => setshowWidget(!showWidget)}> View </a>
                                            </button>
                                        </td>
                                        {/*<td>{store.widgetIds}</td>*/}
                                        <td>{store.totalDonation}</td>
                                        {/*<td>
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
                                                <option selected={foundation.foundationData.user[0].pause ? true : false} value="active">Active</option>
                                                <option selected={foundation.foundationData.user[0].pause ? true : false} value="pause">Pause</option>
                                            </select>
                                        </td>*/}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    "No donation Exist"
                )}
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
        </div>
    );
};
