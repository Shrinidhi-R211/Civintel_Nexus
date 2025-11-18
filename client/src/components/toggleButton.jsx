import { useState } from "react";

export default function ToggleSwitch() {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div 
        className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition duration-300 ${isOn ? 'bg-green-500' : 'bg-gray-300'}`} 
        onClick={handleToggle}
      >
        {/* The circle */}
        <div 
          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition duration-300 ${isOn ? 'translate-x-6' : ''}`}
        ></div>
      </div>
    </div>
  );
}
