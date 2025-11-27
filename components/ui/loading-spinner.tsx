"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function LoadingSpinner({
  size = "md",
  className,
  text,
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  children,
  text = "Loading...",
  className,
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <LoadingSpinner text={text} />
        </div>
      )}
    </div>
  );
}

interface LoadingStateProps {
  isLoading: boolean;
  error?: Error | null;
  children: React.ReactNode;
  loadingText?: string;
  errorText?: string;
  onRetry?: () => void;
}

export function LoadingState({
  isLoading,
  error,
  children,
  loadingText = "Loading...",
  errorText = "Something went wrong",
  onRetry,
}: LoadingStateProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 text-red-600">
          <svg
            className="h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          {errorText}
        </h3>
        <p className="mb-4 text-sm text-gray-600">
          {error.message || "An unexpected error occurred"}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner text={loadingText} />
      </div>
    );
  }

  return <>{children}</>;
}
