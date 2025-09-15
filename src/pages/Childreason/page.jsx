import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAddChildReasonMutation } from "../../redux/slices/childreason/addChildReasonApi";
import { useSelector } from "react-redux";

// Preview component remains the same
const PreviewContent = ({ html }) => {
  return (
    <div
      className="bg-white rounded-[8px] border border-gray-300 p-4 text-gray-800 min-h-[300px]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const ChildReasons = () => {
  const [formData, setFormData] = useState({
    templateHTML: "",
    subject: "",
    reason: "",
  });
  
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");

  // ✅ Get the full user object from the Redux store
  const user = useSelector((state) => state.auth.user);
  // ✅ Extract the user ID for use in the API call
  const userId = user?.id;

  const userRole = user?.role; 
  // RTK Query mutation hook
  const [addChildReason, { isLoading }] = useAddChildReasonMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ MODIFIED: The handleSubmit function is updated
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ ADDED: First, check if the userId is available.
    if (!userId) {
      toast.error("User not found. Please log in again.");
      return;
    }

    // Validate required fields
    const requiredFields = {
      templateHTML: "Template HTML",
      subject: "Subject",
      reason: "Reason",
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !formData[key]?.trim())
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      return;
    }

    try {
      // ✅ MODIFIED: Create a single payload object that includes the userId,
      // matching the structure from your AddReasons component.
      const payload = {
        userId: userId, // The userId is now included
        templateHTML: formData.templateHTML.trim(),
        subject: formData.subject.trim(),
        reason: formData.reason.trim(),
      };

      // ✅ MODIFIED: Trigger the mutation with the new payload object
      const response = await addChildReason(payload).unwrap();

      toast.success(
        response.message || "Child template and reason added successfully"
      );
      setFormData({
        templateHTML: "",
        subject: "",
        reason: "",
      });
    } catch (err) {
      console.error("Failed to add child template:", err);
      // Handle errors from the mutation
      const errorMessage =
        err.data?.error ||
        err.data?.message ||
        "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  // This prevents hydration errors with server-side rendering
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="p-6 max-w-4xl mx-auto pb-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Child Template & Reason
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-gray-700 font-medium">
              Template Subject:
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white rounded-[8px] text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter template subject"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700 font-medium">
              Template HTML:
            </label>
            <div className="w-full font-normal">
              <div className="mb-2 bg-gray-200 border border-gray-300 rounded-lg p-1 flex space-x-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm transition-colors ${
                    activeTab === "edit"
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-600 hover:bg-white/60"
                  }`}
                >
                  Edit HTML
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm transition-colors ${
                    activeTab === "preview"
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-600 hover:bg-white/60"
                  }`}
                >
                  Preview
                </button>
              </div>
              <div>
                {activeTab === "edit" && (
                  <textarea
                    name="templateHTML"
                    value={formData.templateHTML}
                    onChange={handleChange}
                    className="w-full min-h-[200px] px-4 py-3 bg-white rounded-[8px] text-gray-800 font-mono text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your HTML content here..."
                    required
                  />
                )}
                {activeTab === "preview" && (
                  <PreviewContent html={formData.templateHTML} />
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700 font-medium">
              Reason:
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full min-h-[100px] px-4 py-3 bg-white rounded-[8px] text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the reason"
              required
            />
          </div>

        {(userRole === "admin" || userRole === "superadmin") && (
  <div className="flex justify-end mt-4 pb-4">
    <button
      type="submit"
      disabled={isLoading}
      className="px-6 py-2 rounded-[8px] font-['Poppins'] font-medium text-white transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-600"
    >
      {isLoading ? "Adding..." : "Add Template & Reason"}
    </button>
  </div>
)}

        </form>
      </div>
    </div>
  );
};

export default ChildReasons;