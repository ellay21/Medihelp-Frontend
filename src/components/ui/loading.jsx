import { Loader2 } from "lucide-react";

// Full page loading spinner
export const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
};

// Inline loading spinner
export const InlineLoader = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2 
      className={`animate-spin text-blue-600 ${sizeClasses[size]} ${className}`} 
    />
  );
};

// Loading overlay for sections
export const LoadingOverlay = ({ message = "Loading..." }) => {
  return (
    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-50 rounded-lg">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
};

// Skeleton loader for content
export const Skeleton = ({ className = "", variant = "default" }) => {
  const variants = {
    default: "bg-gray-200 dark:bg-gray-700",
    text: "h-4 bg-gray-200 dark:bg-gray-700 rounded",
    circle: "rounded-full bg-gray-200 dark:bg-gray-700",
    card: "h-32 bg-gray-200 dark:bg-gray-700 rounded-lg",
  };

  return (
    <div className={`animate-pulse ${variants[variant]} ${className}`} />
  );
};

// Card skeleton
export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circle" className="h-12 w-12" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
      <Skeleton variant="text" className="mb-2" />
      <Skeleton variant="text" className="w-5/6" />
    </div>
  );
};
