import React from "react";
import { UploadIcon } from "./icons";

// Popup Form Fields Component - White Theme
function PopupFormFields({
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
}) {
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Popup Name
        </label>
        <input
          type="text"
          placeholder="e.g., Welcome Offer"
          value={popupName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Popup Type
        </label>
        <input
          type="text"
          placeholder="e.g., Discount Popup"
          value={popupType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Display Title
        </label>
        <input
          type="text"
          placeholder="e.g., From App to Doorstep"
          value={popupTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Content
        </label>
        <textarea
          placeholder="Enter popup content here..."
          rows="3"
          value={popupContent}
          onChange={(e) => onContentChange(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        ></textarea>
      </div>
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          CTA Configuration
        </label>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Button Text (e.g., 'Get Discount')"
            value={ctaText}
            onChange={(e) => onCtaTextChange(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <input
            type="text"
            placeholder="Link URL (e.g., '/offers')"
            value={ctaLink}
            onChange={(e) => onCtaLinkChange(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Popup Image
        </label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-emerald-400 transition-all"
          onClick={() => popupImageInputRef.current?.click()}
        >
          {popupImage ? (
            <div className="flex flex-col items-center">
              <img
                src={popupImage}
                alt="Preview"
                className="h-20 w-20 object-contain mb-2 rounded"
              />
              <p className="text-xs text-emerald-600">Image uploaded</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <UploadIcon small />
              <p className="text-xs">Click to upload image</p>
            </div>
          )}
          <input
            ref={popupImageInputRef}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={onImageUpload}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Image Size
        </label>
        <select
          value={popupImageSize}
          onChange={(e) => onImageSizeChange(e.target.value)}
          className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Color
        </label>
        <input
          type="color"
          value={popupColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-20 h-10 p-1 bg-white border border-gray-300 rounded-lg cursor-pointer"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="dismiss-checkbox"
          checked={allowDismiss}
          onChange={(e) => onAllowDismissChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
        />
        <label
          htmlFor="dismiss-checkbox"
          className="text-sm font-medium text-gray-600"
        >
          Allow dismiss
        </label>
      </div>
    </>
  );
}

export default PopupFormFields;