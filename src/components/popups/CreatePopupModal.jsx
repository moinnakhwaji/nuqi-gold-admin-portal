import React from "react";
import PopupFormFields from "./PopupFormFields";
import PopupMobilePreview from "./PopupMobilePreview";
import { CloseIcon } from "./icons";

// Create/Edit Popup Modal Component (White Theme)
function CreatePopupModal({
  popupName,
  popupType,
  popupTitle,
  popupContent,
  ctaText,
  ctaLink,
  allowDismiss,
  popupColor,
  popupImage,
  popupImageSize,
  onNameChange,
  onTypeChange,
  onTitleChange,
  onContentChange,
  onCtaTextChange,
  onCtaLinkChange,
  onAllowDismissChange,
  onColorChange,
  onImageSizeChange,
  onImageUpload,
  popupImageInputRef,
  onCreate,
  onClose,
  isEditMode = false,
}) {
  return (
    <div
      className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-5xl border border-gray-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 z-10 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditMode ? "Edit Popup" : "Create New Popup"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <CloseIcon className="text-gray-600" />
          </button>
        </div>

        {/* Main Form and Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <PopupFormFields
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
              onNameChange={onNameChange}
              onTypeChange={onTypeChange}
              onTitleChange={onTitleChange}
              onContentChange={onContentChange}
              onCtaTextChange={onCtaTextChange}
              onCtaLinkChange={onCtaLinkChange}
              onAllowDismissChange={onAllowDismissChange}
              onColorChange={onColorChange}
              onImageSizeChange={onImageSizeChange}
              onImageUpload={onImageUpload}
              popupImageInputRef={popupImageInputRef}
            />
          </div>
          <div>
            <PopupMobilePreview
              popupTitle={popupTitle}
              popupContent={popupContent}
              popupImage={popupImage}
              popupImageSize={popupImageSize}
              ctaText={ctaText}
              allowDismiss={allowDismiss}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-8 flex justify-end space-x-4 sticky bottom-0 bg-white pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all"
          >
            {isEditMode ? "Update Popup" : "Save Popup"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePopupModal;
