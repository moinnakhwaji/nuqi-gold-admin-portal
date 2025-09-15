import React, { useState } from 'react';
import jsPDF from 'jspdf';

const ImageModal = ({ isOpen, onClose, imageSrc, alt, record }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    if (!record) return;

    setIsDownloading(true);
    try {
      // eslint-disable-next-line new-cap
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;

      // Add header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('KYC Document Verification Report', pageWidth / 2, 30, { align: 'center' });

      // Add user info
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`User ID: ${record.userId || 'N/A'}`, margin, 50);
      pdf.text(`Transaction ID: ${record.transactionId || 'N/A'}`, margin, 60);
      pdf.text(`Status: ${record.status || 'N/A'}`, margin, 70);
      pdf.text(`Verified At: ${record.verifiedAt ? new Date(record.verifiedAt).toLocaleString() : 'N/A'}`, margin, 80);

      let yPosition = 100;

      // Determine which images to include based on the current modal
      const imagesToInclude = [];

      // Always include the current image
      if (imageSrc) {
        imagesToInclude.push({
          title: alt,
          src: imageSrc,
          type: 'current'
        });
      }

      // If viewing ID photo or face image, also include POI image (PAN card)
      if ((alt.includes('Digilocker ID') || alt.includes('Face')) && record.poiImagePath) {
        imagesToInclude.push({
          title: 'POI Document (PAN Card)',
          src: record.poiImagePath,
          type: 'poi'
        });
      }

      // Process images sequentially to avoid async issues
      // eslint-disable-next-line arrow-body-style
      const processImage = (imageData) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';

          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);

              const imgDataUrl = canvas.toDataURL('image/jpeg', 0.8);
              const imgWidth = pageWidth - (2 * margin);
              const imgHeight = (img.height * imgWidth) / img.width;

              // Check if we need a new page
              if (yPosition + imgHeight > 250) {
                pdf.addPage();
                yPosition = margin;
              }

              pdf.setFontSize(14);
              pdf.setFont('helvetica', 'bold');
              pdf.text(imageData.title, margin, yPosition);
              yPosition += 10;

              pdf.addImage(imgDataUrl, 'JPEG', margin, yPosition, imgWidth, imgHeight);
              yPosition += imgHeight + 20;
              resolve();
            } catch (error) {
              console.error('Error processing image:', error);
              resolve();
            }
          };

          img.onerror = () => {
            console.error('Error loading image:', imageData.title);
            resolve();
          };

          img.src = imageData.src;
        });
      };

      // Process all images sequentially
      // eslint-disable-next-line no-restricted-syntax
      for (const image of imagesToInclude) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await processImage(image);
        } catch (error) {
          console.error(`Error adding ${image.title} to PDF:`, error);
        }
      }

      // Add footer
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, 280);

      // Save PDF
      pdf.save(`kyc-document-${record.userId || 'user'}-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      console.error('Please try again or contact support if the issue persists.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {alt}
            </h2>
            {record && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                User ID: {record.userId} | Transaction: {record.transactionId}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Image content - scrollable */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-center">
            <div className="relative group">
              <img
                src={imageSrc}
                alt={alt}
                className="max-h-[50vh] max-w-full rounded-lg shadow-lg object-contain"
              />
              {/* Image overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with actions - always visible */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex-shrink-0">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isDownloading || !record}
              className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isDownloading || !record
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating PDF...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal; 