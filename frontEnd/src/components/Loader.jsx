import React from 'react';

const Loader = ({ size = "medium", color = "gray" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8", 
    large: "w-12 h-12",
    xlarge: "w-16 h-16"
  };

  const colorClasses = {
    gray: "bg-gray-600",
    blue: "bg-blue-600",
    green: "bg-green-600",
    white: "bg-white"
  };

  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="flex space-x-2">
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}
          style={{ animationDelay: '0ms' }}
        ></div>
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}
          style={{ animationDelay: '150ms' }}
        ></div>
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}
          style={{ animationDelay: '300ms' }}
        ></div>
      </div>
    </div>
  );
};

export default Loader; 