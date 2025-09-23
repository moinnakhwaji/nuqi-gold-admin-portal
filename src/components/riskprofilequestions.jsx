import React from "react";
import { useStateContext } from "../contexts/ContextProvider";

const RiskProfileQuestions = ({ isOpen, onClose, answers }) => {
  const { currentMode } = useStateContext();

  if (!isOpen) return null;

  // answers is an array of { questionId, question, answer }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-70 backdrop-blur-md">
      <div
        className={`rounded-2xl p-8 max-w-4xl w-full mx-4 shadow-2xl ${
          currentMode === "Dark"
            ? "bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-700/50"
            : "bg-white border border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <h2
              className={`text-2xl font-bold ${
                currentMode === "Dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Risk Profile Questions & Answers
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
              currentMode === "Dark"
                ? "text-gray-400 hover:text-white hover:bg-gray-800"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
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
          </button>
        </div>
        <div className="overflow-y-auto max-h-[60vh]">
          <table className="min-w-full">
            <thead>
              <tr>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                    currentMode === "Dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Question
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                    currentMode === "Dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Answer
                </th>
              </tr>
            </thead>
            <tbody>
              {answers &&
                answers.map((ans, idx) => (
                  <tr
                    key={ans.questionId || idx}
                    className={
                      currentMode === "Dark"
                        ? "hover:bg-gray-800/50"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td
                      className={`px-4 py-3 text-sm ${
                        currentMode === "Dark"
                          ? "text-gray-300"
                          : "text-gray-700"
                      }`}
                    >
                      {ans.question}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm font-semibold ${
                        currentMode === "Dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {typeof ans.answer === "object"
                        ? Object.entries(ans.answer)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(", ")
                        : ans.answer}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiskProfileQuestions;
