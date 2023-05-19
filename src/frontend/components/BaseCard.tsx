import React, { ReactNode } from "react"

export default function BaseCard({ children }: { children: ReactNode | undefined }) {
    return (
        <div className="card w-96 bg-base-200 shadow-xl">{children}</div>
    )
}