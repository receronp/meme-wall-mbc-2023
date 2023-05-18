import React from "react"
import poweredByICLogo from "../assets/ic-badge-powered-by_bg-white.svg"

export default function Footer() {
  return (
    <footer className="footer fixed bottom-0 p-4 bg-neutral h-20">
      <div className="grid grid-cols-2 w-full lg:grid-cols-3">
        <div>
          <a href="https://internetcomputer.org/">
            <img src={poweredByICLogo} />
          </a>
        </div>
        <div>
          <p>
            Copyright © {new Date().getFullYear()} - A Motoko Bootcamp
            Initiative by <a className="text-accent-focus" href="https://github.com/receronp">receronp</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
