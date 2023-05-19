import React, { ReactNode } from "react"

type LoginProps = {
  display: boolean | undefined
  message: string | undefined
  children?: ReactNode | undefined
}

const LoginTooltip: React.FC<LoginProps> = ({
  display,
  message,
  children,
}) => {
  return (
    <div className={display ? "tooltip" : undefined} data-tip={message}>
      {children}
    </div>
  )
}

export default LoginTooltip
