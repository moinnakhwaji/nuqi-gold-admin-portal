import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";
import kycReducer from "./slices/kyc/kycSlice";
import allusersReducer from "./slices/allusers/allusersSlice";
import riskprofileReducer from "./slices/riskprofile/riskprofileSlice";
import orderbookReducer from "./slices/orderbook/orderbookSlice";
import dashboardReducer from "./slices/dashboard/dashboardSlice";
import bankinfoReducer from "./slices/bankinfo/bankinfoSlice";
import walletReducer from "./slices/wallet/walletSlice";
import cepbasketReducer from "./slices/cepbasket/cepbasketSlice";
import stocksReducer from "./slices/stockmanager/stocksSlice";
import bankKycReducer from "./slices/bank-kyc/bankkycSlice";
import withdrawReducer from "./slices/withdraw/withdrawSlice";
import BankVerification from "./slices/Bankverification/bankverificationSlice";
import transactions from "./slices/Transaction/TransactionSlice";
import  networkSlice  from "./slices/network/networkSlice";
import kidzSlice from "./slices/kidzaccount/kidzSlice";
import physicalSlice from "./slices/physicalDelivery/physicalDeliverySlice"
import emailReducer   from "./slices/emailer/emailSlice"
import BlogSlice from "./slices/blog/blogSlice"
import Addreasons from "./slices/addreason/addreasonSlice"
import Childreason from "./slices/childreason/addChildReasonSlice"
import { apiSlice } from "./api/api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    kyc: kycReducer,
  allusers: allusersReducer,
    riskprofile: riskprofileReducer,
    orderbook: orderbookReducer,
    dashboard: dashboardReducer,
    bankinfo: bankinfoReducer,
    wallet: walletReducer,
    cepbasket: cepbasketReducer,
    stocks: stocksReducer,
    bankKyc: bankKycReducer,
    withdraw: withdrawReducer,
    bankVerification: BankVerification,
    email: emailReducer,
    Transactions: transactions,
    network: networkSlice,
    physicalDelivery: physicalSlice,
    kidz: kidzSlice,
    blog: BlogSlice,
    Addreasons:Addreasons,
    Childreason:Childreason
    ,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(apiSlice.middleware),
});
