import React, { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSendEmailMutation } from "../../redux/slices/emailer/emailApi";
import { useSelector } from "react-redux";

const Emailer = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [sendEmail] = useSendEmailMutation();
   const user = useSelector((state) => state.auth.user); // ✅ Get the full user object
  const userRole = user?.role; 
  const [emailData, setEmailData] = useState({
    email: "",
    subject: "",
    message: "<h1>Hello!</h1>\n<p>Write your email content here...</p>",
    cc: "",
    bcc: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const emailer = async () => {
    try {
      setLoading(true);
      console.log("Sending email data:", emailData);
      
      // Use RTK Query mutation
      const result = await sendEmail(emailData).unwrap();
      
      console.log("Email Response:", result);

      toast.success("Email Sent Successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      return result;
    } catch (error) {
      console.error("Email Error:", {
        message: error.message || error.data?.message,
        error: error,
      });

      toast.error(
        error.data?.message || error.message || "Failed to send email",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!emailData.email || !emailData.subject || !emailData.message) {
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      const result = await emailer(emailData);
      console.log("Email sent successfully:", result);

      // Clear form on success
      setEmailData({
        email: "",
        subject: "",
        message: "<h1>Hello!</h1>\n<p>Write your email content here...</p>",
        cc: "",
        bcc: "",
      });
    } catch (error) {
      console.log("Failed to send email");
    }
  };

  const renderPreview = () => {
    return (
      <div
        className="w-full min-h-[300px] p-4 border border-gray-200 rounded-md bg-white text-black"
        dangerouslySetInnerHTML={{ __html: emailData.message }}
      />
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="w-full max-w-4xl mx-auto">
          {/* Card */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-lg">
            {/* Card Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-2xl text-gray-800 font-['Poppins'] font-semibold">
                Compose HTML Email
              </h2>
            </div>
            
            {/* Card Content */}
            <div className="p-6">
              <div
                className="space-y-6 font-['Poppins'] font-normal"
              >
                <div>
                  <label className="block text-sm mb-2 text-gray-700 font-medium">
                    To:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={emailData.email}
                    onChange={handleChange}
                    placeholder="recipient@example.com"
                    className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border border-gray-300 transition-all font-normal"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700 font-medium">
                    CC: (Optional)
                  </label>
                  <input
                    type="email"
                    name="cc"
                    value={emailData.cc}
                    onChange={handleChange}
                    placeholder="recipient@example.com"
                    className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border border-gray-300 transition-all font-normal"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700 font-medium">
                    BCC: (Optional)
                  </label>
                  <input
                    type="email"
                    name="bcc"
                    value={emailData.bcc}
                    onChange={handleChange}
                    placeholder="recipient@example.com"
                    className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border border-gray-300 transition-all font-normal"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700 font-medium">
                    Subject:
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={emailData.subject}
                    onChange={handleChange}
                    placeholder="Enter subject"
                    className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border border-gray-300 transition-all font-normal"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700 font-medium">
                    Message:
                  </label>
                  
                  {/* Custom Tabs */}
                  <div className="w-full font-normal">
                    {/* Tab List */}
                    <div className="mb-4 bg-gray-100 border border-gray-200 rounded-lg p-1 inline-flex">
                      <button
                        type="button"
                        onClick={() => setActiveTab("edit")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          activeTab === "edit"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                      >
                        Edit HTML
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("preview")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          activeTab === "preview"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                      >
                        Preview
                      </button>
                    </div>
                    
                    {/* Tab Content */}
                    {activeTab === "edit" && (
                      <textarea
                        name="message"
                        value={emailData.message}
                        onChange={handleChange}
                        className="w-full min-h-[300px] px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-mono text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        placeholder="Enter your HTML content here..."
                        required
                      />
                    )}
                    
                    {activeTab === "preview" && (
                      <div className="bg-gray-50 rounded-lg border border-gray-300">
                        {renderPreview()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-gray-500 font-normal">
                    Use HTML tags to format your email content
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() =>
                        setEmailData({
                          email: "",
                          subject: "",
                          message:
                            "<h1>Hello!</h1>\n<p>Write your email content here...</p>",
                          cc: "",
                          bcc: "",
                        })
                      }
                      disabled={loading}
                      className="px-6 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg border border-red-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Discard
                    </button>

                   {(userRole === "admin" || userRole === "superadmin") && (
  <button
    type="button"
    onClick={handleSubmit}
    disabled={loading}
    className={`px-6 py-2 rounded-lg text-white font-medium transition-all ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
    }`}
  >
    {loading ? "Sending..." : "Send Email"}
  </button>
)}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
      />
    </>
  );
};

export default Emailer;