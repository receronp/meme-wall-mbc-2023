import React from "react"
import poweredByICLogo from "../assets/ic-badge-powered-by_bg-white.svg"

export function Footer() {
  return (
    <footer className="footer footer-center fixed bottom-0 p-4 bg-base-300 text-base-content">
      <img src={poweredByICLogo} />
      <div>
        <p>Copyright © 2023 - All right reserved by receronp</p>
      </div>
    </footer>
  )
}
