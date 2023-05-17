import React from "react"

export default function LoadingContent () {
  return (
    <div className="hero bg-base-200" style={{ minHeight: "90vh" }}>
    <div className="hero-content text-center">
      <div className="max-w-md">
        <progress className="progress w-56"></progress>
      </div>
    </div>
  </div>
  )
}
