import logo from './logo.svg';
import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate, BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Widget } from './pages/Widget';
import { Store } from './pages/Store';
import { Donation } from './pages/Donation';
import { Layout } from './components/Layout';
import Widgets from './components/Widgets';
// store
import { StoreDashboard } from './pages/store/StoreDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminDonation } from './pages/admin/AdminDonation';
import { AdminFoundation } from './pages/admin/AdminFoundation';
import { StoreConnectionGuideline } from './pages/store/StoreConnectionGuideline';
import { AdminStore } from './pages/admin/AdminStore';
import { StoreDonation } from './pages/store/StoreDonation';
import { JoiningRequest } from './pages/admin/JoiningRequest';
//
import { SignupFoundation } from './components/auth/SignupFoundation';
import { Login } from './components/auth/Login';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ResetPassword } from './components/auth/ResetPassword';
import { SignupStore } from './components/auth/SignupStore';
import { SignupMain } from './components/auth/SignupMain';
import PageNotFound from './components/404';
// import { socketEmitEvent } from "./socket/emit";
// import ChatContextProvider from "./redux/ChatContext";
// import { useSocketContext } from "./redux/SocketContext";
import Room from './pages/Room/Room';
import { useEffect } from 'react';
import ChatHome from './pages/Chat/Home';

function App() {
  const { isLoggedIn, role, userId } = useSelector((state) => state.auth);
  // const {
  //   socketConnect,
  //   socketValue: { socket, socketId },
  // } = useSocketContext();
  // useEffect(() => {
  //   if (isLoggedIn && !socketId) {
  //     socketConnect();
  //   }
  // }, [isLoggedIn, socketId, socketConnect]);

  // useEffect(() => {
  //   if (isLoggedIn && socketId) {
  //     socketEmitEvent(socket).userOnline(userId, socketId);
  //   }
  // }, [socketId, socket, isLoggedIn]);
  return (
    <>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path='/signup-option' element={isLoggedIn ? <Layout /> : <SignupMain />} />
          <Route
            path='/signup-foundation'
            element={isLoggedIn ? <Layout /> : <SignupFoundation />}
          />
          <Route path='/signupstore' element={isLoggedIn ? <Layout /> : <SignupStore />} />
          <Route path='/login' element={isLoggedIn ? <Layout /> : <Login />} />
          <Route path='/login' element={isLoggedIn ? <Layout /> : <Login />} />
          <Route path='/chat' element={isLoggedIn ? <ChatHome /> : <Layout />} />
          <Route path='/open-room' element={isLoggedIn ? <Room /> : <Login />} />
          <Route
            path='/forgotpassword'
            element={isLoggedIn ? <Layout /> : <ForgotPassword />}
          />
          <Route path='/resetpassword' element={isLoggedIn ? <Layout /> : <ResetPassword />} />

          <Route path='/' element={isLoggedIn ? <Layout /> : <Login />} />
          <Route path='/store/widgets/:id' element={<Widgets />} />
          <Route path='/' element={isLoggedIn ? <Layout /> : <Navigate to='/login' />} />

          <Route path='/' element={isLoggedIn ? <Layout /> : <Login />} />
          <Route path='/store/widgets/:id' element={<Widgets />} />
          {/* <Route
            path="/"
            element={isLoggedIn ? <Layout /> : <SignupMain />}
          /> */}
          <Route path='/' element={isLoggedIn ? <Layout /> : <Navigate to='/login' />}>
            {/*XXXXXXXXXXXXXXXXXXXXXXXXXXXXx Foundation Routes *XXXXXXXXXXXXXXXXx/}
            {/* Graphically reprensentation (totol no of store and total amount of donation)*/}
            <Route path='/dashboard' element={role === 'foundation' && <Dashboard />} />
            {/* Donation contain store name, Amount, and status etc... */}
            <Route
              path='/dashboard/Donation'
              element={role === 'foundation' && <Donation />}
            />
            {/* Create widgets */}
            <Route path='/dashboard/widget' element={role === 'foundation' && <Widget />} />
            {/* Assign widgets to store */}
            <Route path='/dashboard/store' element={role === 'foundation' && <Store />} />
            {/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXx Store Routes *XXXXXXXXXXXXXXXX */}
            <Route
              path='/store/dashboard'
              // element={role === "store" && <StoreDashboard />}
              element={
                role === 'store' && isLoggedIn ? (
                  <StoreDashboard />
                ) : (
                  <Navigate to='/store/dashboard' />
                )
              }
            />
            <Route path='/store/donation' element={role === 'store' && <StoreDonation />} />
            <Route
              path='/store/guideline'
              element={role === 'store' && <StoreConnectionGuideline />}
            />
            {/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXX Admin Routes *XXXXXXXXXXXXXXXX */}
            <Route path='/admin/dashboard' element={role === 'admin' && <AdminDashboard />} />
            <Route path='/admin/donation' element={role === 'admin' && <AdminDonation />} />
            <Route path='/admin/store' element={role === 'admin' && <AdminStore />} />
            <Route
              path='/admin/foundation'
              element={role === 'admin' && <AdminFoundation />}
            />
            <Route
              path='/admin/joiningRequest'
              element={role === 'admin' && <JoiningRequest />}
            />
            <Route path='*' element={<PageNotFound />} />
          </Route>
        </Routes>
      </Router>
      {/* <ChatContextProvider>
      </ChatContextProvider> */}
    </>
  );
}

export default App;
