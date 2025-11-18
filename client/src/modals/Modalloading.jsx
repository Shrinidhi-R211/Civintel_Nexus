import React from "react";
const ModalLoading = ({ isOpen }) => {

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-15 flex flex-col justify-center items-center z-50">
            <div className="flex justify-center items-center z-50 ">
            <div className="w-12 h-12 border-4  border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
    )
}

export default ModalLoading;