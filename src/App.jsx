import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navbar, Footer, Sidebar } from "./components";
import { Ecommerce } from "./pages";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from "./pages/login/page";
import KycVerifiedPage from "./pages/kyc-verified/page";
import AllUsersPage from "./pages/allusers/page"; 
import RiskProfilePage from "./pages/riskprofile/page";
// import Transactions from "./pages/TransactionTable/page";
import OrderbookTransactionsPage from "./pages/orderbooktransactions/page";
import WalletPage from "./pages/wallet/page";
import BankInfoPage from "./pages/bankinfo/page";
import BankKycPage from "./pages/bank-kyc/page";
import PortfolioPage from "./pages/portfolio/page";
import PortfolioAnalysisDetails from "./pages/portfolioanalysisdetails/page";
import CepBasketPage from "./pages/cepbasket/page";
import StocksManagerPage from "./pages/stocksmanager/page";
import WithdrawalsPage from "./pages/withdraw/page";
import PhysicalDelivery from "./pages/PhysicalDelivery/page";
import Blog from "./pages/blog/page";
import BankVerification from "./pages/bankverification/page";
import ChildAccount from "./pages/Childaccount/page";
import Network from "./pages/Network/page";
import AddReasons from "./pages/AddReason/page";
import Childreason from "./pages/Childreason/page";
import Emailer from "./pages/Emailer/Emailer";

import "./App.css";
import { useStateContext } from "./contexts/ContextProvider";
import Transactions from "./pages/transaction/page";

const App = () => {
  const { activeMenu } = useStateContext();
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        {/* Toast Container for login page */}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
          toastStyle={{
            fontSize: '14px',
            minHeight: '50px'
          }}
        />
      </>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex overflow-x-hidden">
        {/* Sidebar */}
        <div
          className={`fixed z-40 sidebar w-72 bg-white transition-transform duration-500 ease-in-out transform ${
            activeMenu
              ? "translate-x-0 border-r border-gray-200"
              : "-translate-x-full border-r border-transparent pointer-events-none"
          }`}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            activeMenu ? "bg-main-bg min-h-screen md:ml-72 w-full" : "bg-main-bg w-full min-h-screen flex-2"
          } overflow-x-hidden`}
        >
          <div className="fixed md:static bg-main-bg navbar w-full">
            <Navbar />
          </div>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<Ecommerce />} />
            <Route path="/dashboard" element={<Ecommerce />} />

            <Route path="/kyc-verified" element={<KycVerifiedPage />} />
            <Route path="/emailer" element={<Emailer />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/bank-verification" element={<BankVerification />} />
            <Route path="/physical-delivery" element={<PhysicalDelivery />} />
            <Route path="/addReason" element={<AddReasons />} />
            <Route path="/child-account" element={<ChildAccount />} />
            <Route path="/network" element={<Network />} />
            <Route path="/all-users-portfolio" element={<AllUsersPage />} />
            <Route path="/riskprofile" element={<RiskProfilePage />} />
            <Route path="/TransactionsTable" element={<Transactions />} />
            <Route path="/childaccounts" element={<ChildAccount />} />
            <Route path="/withdrawals" element={<WithdrawalsPage />} />
            <Route path="/childreason" element={< Childreason/>} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/bankinfo" element={<BankInfoPage />} />
            <Route path="/bank-kyc" element={<BankKycPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/cepbasket" element={<CepBasketPage />} />
            <Route path="/stocksmanager" element={<StocksManagerPage />} />
            <Route path="/portfolioanalysisdetails" element={<PortfolioAnalysisDetails />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/admin/portfolios/:userId/transactions" element={<OrderbookTransactionsPage />} />
          </Routes>

          <Footer />
        </div>

        {/* Toast Container - Added here for authenticated users */}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
          toastStyle={{
            fontSize: '14px',
            minHeight: '50px',
            borderRadius: '8px'
          }}
          bodyClassName="toast-body"
          progressClassName="toast-progress"
        />
      </div>
    </BrowserRouter>
  );
};

export default App;