import React, { useState } from "react";

const ExpandableTable = ({
  data,
  columns,
  renderSubRow,
  getRowBackgroundClass,
  onSort,
  getSortIndicator,
  currentMode,
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRowExpansion = (rowId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowId)) {
      newExpandedRows.delete(rowId);
    } else {
      newExpandedRows.add(rowId);
    }
    setExpandedRows(newExpandedRows);
  };

  const renderExpandButton = (row) => {
    const hasSubRows = (row.subtransactions && row.subtransactions.length > 0) || 
                      (row.sub_transactions && row.sub_transactions.length > 0);
    const isExpanded = expandedRows.has(row.id);

    if (!hasSubRows) {
      return <div className="w-8 h-8" />; // Empty space for alignment
    }

    const buttonClass = currentMode === "Dark"
      ? "hover:bg-gray-700 text-white border-gray-600"
      : "hover:bg-gray-200 text-gray-600 border-gray-300";

    return (
      <button
        type="button"
        onClick={() => toggleRowExpansion(row.id)}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${buttonClass}`}
      >
        <svg
          className={`w-5 h-5 transition-transform duration-500 ${
            isExpanded ? "rotate-45" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </button>
    );
  };

  const renderDefaultSubRow = (subRow, parentIndex) => (
    <tr
      key={`${subRow.id}-sub`}
      className={`${getRowBackgroundClass(parentIndex)} border-l-4 border-blue-500 transition-all duration-500 ease-in-out transform`}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-2 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
          <span
            className={`text-xs ${
              currentMode === "Dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {subRow.id}
          </span>
        </div>
      </td>
      {columns.slice(1).map((column) => (
        <td
          key={column.key}
          className={`px-6 py-4 whitespace-nowrap text-sm ${
            currentMode === "Dark" ? "text-white" : "text-gray-500"
          }`}
        >
          {column.render ? column.render(subRow) : subRow[column.key]}
        </td>
      ))}
    </tr>
  );

  const getTableCellClass = (columnKey) => {
    if (columnKey === "id") {
      const baseClass = "font-medium";
      const colorClass = currentMode === "Dark" ? "text-white" : "text-gray-900";
      return `${baseClass} ${colorClass}`;
    }
    return currentMode === "Dark" ? "text-white" : "text-gray-500";
  };

  const getTableClass = () => {
    const baseClass = "min-w-max border";
    const themeClass = currentMode === "Dark"
      ? "bg-secondary-dark-bg border-gray-600"
      : "bg-white border-gray-300";
    return `${baseClass} ${themeClass}`;
  };

  const getTheadClass = () => {
    return currentMode === "Dark"
      ? "bg-secondary-dark-bg-light"
      : "bg-gray-50";
  };

  const getThClass = () => {
    const baseClass = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-b";
    const themeClass = currentMode === "Dark"
      ? "text-white border-gray-600"
      : "text-gray-500 border-gray-300";
    return `${baseClass} ${themeClass}`;
  };

  const getSortableThClass = () => {
    const baseClass = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-b cursor-pointer hover:bg-gray-100";
    const themeClass = currentMode === "Dark"
      ? "text-white border-gray-600 hover:bg-gray-700"
      : "text-gray-500 border-gray-300";
    return `${baseClass} ${themeClass}`;
  };

  const getTbodyClass = () => {
    const baseClass = "divide-y";
    const themeClass = currentMode === "Dark"
      ? "bg-secondary-dark-bg divide-gray-600"
      : "bg-white divide-gray-200";
    return `${baseClass} ${themeClass}`;
  };

  const renderSubRows = (row, index) => {
    const subTransactions = row.subtransactions || row.sub_transactions;
    if (!subTransactions) {
      return null;
    }

    const isExpanded = expandedRows.has(row.id);
    const rowHeight = subTransactions.length * 60; // Approximate height per sub-row

    return (
      <tr>
        <td colSpan={columns.length + 1} className="p-0">
          <div 
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
            style={{
              maxHeight: isExpanded ? `${rowHeight}px` : '0px',
              transition: 'max-height 500ms ease-in-out, opacity 500ms ease-in-out'
            }}
          >
            <div className="py-2">
              {subTransactions.map((subRow) => (
                renderSubRow ? renderSubRow(subRow, index) : renderDefaultSubRow(subRow, index)
              ))}
            </div>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className={getTableClass()}>
        <thead className={getTheadClass()}>
          <tr>
            <th className={getThClass()}>
              <div className="w-8 h-8" />
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                className={getSortableThClass()}
                onClick={() => onSort(column.key)}
              >
                <div className="flex items-center">
                  {column.label}
                  {getSortIndicator && getSortIndicator(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={getTbodyClass()}>
          {data.map((row, index) => (
            <React.Fragment key={row.id}>
              <tr className={`${getRowBackgroundClass(index)}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {renderExpandButton(row)}
                </td>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${getTableCellClass(column.key)}`}
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
              {renderSubRows(row, index)}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpandableTable; 