import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAddReasonMutation } from "../../redux/slices/addreason/addreasonApi"; // Make sure this path is correct
import { useSelector } from "react-redux";

// This component renders the HTML preview and remains unchanged.
const PreviewContent = ({ html }) => (
  <div
    className="min-h-[300px] rounded-lg border border-gray-300 bg-white p-4 text-gray-800"
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

const AddReasons = () => {
  const [formData, setFormData] = useState({
    subject: "",
    template_html: "",
    reason: "",
  });

  // ✅ Get the full user object from the Redux store
  const user = useSelector((state) => state.auth.user);
  // ✅ Extract the user ID for use in the API call
  const userId = user?.id;
  const userRole = user?.role;

  // State to manage the active tab for the HTML editor/previewer
  const [activeTab, setActiveTab] = useState("edit");

  // RTK Query hook: provides a trigger function (`addReason`) and the request status (`isLoading`)
  const [addReason, { isLoading }] = useAddReasonMutation();

  // State to prevent server-side rendering issues with client-side logic
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handles changes for all form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ CORRECTED: Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // First, check if the userId is available.
    if (!userId) {
      toast.error("User not found. Please log in again.");
      return;
    }

    // Field validation
    const requiredFields = {
      reason: "Reason",
      template_html: "Template HTML",
      subject: "Subject",
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !formData[key]?.trim())
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      toast.error(`Please fill in the following required fields: ${missingFields.join(", ")}`);
      return;
    }

    // ✅ Create a single, flat payload object that matches the structure
    // expected by your `addReasonApi` slice.
    const payload = {
      userId: userId,
      reason: formData.reason.trim(),
      template_html: formData.template_html.trim(),
      subject: formData.subject.trim(),
    };

    try {
      // ✅ Pass the single payload object to the RTK Query mutation.
      // .unwrap() will return the successful response or throw an error.
      const response = await addReason(payload).unwrap();

      toast.success(response.message || "Reason added successfully");
      setFormData({ subject: "", template_html: "", reason: "" }); // Reset form on success

    } catch (error) {
      // Handle errors caught by .unwrap()
      console.error("Error adding reason:", error);
      const message = error.data?.message || error.data?.error || "Failed to add reason. Please try again later.";
      toast.error(message);
    }
  };

  // Prevents rendering on the server
  if (!mounted) return null;

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-50">
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
      <div className="mx-auto max-w-4xl p-6 pb-20">
        <h2 className="mb-6 text-3xl font-bold text-gray-800">Add New Reason</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Template Subject:
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter template subject"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Template HTML:
            </label>
            
            <div className="w-full">
              <div className="mb-2 inline-flex rounded-lg border border-gray-300 bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={`rounded-md px-4 py-1 text-sm font-medium transition-colors ${
                    activeTab === "edit" ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Edit HTML
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`rounded-md px-4 py-1 text-sm font-medium transition-colors ${
                    activeTab === "preview" ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Preview
                </button>
              </div>

              {activeTab === "edit" && (
                <textarea
                  name="template_html"
                  value={formData.template_html}
                  onChange={handleChange}
                  className="w-full min-h-[200px] rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your HTML content here..."
                  required
                />
              )}

              {activeTab === "preview" && (
                <PreviewContent html={formData.template_html} />
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Reason:
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter the reason"
              required
            />
          </div>

          <div className="mt-6 flex justify-end pb-4">
        {(userRole === "admin" || userRole === "superadmin") && (

            <button
              type="submit"
              disabled={isLoading} // Use isLoading from the hook
              className={`rounded-lg px-6 py-2 font-semibold text-white transition-colors ${
                isLoading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Adding..." : "Add Reason"} {/* Show loading text */}
            </button>
          )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReasons;