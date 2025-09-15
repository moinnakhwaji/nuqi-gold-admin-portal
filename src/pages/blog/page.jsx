import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCreateBlogMutation } from "../../redux/slices/blog/blogApi";

const BlogEditor = () => {
  const [activeTab, setActiveTab] = useState("edit");
  const [blogData, setBlogData] = useState({
    title: "",
    content: { para1: "", para2: "" },
    author: "",
    image: null,
  });

  const [createBlog, { isLoading, isSuccess, isError, error }] =
    useCreateBlogMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Blog Uploaded Successfully. Your blog has been uploaded.");
      // Reset form on success
      setBlogData({
        title: "",
        content: { para1: "", para2: "" },
        author: "",
        image: null,
      });
    }
    if (isError) {
      toast.error(
        error?.data?.message || error?.message || "Failed to upload blog."
      );
    }
  }, [isSuccess, isError, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "para1" || name === "para2") {
      setBlogData((prev) => ({
        ...prev,
        content: {
          ...prev.content,
          [name]: value,
        },
      }));
    } else {
      setBlogData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlogData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !blogData.title ||
      !blogData.content.para1 ||
      !blogData.content.para2 ||
      !blogData.author ||
      !blogData.image
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("content", JSON.stringify(blogData.content));
    formData.append("author", blogData.author);
    if (blogData.image) {
      formData.append("image", blogData.image);
    }

    try {
      // Trigger the mutation with the form data
      await createBlog(formData).unwrap();
    } catch (err) {
      // Error is handled by the useEffect hook, but you can add specific logic here if needed
      console.error("Failed to create blog:", err);
    }
  };

  const renderPreview = () => {
    return (
      <div className="min-h-[300px] w-full rounded-md border border-gray-300 bg-white p-4 font-mono text-sm text-gray-800">
        <pre>
          {JSON.stringify(
            {
              ...blogData,
              image: blogData.image ? blogData.image.name : null,
            },
            null,
            2
          )}
        </pre>
      </div>
    );
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl bg-gray-100 p-4">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <h2 className="font-['Poppins'] text-2xl font-semibold text-gray-900">
            Compose Blog
          </h2>
        </div>
        <div className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4 font-['Poppins']">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Title:
              </label>
              <input
                type="text"
                name="title"
                value={blogData.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Content (Paragraph 1):
              </label>
              <textarea
                name="para1"
                value={blogData.content.para1}
                onChange={handleChange}
                className="min-h-[100px] w-full resize-y rounded-lg border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the first paragraph of your blog..."
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Content (Paragraph 2):
              </label>
              <textarea
                name="para2"
                value={blogData.content.para2}
                onChange={handleChange}
                className="min-h-[100px] w-full resize-y rounded-lg border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the second paragraph of your blog..."
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Author:
              </label>
              <input
                type="text"
                name="author"
                value={blogData.author}
                onChange={handleChange}
                placeholder="Author name"
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Image:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-gray-900 file:mr-4 file:cursor-pointer file:border-0 file:bg-gray-100 file:px-4 file:py-2 hover:file:bg-gray-200"
              />
              {blogData.image && (
                <p className="mt-1 text-sm text-green-600">
                  Selected image: {blogData.image.name}
                </p>
              )}
            </div>

            <div>
              <div className="w-full">
                <div className="mb-2 flex space-x-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("edit")}
                    className={`w-full rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                      activeTab === "edit"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:bg-white/50"
                    }`}
                  >
                    Edit JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`w-full rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                      activeTab === "preview"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:bg-white/50"
                    }`}
                  >
                    Preview JSON
                  </button>
                </div>
                <div>
                  {activeTab === "edit" && (
                    <textarea
                      name="message"
                      value={JSON.stringify(
                        {
                          ...blogData,
                          image: blogData.image ? blogData.image.name : null,
                        },
                        null,
                        2
                      )}
                      className="min-h-[300px] w-full resize-y rounded-lg border border-gray-300 bg-gray-50 p-2 font-mono text-sm text-gray-800"
                      disabled
                    />
                  )}
                  {activeTab === "preview" && renderPreview()}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() =>
                  setBlogData({
                    title: "",
                    content: { para1: "", para2: "" },
                    author: "",
                    image: null,
                  })
                }
                disabled={isLoading}
                className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                  isLoading
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Submitting..." : "Submit Blog"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BlogEditor;