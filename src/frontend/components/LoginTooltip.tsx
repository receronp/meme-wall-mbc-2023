import { Identity } from "@dfinity/agent"
import React, { ReactNode } from "react"

type LoginProps = {
  identity: Identity | undefined
  children?: ReactNode | undefined
}

const LoginTooltip: React.FC<LoginProps> = ({ identity, children }) => {
  return (
    <div
      className={!identity ? "tooltip" : undefined}
      data-tip="Login is needed"
    >
      {children}
    </div>
  )
}

export default LoginTooltip
