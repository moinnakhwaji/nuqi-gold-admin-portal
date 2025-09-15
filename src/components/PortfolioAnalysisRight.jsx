import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import CepPortfolioAnalysis from './CepPortfolioAnalysis';

const getFormattedPrice = (price, quantity) => {
  if (!price || !quantity) return 'N/A';
  const calculatedPrice = Number(price) / Number(quantity);
  return Number.isNaN(calculatedPrice) ? 'N/A' : calculatedPrice.toFixed(2);
};

const getFormattedCurrentPrice = (stock) => {
  if (!stock?.currentPrice || !stock?.remainingQuantity) return 'N/A';
  const calculatedPrice = Number(stock.currentPrice) * Number(stock.remainingQuantity);
  return Number.isNaN(calculatedPrice) ? 'N/A' : calculatedPrice.toFixed(2);
};

const convertISOToDateTimeString = (isoDateString) => {
  const date = new Date(isoDateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

const PortfolioAnalysisRight = ({
  activeTab,
  selectedCurrency,
  analysisData
}) => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (symbol) => {
    setActiveAccordion(activeAccordion === symbol ? null : symbol);
  };

  if (!analysisData) return null;

  const selectedAnalysis = activeTab?.toUpperCase();
  const selectedAnalysisData = analysisData?.[selectedAnalysis] || {};
  const portfolio = selectedAnalysisData[selectedCurrency] || selectedAnalysisData.overall || {};
  const stocks = portfolio?.stocks || [];
  const isCep = activeTab?.toUpperCase() === 'CEP';

  return (
    <div className="w-full rounded-lg">
      <div className="flex items-center">
        <h3 className="text-white text-lg mb-5">{activeTab} Details</h3>
      </div>

      <div className="text-white mt-5">
        {isCep ? (
          <CepPortfolioAnalysis
            portfolio={portfolio}
            activeAccordion={activeAccordion}
            toggleAccordion={toggleAccordion}
            selectedCurrency={selectedCurrency}
          /> 
      ) : (
        <div className="overflow-x-auto">
          {/* Table Headers */}
          <div
            className="grid grid-cols-[24px,100px,1fr,80px,80px,140px,140px,140px] gap-2 items-center py-2 px-2 rounded-t-lg text-sm font-semibold min-w-full bg-transparent"
          >
            <div />
            <div className="text-center">Symbol</div>
            <div className="text-center">Name</div>
            <div className="text-center">Exchange</div>
            <div className="text-center">Shares</div>
            <div className="text-center">PnL</div>
            <div className="text-center">Invested Amt</div>
            <div className="text-center">Current Price</div>
          </div>

          {/* Table Rows */}
          <div className="p-2 rounded-md overflow-y-auto max-h-[500px]">
            {stocks.length > 0 ? (
              stocks.map((stock) => (
                <div key={stock.stockId} className="mb-2">
                  <div
                    className="grid grid-cols-[24px,100px,1fr,80px,80px,140px,140px,140px] gap-2 items-center py-2 px-3 text-sm cursor-pointer rounded-lg border border-gray-800/40 bg-black/20 hover:bg-white/5"
                    onClick={() => toggleAccordion(stock.stockId)}
                  >
                    <div className="text-zinc-400 flex justify-center">
                      {activeAccordion === stock.stockId ? <FaMinus /> : <FaPlus />}
                    </div>
                    <div className="text-cyan-400 underline text-center">
                      {stock.key?.split('~')?.[1] || 'N/A'}
                    </div>
                    <div className="text-center truncate px-2">{stock.stockName || 'N/A'}</div>
                    <div className="text-center">{stock.key?.split('~')?.[0] || 'N/A'}</div>
                    <div className="text-center">{stock.remainingQuantity || 'N/A'}</div>
                    <div
                      className={`text-center whitespace-nowrap ${
                        Number(stock?.pnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {stock.pnl !== undefined && stock.pnlPctChange !== undefined
                        ? `${Number(stock.pnl).toFixed(4)} (${Number(stock.pnlPctChange).toFixed(2)}%)`
                        : 'N/A'}
                    </div>
                    <div className="text-center">
                      {stock?.investedAmountOG && stock?.orders?.[0]?.traded_currency
                        ? `${stock.orders[0].traded_currency} ${Number(stock.investedAmountOG).toFixed(2)}`
                        : 'N/A'}
                    </div>
                    <div className="text-center">
                      {stock?.orders?.[0]?.traded_currency && getFormattedCurrentPrice(stock) !== 'N/A'
                        ? `${stock.orders[0].traded_currency} ${getFormattedCurrentPrice(stock)}`
                        : 'N/A'}
                    </div>
                  </div>

                  {/* Accordion Content */}
                  {activeAccordion === stock.stockId && (
                    <div className="overflow-x-auto px-4 py-3">
                      {stock.orders && stock.orders.length > 0 ? (
                        <table className="w-full text-left text-sm rounded-md text-center">
                          <thead>
                            <tr>
                              <th className="p-2 font-normal w-40">Date</th>
                              <th className="p-2 font-normal w-40">Trade Price</th>
                              <th className="p-2 font-normal w-40">Shares</th>
                              <th className="p-2 font-normal w-40">Total Value</th>
                              {selectedCurrency !== 'USD' && (
                                <th className="p-2 font-normal w-40">FX Rate</th>
                              )}
                              <th className="p-2 font-normal w-40">Current Price</th>
                              <th className="p-2 font-normal w-40">PnL</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stock.orders.map((order, index) => (
                              <tr key={index}>
                                <td className="p-2 w-40 whitespace-nowrap">
                                  {order.updated_at
                                    ? convertISOToDateTimeString(order.updated_at)
                                    : 'N/A'}
                                </td>
                                <td className="p-2 w-40">
                                  {order.price && order.quantity && order.traded_currency
                                    ? `${order.traded_currency} ${getFormattedPrice(order.price, order.quantity)}`
                                    : 'N/A'}
                                </td>
                                <td className="p-2 w-40">{order.remaining_qty || 'N/A'}</td>
                                <td className="p-2 w-40">
                                  {order.price && order.traded_currency
                                    ? `${order.traded_currency} ${Number(order.price).toFixed(2)}`
                                    : 'N/A'}
                                </td>
                                {selectedCurrency !== 'USD' && (
                                  <td className="p-2 w-40">
                                    {order.fx ? Number(order.fx).toFixed(2) : 'N/A'}
                                  </td>
                                )}
                                <td className="p-2 w-40">
                                  {stock?.currentPrice ? Number(stock.currentPrice).toFixed(2) : 'N/A'}
                                </td>
                                <td
                                  className={`p-2 w-40 whitespace-nowrap ${
                                    Number(stock?.pnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                                  }`}
                                >
                                  {stock.pnl !== undefined && stock.pnlPctChange !== undefined
                                    ? `${Number(stock.pnl).toFixed(4)} (${Number(stock.pnlPctChange).toFixed(2)}%)`
                                    : 'N/A'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-gray-400 text-sm">No transactions available.</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center mt-4">No data available.</p>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioAnalysisRight;