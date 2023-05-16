import React from "react"
import poweredByICLogo from "../assets/ic-badge-powered-by_bg-white.svg"

export default function Footer() {
  return (
    <footer className="footer fixed bottom-0 p-4 bg-base-300 text-base-content h-20">
      <div>
        <a href="https://internetcomputer.org/">
          <img src={poweredByICLogo} />
        </a>
      </div>
      <div>
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by{" "}
          <a href="https://github.com/receronp">receronp</a>
        </p>
      </div>
      <div></div>
    </footer>
  )
}
