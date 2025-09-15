import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const CepPortfolioAnalysis = ({
  portfolio,
  activeAccordion,
  toggleAccordion,
  selectedCurrency,
}) => {
  const baskets = portfolio?.baskets || [];

  const formatDateTime = (iso) => {
    if (!iso) return 'N/A';
    const date = new Date(iso);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <div className="text-white mt-5">
      <div className="overflow-x-auto">
        {/* Headers */}
        <div className="grid grid-cols-[24px,2fr,1fr,1.5fr,1.5fr,1.5fr] gap-2 items-center py-2 px-3 rounded-t-lg text-sm font-semibold min-w-full">
          <div />
          <div className="text-center">CEP Name</div>
          <div className="text-center">Qty</div>
          <div className="text-center">PnL</div>
          <div className="text-center">Invested Amount</div>
          <div className="text-center">Current Amount</div>
        </div>

        {baskets.length > 0 ? (
          baskets.map((basket) => (
            <div key={basket.basketId} className="mb-2">
              {/* Row */}
              <div
                className="grid grid-cols-[24px,2fr,1fr,1.5fr,1.5fr,1.5fr] gap-2 items-center py-2 px-3 text-sm cursor-pointer rounded-lg border border-gray-800/40 bg-black/20 hover:bg-white/5"
                onClick={() => toggleAccordion(basket.basketId)}
              >
                <div className="text-zinc-400 flex justify-center">
                  {activeAccordion === basket.basketId ? <FaMinus /> : <FaPlus />}
                </div>
                <div className="text-cyan-400 underline text-center truncate px-2">
                  {basket.basketName || 'N/A'}
                </div>
                <div className="text-center">{basket.remainingQuantity || 1}</div>
                <div className={`text-center whitespace-nowrap ${Number(basket?.pnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {basket.pnl !== undefined
                    ? `${Number(basket?.pnl).toFixed(4)} (${Number(basket?.pnlPctChange).toFixed(2)}%)`
                    : 'N/A'}
                </div>
                <div className="text-center whitespace-nowrap">
                  {(() => {
                    if (!basket?.investedAmount) return 'N/A';
                    const amount = Number(basket.investedAmount).toFixed(2);
                    const currency = basket?.stocks?.[0]?.orders?.[0]?.traded_currency;
                    return currency ? `${currency} ${amount}` : amount;
                  })()}
                </div>
                <div className="text-center whitespace-nowrap">
                  {(() => {
                    if (!basket?.currentValue) return 'N/A';
                    const amount = Number(basket.currentValue).toFixed(2);
                    const currency = basket?.stocks?.[0]?.orders?.[0]?.traded_currency;
                    return currency ? `${currency} ${amount}` : amount;
                  })()}
                </div>
              </div>

              {/* Accordion */}
              {activeAccordion === basket.basketId && (
                <div className="overflow-x-auto px-4 py-3">
                  {basket.stocks && basket.stocks.length > 0 ? (
                    <table className="w-full text-sm rounded-md text-center min-w-full">
                      <thead>
                        <tr className="text-xs font-semibold">
                          <th className="p-2 w-40">Date</th>
                          <th className="p-2">Stock Name</th>
                          <th className="p-2 w-40">Trade Price</th>
                          <th className="p-2 w-40">Shares</th>
                          {selectedCurrency !== 'USD' && selectedCurrency !== 'overall' && (
                            <th className="p-2 w-40">Total Value {selectedCurrency}</th>
                          )}
                          <th className="p-2 w-40">Total Value (USD)</th>
                          {selectedCurrency !== 'USD' && selectedCurrency !== 'overall' && (
                            <th className="p-2 w-40">FX Rate</th>
                          )}
                          <th className="p-2 w-40">PnL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {basket.stocks.map((order, idx) => (
                          <tr key={idx} className="text-xs">
                            <td className="p-2 w-40">{formatDateTime(order.orders?.[0]?.updated_at)}</td>
                            <td className="p-2 truncate px-2">{order?.stockName || 'N/A'}</td>
                            <td className="p-2 w-40">
                              {order.orders?.[0]?.price
                                ? `${order.orders[0].traded_currency} ${Number(order.orders[0].price).toFixed(2)}`
                                : 'N/A'}
                            </td>
                            <td className="p-2 w-40">{order?.remainingQuantity || 'N/A'}</td>
                            {selectedCurrency !== 'USD' && selectedCurrency !== 'overall' && (
                              <td className="p-2 w-40">
                                {order.orders?.[0]?.price ? Number(order.orders[0].price).toFixed(2) : 'N/A'}
                              </td>
                            )}
                            <td className="p-2 w-40">
                              {order.orders?.[0]?.price_net_settle
                                ? `USD ${Number(order.orders[0].price_net_settle).toFixed(2)}`
                                : 'N/A'}
                            </td>
                            {selectedCurrency !== 'USD' && selectedCurrency !== 'overall' && (
                              <td className="p-2 w-40">{order.orders?.[0]?.fx ? Number(order.orders[0].fx).toFixed(2) : 'N/A'}</td>
                            )}
                            <td className={`p-2 w-40 ${Number(order?.pnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {order.pnl !== undefined
                                ? `${Number(order.pnl).toFixed(4)} (${Number(order.pnlPctChange).toFixed(2)}%)`
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
  );
};

export default CepPortfolioAnalysis;


