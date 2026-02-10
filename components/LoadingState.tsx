"use client";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading your journal..." }: LoadingStateProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-spin-custom">⏳</div>
        <p className="text-lg text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}
