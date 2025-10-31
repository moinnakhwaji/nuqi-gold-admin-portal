import { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";
import {
  PopupsManager,
  CreatePopupModal,
  BottomSheetPreview,
} from "../../components/popups";
import {
  Header,
  SplashScreensList,
  SplashScreenEditor,
  SplashScreenPreview,
  CreateSplashModal,
  FullScreenPreview,
} from "../../components/splashscreen";

function renderMediaContent(editorSettings) {
  if (editorSettings.videoPath) {
    if (editorSettings.screen_type === "mp4") {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <video
            src={editorSettings.videoPath}
            autoPlay
            loop
            muted
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    } else if (editorSettings.screen_type === "lottie") {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <p className="text-sm">Lottie Animation Preview</p>
            <p className="text-xs mt-2">{editorSettings.name}</p>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-white/20">
      <div className="text-gray-400 text-center">
        <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p className="text-sm">No media uploaded</p>
      </div>
    </div>
  );
}


export default function Splashscreen() {
  const imageInputRef = useRef(null);
  const popupImageInputRef = useRef(null);

  const [splashScreens, setSplashScreens] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSplashId, setSelectedSplashId] = useState(999);
  const [editorSettings, setEditorSettings] = useState({
    id: null,
    name: "",
    screen_type: "mp4", // SCREEN_TYPE enum: mp4 or lottie
    videoPath: "",
    role: "USER", // REFRERAL_TYPE enum: USER or CORPORATE
    mimetype: "",
    status: true,
    referralcode: "",
  });
  const [uploadedFile, setUploadedFile] = useState(null); // Store actual file for upload

  // Fetch splash screens and popups from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch splash screens
        const splashResponse = await axios.get(
          API_ENDPOINTS.SPLASH_SCREENS.GET_ALL
        );

        // Transform API data to match component structure
        const transformedData = splashResponse.data.data.map((screen) => ({
          id: screen.id,
          name: screen.name || `Splash ${screen.id}`,
          screen_type: screen.screen_type, // mp4 or lottie
          videoPath: screen.videoPath || "",
          role: screen.role, // USER or CORPORATE
          mimetype: screen.mimetype || "",
          status: screen.status,
          referralcode: screen.referralcode || "",
        }));

        setSplashScreens(transformedData);

        // Set first screen as selected if available
        if (transformedData.length > 0) {
          setSelectedSplashId(transformedData[0].id);
          setEditorSettings({
            id: transformedData[0].id,
            name: transformedData[0].name,
            screen_type: transformedData[0].screen_type,
            videoPath: transformedData[0].videoPath,
            role: transformedData[0].role,
            mimetype: transformedData[0].mimetype,
            status: transformedData[0].status,
            referralcode: transformedData[0].referralcode || "",
          });
        }

        // Fetch popups
        const popupsResponse = await axios.get(
          API_ENDPOINTS.POPUPS.GET_ALL
        );

        if (popupsResponse.data.success) {
          setPopups(popupsResponse.data.popups);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ==================== POPUP STATE ====================
  const [popups, setPopups] = useState([]);

  // ==================== MODAL STATE ====================
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [isPopupEditMode, setIsPopupEditMode] = useState(false);
  const [editingPopupId, setEditingPopupId] = useState(null);

  // ==================== CREATE MODAL STATE ====================
  const [createFormData, setCreateFormData] = useState({
    name: "",
    screen_type: "mp4",
    role: "USER",
    referralcode: "",
  });
  const [createUploadedFile, setCreateUploadedFile] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showBottomSheetPreview, setShowBottomSheetPreview] = useState(false);
  const [selectedPopupForPreview, setSelectedPopupForPreview] = useState(null);

  // ==================== POPUP FORM STATE ====================
  const [popupName, setPopupName] = useState("");
  const [popupType, setPopupType] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [popupContent, setPopupContent] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [allowDismiss, setAllowDismiss] = useState(true);
  const [popupColor, setPopupColor] = useState("#10b981");
  const [popupImage, setPopupImage] = useState(null);
  const [popupImageSize, setPopupImageSize] = useState("medium");

  const updateEditorSetting = (key, value) => {
    setEditorSettings((prev) => ({ ...prev, [key]: value }));
    setSplashScreens((prev) =>
      prev.map((splash) =>
        splash.id === selectedSplashId ? { ...splash, [key]: value } : splash
      )
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const mimetype = file.type;

      // Store the actual file for uploading
      setUploadedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target.result;
        setEditorSettings((prev) => ({
          ...prev,
          videoPath: fileData,
          mimetype: mimetype,
        }));
        setSplashScreens((prev) =>
          prev.map((splash) =>
            splash.id === selectedSplashId
              ? { ...splash, videoPath: fileData, mimetype: mimetype }
              : splash
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSplash = async (splash) => {
    try {
      setSelectedSplashId(splash.id);

      // Fetch the complete splash screen data by ID from API
      const response = await axios.get(
        API_ENDPOINTS.SPLASH_SCREENS.GET_BY_ID(splash.id)
      );

      const screen = response.data.splashScreen;

      // Update editor settings with fetched data
      setEditorSettings({
        id: screen.id,
        name: screen.name,
        screen_type: screen.screen_type,
        videoPath: screen.videoPath || "",
        role: screen.role,
        mimetype: screen.mimetype || "",
        status: screen.status,
        referralcode: screen.referralcode || "",
      });

      setUploadedFile(null); // Reset uploaded file when switching splash screens
    } catch (error) {
      console.error("Error fetching splash screen:", error);
      toast.error("Failed to load splash screen details");

      // Fallback to using the data from the list
      setEditorSettings({
        id: splash.id,
        name: splash.name,
        screen_type: splash.screen_type,
        videoPath: splash.videoPath,
        role: splash.role,
        mimetype: splash.mimetype,
        status: splash.status,
        referralcode: splash.referralcode || "",
      });
      setUploadedFile(null);
    }
  };

  const handleCreateFormChange = (field, value) => {
    setCreateFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      // Validate file type based on screen_type
      if (createFormData.screen_type === "lottie") {
        if (!file.type.includes("json")) {
          toast.error("Please upload a JSON file for Lottie animations");
          return;
        }
      } else if (createFormData.screen_type === "mp4") {
        if (!file.type.includes("video") && !file.type.includes("mp4")) {
          toast.error("Please upload an MP4 video file");
          return;
        }
      }

      setCreateUploadedFile(file);
      toast.success(`File "${file.name}" selected`);
    }
  };

  const handleCreateSplash = async () => {
    try {
      // Validate required fields
      if (!createFormData.name.trim()) {
        toast.error("Please enter a splash screen name");
        return;
      }

      if (!createUploadedFile) {
        toast.error("Please upload a file!");
        return;
      }

      // Validate referral code for CORPORATE role
      if (createFormData.role === "CORPORATE" && !createFormData.referralcode?.trim()) {
        toast.error("Referral code is required for corporate splash screens");
        return;
      }

      setIsCreating(true);

      // Log the data being sent
      console.log("Creating splash screen with:", {
        name: createFormData.name,
        role: createFormData.role,
        screen_type: createFormData.screen_type,
        file: createUploadedFile.name,
        fileType: createUploadedFile.type,
      });

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", createUploadedFile);
      formData.append("name", createFormData.name);
      formData.append("role", createFormData.role);

      // Add referral code if CORPORATE role
      if (createFormData.role === "CORPORATE" && createFormData.referralcode) {
        formData.append("referralcode", createFormData.referralcode);
      }

      // Log FormData contents
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      // Make POST request to backend
      const response = await axios.post(
        API_ENDPOINTS.SPLASH_SCREENS.CREATE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Splash screen created successfully!");
      console.log("Response:", response.data);

      // Refresh the splash screens list
      const fetchResponse = await axios.get(
        API_ENDPOINTS.SPLASH_SCREENS.GET_ALL
      );
      const transformedData = fetchResponse.data.data.map((screen) => ({
        id: screen.id,
        name: screen.name || `Splash ${screen.id}`,
        screen_type: screen.screen_type,
        videoPath: screen.videoPath || "",
        role: screen.role,
        mimetype: screen.mimetype || "",
        status: screen.status,
        referralcode: screen.referralcode || "",
      }));
      setSplashScreens(transformedData);

      // Reset modal form
      setCreateFormData({
        name: "",
        screen_type: "mp4",
        role: "USER",
        referralcode: "",
      });
      setCreateUploadedFile(null);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating splash screen:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to create splash screen"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSplash = async (id) => {
    try {
      if (splashScreens.length === 1) {
        toast.error("Cannot delete the last splash screen");
        return;
      }

      // Confirm deletion
      if (!window.confirm("Are you sure you want to delete this splash screen?")) {
        return;
      }

      // Delete from API
      const response = await axios.delete(
        API_ENDPOINTS.SPLASH_SCREENS.DELETE(id)
      );

      if (response.data.success || response.status === 200) {
        toast.success("Splash screen deleted successfully!");

        // If deleted screen was selected, switch to another screen
        if (selectedSplashId === id) {
          const remaining = splashScreens.filter((splash) => splash.id !== id);
          if (remaining.length > 0) {
            handleSelectSplash(remaining[0]);
          }
        }

        // Refresh splash screens list
        const fetchResponse = await axios.get(
          API_ENDPOINTS.SPLASH_SCREENS.GET_ALL
        );
        const transformedData = fetchResponse.data.data.map((screen) => ({
          id: screen.id,
          name: screen.name || `Splash ${screen.id}`,
          screen_type: screen.screen_type,
          videoPath: screen.videoPath || "",
          role: screen.role,
          mimetype: screen.mimetype || "",
          status: screen.status,
          referralcode: screen.referralcode || "",
        }));
        setSplashScreens(transformedData);
      }
    } catch (error) {
      console.error("Error deleting splash screen:", error);
      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to delete splash screen"
      );
    }
  };

  const handleToggleActive = (id) => {
    setSplashScreens((prev) =>
      prev.map((splash) =>
        splash.id === id ? { ...splash, status: !splash.status } : splash
      )
    );
  };

  const handleSaveChanges = async () => {
    try {
      // Validate required fields
      if (!editorSettings.name) {
        toast.error("Name is required!");
        return;
      }

      if (!editorSettings.id) {
        toast.error("No splash screen selected!");
        return;
      }

      // Validate referral code for CORPORATE role
      if (editorSettings.role === "CORPORATE" && !editorSettings.referralcode?.trim()) {
        toast.error("Referral code is required for corporate splash screens");
        return;
      }

      setIsSaving(true);

      // UPDATE existing splash screen
      const formData = new FormData();
      if (uploadedFile) {
        formData.append("file", uploadedFile);
      }
      formData.append("name", editorSettings.name);
      formData.append("role", editorSettings.role);
      formData.append("status", editorSettings.status);
      formData.append("screen_type", editorSettings.screen_type);

      // Add referral code if CORPORATE role
      if (editorSettings.role === "CORPORATE" && editorSettings.referralcode) {
        formData.append("referralcode", editorSettings.referralcode);
      }

      const response = await axios.put(
        API_ENDPOINTS.SPLASH_SCREENS.UPDATE(editorSettings.id),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Splash screen updated successfully!");
      console.log("Response:", response.data);

      // Refresh the splash screens list
      const fetchResponse = await axios.get(
        API_ENDPOINTS.SPLASH_SCREENS.GET_ALL
      );
      const transformedData = fetchResponse.data.data.map((screen) => ({
        id: screen.id,
        name: screen.name || `Splash ${screen.id}`,
        screen_type: screen.screen_type,
        videoPath: screen.videoPath || "",
        role: screen.role,
        mimetype: screen.mimetype || "",
        status: screen.status,
        referralcode: screen.referralcode || "",
      }));
      setSplashScreens(transformedData);

      // Reset uploaded file
      setUploadedFile(null);
    } catch (error) {
      console.error("Error updating splash screen:", error);
      toast.error(
        error.response?.data?.error || "Failed to update splash screen"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreatePopup = async () => {
    try {
      // Validate required fields
      if (!popupName || !popupTitle || !popupContent || !ctaText) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (isPopupEditMode && editingPopupId) {
        // UPDATE existing popup
        const updateData = {
          name: popupName,
          type: popupType || "Custom Popup",
          title: popupTitle,
          content: popupContent,
          ctaText,
          ctaLink: ctaLink || "#",
          allowDismiss,
          color: popupColor,
          image: popupImage,
          imageSize: popupImageSize,
        };

        const response = await axios.put(
          API_ENDPOINTS.POPUPS.UPDATE(editingPopupId),
          updateData
        );

        if (response.data.success) {
          toast.success("Popup updated successfully!");

          // Refresh popups list
          const popupsResponse = await axios.get(
            API_ENDPOINTS.POPUPS.GET_ALL
          );
          if (popupsResponse.data.success) {
            setPopups(popupsResponse.data.popups);
          }
        }
      } else {
        // CREATE new popup
        const newPopupData = {
          name: popupName,
          type: popupType || "Custom Popup",
          title: popupTitle,
          content: popupContent,
          ctaText,
          ctaLink: ctaLink || "#",
          allowDismiss,
          isActive: false,
          color: popupColor,
          image: popupImage,
          imageSize: popupImageSize,
        };

        const response = await axios.post(
          API_ENDPOINTS.POPUPS.CREATE,
          newPopupData
        );

        if (response.data.success) {
          toast.success("Popup created successfully!");

          // Refresh popups list
          const popupsResponse = await axios.get(
            API_ENDPOINTS.POPUPS.GET_ALL
          );
          if (popupsResponse.data.success) {
            setPopups(popupsResponse.data.popups);
          }
        }
      }

      resetPopupForm();
      setShowPopupModal(false);
      setIsPopupEditMode(false);
      setEditingPopupId(null);
    } catch (error) {
      console.error("Error saving popup:", error);
      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        `Failed to ${isPopupEditMode ? "update" : "create"} popup`
      );
    }
  };

  const resetPopupForm = () => {
    setPopupName("");
    setPopupType("");
    setPopupTitle("");
    setPopupContent("");
    setCtaText("");
    setCtaLink("");
    setAllowDismiss(true);
    setPopupColor("#10b981");
    setPopupImage(null);
    setPopupImageSize("medium");
  };

  const handleTogglePopupActive = (id) => {
    setPopups((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const handlePopupImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPopupImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreviewPopup = async (popup) => {
    try {
      // Fetch full popup details by ID
      const response = await axios.get(
        API_ENDPOINTS.POPUPS.GET_BY_ID(popup.id)
      );

      if (response.data.success) {
        setSelectedPopupForPreview(response.data.popup);
        setShowBottomSheetPreview(true);
      }
    } catch (error) {
      console.error("Error fetching popup details:", error);
      toast.error("Failed to load popup details");
    }
  };

  const handleEditPopup = async (popup) => {
    try {
      // Fetch full popup details by ID
      const response = await axios.get(
        API_ENDPOINTS.POPUPS.GET_BY_ID(popup.id)
      );

      if (response.data.success) {
        const popupData = response.data.popup;

        // Populate form with popup data
        setPopupName(popupData.name || "");
        setPopupType(popupData.type || "");
        setPopupTitle(popupData.title || "");
        setPopupContent(popupData.content || "");
        setCtaText(popupData.ctaText || "");
        setCtaLink(popupData.ctaLink || "");
        setAllowDismiss(popupData.allowDismiss ?? true);
        setPopupColor(popupData.color || "#10b981");
        setPopupImage(popupData.image || null);
        setPopupImageSize(popupData.imageSize || "medium");

        // Set edit mode and popup ID
        setIsPopupEditMode(true);
        setEditingPopupId(popup.id);

        // Open the modal for editing
        setShowPopupModal(true);
      }
    } catch (error) {
      console.error("Error fetching popup details:", error);
      toast.error("Failed to load popup details for editing");
    }
  };

  return (

    <div className="h-full overflow-y-scroll w-full bg-gray-50 text-gray-800 p-10">
  <Header />

  {/* Loading State */}
  {loading && (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-gray-500">Loading splash screens...</p>
      </div>
    </div>
  )}

  {/* Content - Only show when not loading */}
  {!loading && (
    <>
      <SplashScreensList
        splashScreens={splashScreens}
        selectedSplashId={selectedSplashId}
        onSelectSplash={handleSelectSplash}
        onToggleActive={handleToggleActive}
        onDeleteSplash={handleDeleteSplash}
        onCreateNew={() => setShowCreateModal(true)}
      />

      {/* ==================== EDITOR & PREVIEW ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
        <div className="lg:col-span-2">
          <SplashScreenEditor
            editorSettings={editorSettings}
            onUpdateSetting={updateEditorSetting}
            onImageUpload={handleImageUpload}
            imageInputRef={imageInputRef}
            onSave={handleSaveChanges}
            isLoading={isSaving}
          />
        </div>
        <div className="lg:col-span-1">
          <SplashScreenPreview editorSettings={editorSettings} />
        </div>
      </div>

      {/* ==================== POPUPS MANAGER ==================== */}
      <div className="mt-10">
        <PopupsManager
          popups={popups}
          onCreateNew={() => {
            setIsPopupEditMode(false);
            setEditingPopupId(null);
            setShowPopupModal(true);
          }}
          onToggleActive={handleTogglePopupActive}
          onPreview={handlePreviewPopup}
          onEdit={handleEditPopup}
        />
      </div>

      {/* ==================== MODALS ==================== */}
      {showCreateModal && (
        <CreateSplashModal
          formData={createFormData}
          onFormChange={handleCreateFormChange}
          uploadedFile={createUploadedFile}
          onFileUpload={handleCreateFileUpload}
          onCreate={handleCreateSplash}
          onClose={() => {
            setShowCreateModal(false);
            setCreateFormData({
              name: "",
              screen_type: "mp4",
              role: "USER",
              referralcode: "",
            });
            setCreateUploadedFile(null);
          }}
          isLoading={isCreating}
        />
      )}

      {showPopupModal && (
        <CreatePopupModal
          popupName={popupName}
          popupType={popupType}
          popupTitle={popupTitle}
          popupContent={popupContent}
          ctaText={ctaText}
          ctaLink={ctaLink}
          allowDismiss={allowDismiss}
          popupColor={popupColor}
          popupImage={popupImage}
          popupImageSize={popupImageSize}
          onNameChange={setPopupName}
          onTypeChange={setPopupType}
          onTitleChange={setPopupTitle}
          onContentChange={setPopupContent}
          onCtaTextChange={setCtaText}
          onCtaLinkChange={setCtaLink}
          onAllowDismissChange={setAllowDismiss}
          onColorChange={setPopupColor}
          onImageSizeChange={setPopupImageSize}
          onImageUpload={handlePopupImageUpload}
          popupImageInputRef={popupImageInputRef}
          onCreate={handleCreatePopup}
          onClose={() => {
            setShowPopupModal(false);
            setIsPopupEditMode(false);
            setEditingPopupId(null);
            resetPopupForm();
          }}
          isEditMode={isPopupEditMode}
        />
      )}

      {showBottomSheetPreview && (
        <BottomSheetPreview
          popup={selectedPopupForPreview}
          onClose={() => setShowBottomSheetPreview(false)}
        />
      )}

      {isFullScreen && (
        <FullScreenPreview
          editorSettings={editorSettings}
          onClose={() => setIsFullScreen(false)}
        />
      )}
    </>
  )}

  <ToastContainer position="top-right" autoClose={3000} />
</div>

  );
}




