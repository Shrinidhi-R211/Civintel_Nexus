import React from "react";
import ReactMarkdown from "react-markdown";

export default function AIResponseModal({ open, onClose, title, binfo }) {
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div 
        className="bg-white dark:bg-gray-900 w-[90%] max-w-xl p-6 rounded-2xl shadow-xl animate-fadeIn scale-100 relative"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition text-xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          {title}
        </h2>

        {/* AI Text */}
        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line overflow-y-auto max-h-[400px]">
          <ReactMarkdown>{binfo}</ReactMarkdown>
        </div>

        {/* Button */}
        <div className="flex justify-end mt-5">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
