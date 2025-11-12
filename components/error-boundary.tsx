"use client"

import React, { Component, type ReactNode } from "react"

type ErrorBoundaryProps = {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary component for catching React errors
 * Provides fallback UI when errors occur in child components
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo)
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#1a1d23] text-white p-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-amber-400">Something went wrong</h2>
            <p className="text-gray-300 mb-4">
              We encountered an error while rendering the 3D scene. Please refresh the page to try again.
            </p>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-400 mb-2">
                  Error details
                </summary>
                <pre className="text-xs bg-black/50 p-3 rounded overflow-auto max-h-40 text-red-400">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              className="mt-6 px-6 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors font-semibold"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

