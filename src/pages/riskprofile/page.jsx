import React, { useState, useEffect } from "react";
import {
  useGetRiskProfileQuery,
  useActivateUserMutation,
  useDeactivateUserMutation,
} from "../../redux/slices/riskprofile/riskprofileApi";
import {
  Header,
  ExportCSVButton,
  Pagination,
  EmptyState,
  ActionDialog,
  SortableTableHeader,
} from "../../components";
import RiskProfileQuestions from "../../components/riskprofilequestions";
import SearchBox from "../../components/SearchBox";
import { useStateContext } from "../../contexts/ContextProvider";

const RiskProfilePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const { currentMode } = useStateContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, error } = useGetRiskProfileQuery({
    page: currentPage,
    search: debouncedSearchTerm,
  });

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAnswers, setModalAnswers] = useState([]);

  // Action dialog states
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [actionReason, setActionReason] = useState("");

  // RTK Query mutations
  const [activateUser, { isLoading: activateLoading }] =
    useActivateUserMutation();
  const [deactivateUser, { isLoading: deactivateLoading }] =
    useDeactivateUserMutation();

  if (isLoading) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white"
        }`}
      >
        <Header category="Page" title="Risk Profiles" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white"
        }`}
      >
        <Header category="Page" title="Risk Profiles" />
        <EmptyState
          title="Unable to Load Risk Profiles"
          message="We encountered an issue while loading the risk profiles. Please try refreshing the page or contact support if the problem persists."
          buttonText="Refresh Page"
          variant="error"
        />
      </div>
    );
  }

  const riskProfiles = data?.data || [];
  const totalRecords = data?.total || 0;
  const backendLimit = data?.limit || 10;
  const totalPages = Math.ceil(totalRecords / backendLimit);

  if (riskProfiles.length === 0) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
            : "bg-white"
        }`}
      >
        <Header category="Page" title="Risk Profiles" />
        <EmptyState
          title="No Risk Profiles Found"
          message="Risk profiles will appear here once they are completed by users."
          iconType="users"
        />
      </div>
    );
  }

  const sortRecords = (records, field, direction) =>
    [...records].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      if (field === "created_at") {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (field === "user_email") {
        aValue = a.user?.email || "";
        bValue = b.user?.email || "";
      }

      if (field === "user_name") {
        aValue = `${a.user?.first_name || ""} ${a.user?.last_name || ""}`
          .trim()
          .toLowerCase();
        bValue = `${b.user?.first_name || ""} ${b.user?.last_name || ""}`
          .trim()
          .toLowerCase();
      }

      if (field === "risk_level_name") {
        aValue = a.risk_level?.risk_level || "";
        bValue = b.risk_level?.risk_level || "";
      }

      if (
        typeof aValue === "string" &&
        !["user_name", "user_email", "risk_level_name"].includes(field)
      ) {
        aValue = aValue.toLowerCase();
      }
      if (
        typeof bValue === "string" &&
        !["user_name", "user_email", "risk_level_name"].includes(field)
      ) {
        bValue = bValue.toLowerCase();
      }

      if (aValue === null || aValue === undefined) aValue = "";
      if (bValue === null || bValue === undefined) bValue = "";

      if (direction === "asc") {
        if (aValue > bValue) return 1;
        if (aValue < bValue) return -1;
        return 0;
      }
      if (aValue < bValue) return 1;
      if (aValue > bValue) return -1;
      return 0;
    });

  const sortedRecords = sortRecords(riskProfiles, sortField, sortDirection);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.trim());
    setCurrentPage(1);
  };

  const handleView = (item) => {
    let answers = [];
    try {
      answers = JSON.parse(item.answers);
    } catch (e) {
      answers = [];
    }
    setModalAnswers(answers);
    setModalOpen(true);
  };

  // Helper function to check if any AML flag is true
  const checkIsActive = (
    amlUqudo,
    amlIndustry,
    amlCountryJob,
    amlCountryRes
  ) => {
    return amlUqudo || amlIndustry || amlCountryJob || amlCountryRes;
  };

  // Handle activate action
  const handleActivateClick = (userId) => {
    setCurrentUserId(userId);
    setActionType("activate");
    setActionReason("");
    setActionDialogOpen(true);
  };

  // Handle deactivate action
  const handleDeactivateClick = (userId) => {
    setCurrentUserId(userId);
    setActionType("deactivate");
    setActionReason("");
    setActionDialogOpen(true);
  };

  // Submit activate/deactivate action
  const handleActionSubmit = async () => {
    try {
      if (actionType === "activate") {
        await activateUser({
          userId: currentUserId,
          reason: actionReason,
        }).unwrap();
      } else {
        await deactivateUser({
          userId: currentUserId,
          reason: actionReason,
        }).unwrap();
      }

      setActionDialogOpen(false);
      setActionReason("");
      // Data will auto-refresh due to invalidatesTags
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  const renderRiskLevelBadge = (riskLevel) => {
    if (!riskLevel) {
      return "";
    }
    let className =
      "bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-semibold";
    if (riskLevel === "Aggressive") {
      className =
        "bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold";
    } else if (riskLevel === "Growth") {
      className =
        "bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold";
    }
    return <span className={className}>{riskLevel}</span>;
  };

  const getRowBackgroundClass = (index) => {
    if (currentMode === "Dark") {
      return "bg-gradient-to-r from-black via-slate-900 to-black";
    }
    return index % 2 === 0 ? "bg-white" : "bg-gray-50";
  };

  return (
    <div
      className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
        currentMode === "Dark"
          ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
          : "bg-white shadow-lg"
      }`}
    >
      <Header category="Page" title="Risk Profiles" />

      {/* Search Box and Export Button */}
      <div className="mb-4 flex items-center justify-between">
        <SearchBox
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by email..."
        />
        <ExportCSVButton
          data={sortedRecords}
          filename="risk-profiles.xlsx"
          buttonText="Export to Excel"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table
          className={`min-w-max border ${
            currentMode === "Dark"
              ? "bg-transparent border-gray-700"
              : "bg-white border-gray-300"
          }`}
        >
          <thead
            className={currentMode === "Dark" ? "bg-transparent" : "bg-gray-50"}
          >
            <tr>
              <SortableTableHeader
                field="user_id"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                User ID
              </SortableTableHeader>
              <SortableTableHeader
                field="user_email"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Email
              </SortableTableHeader>
              <SortableTableHeader
                field="user_name"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Full Name
              </SortableTableHeader>
              <SortableTableHeader
                field="date_of_birth"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Date of Birth
              </SortableTableHeader>
              <SortableTableHeader
                field="phone_number"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Phone Number
              </SortableTableHeader>
              <SortableTableHeader
                field="customer_number"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Customer Number
              </SortableTableHeader>
              <SortableTableHeader
                field="equity_account_number"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Equity Account Number
              </SortableTableHeader>
              <SortableTableHeader
                field="etf_account_number"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                ETF Account Number
              </SortableTableHeader>
              <SortableTableHeader
                field="mf_account_number"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                MF Account Number
              </SortableTableHeader>
              <SortableTableHeader
                field="created_at"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Created At
              </SortableTableHeader>
              <SortableTableHeader
                field="updated_at"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Updated At
              </SortableTableHeader>
              <SortableTableHeader
                field="risk_level_name"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Risk Level
              </SortableTableHeader>
              <SortableTableHeader
                field="aml_country_job"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                AML Country Job
              </SortableTableHeader>
              <SortableTableHeader
                field="aml_country_res"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                AML Country Res
              </SortableTableHeader>
              <SortableTableHeader
                field="aml_industry"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                AML Industry
              </SortableTableHeader>
              <SortableTableHeader
                field="aml_uqudo"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                AML Uqudo
              </SortableTableHeader>
              <SortableTableHeader
                field="total_score"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Total Score
              </SortableTableHeader>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-b ${
                  currentMode === "Dark"
                    ? "text-cyan-400 border-gray-700"
                    : "text-gray-500 border-gray-300"
                }`}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              currentMode === "Dark"
                ? "bg-transparent divide-gray-800"
                : "bg-white divide-gray-200"
            }`}
          >
            {sortedRecords.map((item, index) => (
              <tr key={item.id} className={getRowBackgroundClass(index)}>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    currentMode === "Dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.user_id}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.user?.email || ""}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {`${item.user?.first_name || ""} ${
                    item.user?.last_name || ""
                  }`.trim()}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.user?.date_of_birth}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.user?.phone_number}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.user?.customer_number}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.user?.equity_account_number}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.user?.etf_account_number}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.user?.mf_account_number}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : ""}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.updated_at
                    ? new Date(item.updated_at).toLocaleString()
                    : ""}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {renderRiskLevelBadge(item.risk_level?.risk_level)}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.aml_country_job ? (
                    <span className="text-green-800 bg-green-100 px-3 py-1 rounded-full font-semibold">
                      True
                    </span>
                  ) : (
                    <span className="text-red-800 bg-red-100 px-3 py-1 rounded-full font-semibold">
                      False
                    </span>
                  )}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.aml_country_res ? (
                    <span className="text-green-800 bg-green-100 px-3 py-1 rounded-full font-semibold">
                      True
                    </span>
                  ) : (
                    <span className="text-red-800 bg-red-100 px-3 py-1 rounded-full font-semibold">
                      False
                    </span>
                  )}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.aml_industry ? (
                    <span className="text-green-800 bg-green-100 px-3 py-1 rounded-full font-semibold">
                      True
                    </span>
                  ) : (
                    <span className="text-red-800 bg-red-100 px-3 py-1 rounded-full font-semibold">
                      False
                    </span>
                  )}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.aml_uqudo ? (
                    <span className=" bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                      True
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
                      False
                    </span>
                  )}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.total_score}
                </td>

                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currentMode === "Dark" ? "text-white" : "text-gray-500"
                  }`}
                >
                  <div className="flex gap-3 flex-wrap items-center">
                    {/* View Report Button */}
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800"
                      onClick={() => handleView(item)}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      View Report
                    </button>

                    {/* Activate Button */}
                    {!item.user?.is_deleted && (
                      <button
                        type="button"
                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                          !checkIsActive(
                            item.aml_uqudo,
                            item.aml_industry,
                            item.aml_country_job,
                            item.aml_country_res
                          ) ||
                          item.is_active ||
                          activateLoading
                            ? "bg-gray-400 text-gray-700 cursor-not-allowed opacity-60"
                            : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 focus:ring-green-400"
                        }`}
                        disabled={
                          !checkIsActive(
                            item.aml_uqudo,
                            item.aml_industry,
                            item.aml_country_job,
                            item.aml_country_res
                          ) ||
                          item.is_active ||
                          activateLoading
                        }
                        onClick={() => handleActivateClick(item.user_id)}
                      >
                        {(() => {
                          if (
                            activateLoading &&
                            currentUserId === item.user_id
                          ) {
                            return (
                              <>
                                <svg
                                  className="w-4 h-4 animate-spin"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    className="opacity-25"
                                  />
                                  <path
                                    fill="currentColor"
                                    d="m12 2 a10 10 0 0 1 10 10"
                                    className="opacity-75"
                                  />
                                </svg>
                                Activating...
                              </>
                            );
                          }
                          if (item.is_override && item.is_active) {
                            return (
                              <>
                                <svg
                                  className="w-4 h-4 text-green-300"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs">
                                  Activated{" "}
                                  {new Date(item.created_at).toLocaleDateString(
                                    "en-GB"
                                  )}
                                </span>
                              </>
                            );
                          }
                          return (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Activate
                            </>
                          );
                        })()}
                      </button>
                    )}

                    {/* Deactivate Button */}
                    {checkIsActive(
                      item.aml_uqudo,
                      item.aml_industry,
                      item.aml_country_job,
                      item.aml_country_res
                    ) && (
                      <button
                        type="button"
                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                          item.user?.is_deleted || deactivateLoading
                            ? "bg-gray-400 text-gray-700 cursor-not-allowed opacity-60"
                            : "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-xl hover:from-red-600 hover:to-rose-700 transform hover:scale-105 focus:ring-red-400"
                        }`}
                        disabled={item.user?.is_deleted || deactivateLoading}
                        onClick={() => handleDeactivateClick(item.user_id)}
                      >
                        {(() => {
                          if (
                            deactivateLoading &&
                            currentUserId === item.user_id
                          ) {
                            return (
                              <>
                                <svg
                                  className="w-4 h-4 animate-spin"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    className="opacity-25"
                                  />
                                  <path
                                    fill="currentColor"
                                    d="m12 2 a10 10 0 0 1 10 10"
                                    className="opacity-75"
                                  />
                                </svg>
                                Deactivating...
                              </>
                            );
                          }
                          if (item.user?.is_deleted) {
                            return (
                              <>
                                <svg
                                  className="w-4 h-4 text-red-300"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Deactivated
                              </>
                            );
                          }
                          return (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Deactivate
                            </>
                          );
                        })()}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalRecords={totalRecords}
        backendLimit={backendLimit}
        recordsCount={sortedRecords.length}
      />

      {/* No Records Message for search results */}
      {sortedRecords.length === 0 && searchTerm && (
        <EmptyState
          title="No Risk Profiles Found"
          message="No risk profiles match your search criteria. Try adjusting your search terms."
          iconType="users"
        />
      )}

      <RiskProfileQuestions
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        answers={modalAnswers}
      />

      <ActionDialog
        isOpen={actionDialogOpen}
        onClose={() => {
          setActionDialogOpen(false);
          setActionReason("");
        }}
        title={
          actionType === "activate" ? "Activate Account" : "Deactivate Account"
        }
        actionType={actionType}
        reason={actionReason}
        onReasonChange={(e) => setActionReason(e.target.value)}
        onSubmit={handleActionSubmit}
        isLoading={activateLoading || deactivateLoading}
      />
    </div>
  );
};

export default RiskProfilePage;
