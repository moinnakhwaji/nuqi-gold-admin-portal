import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navbar, Footer, Sidebar } from "./components";
import { Ecommerce } from "./pages";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Import all your pages ---
import LoginPage from "./pages/login/page";
import KycVerifiedPage from "./pages/kyc-verified/page";
import AllUsersPage from "./pages/allusers/page"; 
import RiskProfilePage from "./pages/riskprofile/page";
import OrderbookTransactionsPage from "./pages/orderbooktransactions/page";
import WalletPage from "./pages/wallet/page";
import BankInfoPage from "./pages/bankinfo/page";
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
import Transactions from "./pages/transaction/page";



import "./App.css";
import { useStateContext } from "./contexts/ContextProvider";
import ProtectedRoute from "./pages/ProtectedRoute";
import Splashscreen from "./pages/Splashscreen/page";

// This component lays out the Sidebar, Navbar, and Footer for authenticated users
const MainLayout = ({ children }) => {
  const { activeMenu } = useStateContext();
  return (
    <div className="flex overflow-x-hidden">
      <div
        className={`fixed z-40 sidebar w-72 bg-white transition-transform duration-500 ease-in-out transform ${
          activeMenu
            ? "translate-x-0 border-r border-gray-200"
            : "-translate-x-full border-r border-transparent pointer-events-none"
        }`}
      >
        <Sidebar />
      </div>

      <div
        className={`transition-all duration-500 ease-in-out ${
          activeMenu ? "bg-main-bg min-h-screen md:ml-72 w-full" : "bg-main-bg w-full min-h-screen flex-2"
        } overflow-x-hidden`}
      >
        <div className="fixed md:static bg-main-bg navbar w-full">
          <Navbar />
        </div>
        
        {/* The page content will be rendered here */}
        {children}

        <Footer />
      </div>
    </div>
  );
};

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      {/* Routes are defined here */}
      <Routes>
     
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Ecommerce /></MainLayout></ProtectedRoute>} />
        <Route path="/kyc-verified" element={<ProtectedRoute><MainLayout><KycVerifiedPage /></MainLayout></ProtectedRoute>} />
        <Route path="/emailer" element={<ProtectedRoute><MainLayout><Emailer /></MainLayout></ProtectedRoute>} />
        <Route path="/blog" element={<ProtectedRoute><MainLayout><Blog /></MainLayout></ProtectedRoute>} />
        <Route path="/bank-verification" element={<ProtectedRoute><MainLayout><BankVerification /></MainLayout></ProtectedRoute>} />
        <Route path="/physical-delivery" element={<ProtectedRoute><MainLayout><PhysicalDelivery /></MainLayout></ProtectedRoute>} />
        <Route path="/addReason" element={<ProtectedRoute><MainLayout><AddReasons /></MainLayout></ProtectedRoute>} />
        <Route path="/child-account" element={<ProtectedRoute><MainLayout><ChildAccount /></MainLayout></ProtectedRoute>} />
        <Route path="/network" element={<ProtectedRoute><MainLayout><Network /></MainLayout></ProtectedRoute>} />
        <Route path="/all-users-portfolio" element={<ProtectedRoute><MainLayout><AllUsersPage /></MainLayout></ProtectedRoute>} />
        <Route path="/riskprofile" element={<ProtectedRoute><MainLayout><RiskProfilePage /></MainLayout></ProtectedRoute>} />
        <Route path="/TransactionsTable" element={<ProtectedRoute><MainLayout><Transactions /></MainLayout></ProtectedRoute>} />
        <Route path="/childaccounts" element={<ProtectedRoute><MainLayout><ChildAccount /></MainLayout></ProtectedRoute>} />
        <Route path="/withdrawals" element={<ProtectedRoute><MainLayout><WithdrawalsPage /></MainLayout></ProtectedRoute>} />
        <Route path="/childreason" element={<ProtectedRoute><MainLayout><Childreason /></MainLayout></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><MainLayout><WalletPage /></MainLayout></ProtectedRoute>} />
        <Route path="/bankinfo" element={<ProtectedRoute><MainLayout><BankInfoPage /></MainLayout></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><MainLayout><PortfolioPage /></MainLayout></ProtectedRoute>} />
        <Route path="/cepbasket" element={<ProtectedRoute><MainLayout><CepBasketPage /></MainLayout></ProtectedRoute>} />
        <Route path="/stocksmanager" element={<ProtectedRoute><MainLayout><StocksManagerPage /></MainLayout></ProtectedRoute>} />
        <Route path="/portfolioanalysisdetails" element={<ProtectedRoute><MainLayout><PortfolioAnalysisDetails /></MainLayout></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><MainLayout><Transactions /></MainLayout></ProtectedRoute>} />
        <Route path="/admin/portfolios/:userId/transactions" element={<ProtectedRoute><MainLayout><OrderbookTransactionsPage /></MainLayout></ProtectedRoute>} />
        <Route path="/splashscreen" element={<ProtectedRoute><MainLayout><Splashscreen /></MainLayout></ProtectedRoute>} />
        
        {/* Catch-all Route: If no other route matches, redirect to the dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {/* Global Toast Container */}
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
      />
    </BrowserRouter>
  );
};

export default App;