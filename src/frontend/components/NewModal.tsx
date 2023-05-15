import React, { useState } from "react"
import { Content } from "../../declarations/wall/wall.did"

export function NewModal({
  setContent,
}: {
  setContent: React.Dispatch<React.SetStateAction<Content | undefined>>
}) {
  const [contentText, setContentText] = useState<string>("")

  const updateContent = async () => {
    const content = { Text: contentText }
    setContent(content)
    setContentText("")
  }

  return (
    <>
      <input type="checkbox" id="my-modal-1" className="modal-toggle" />
      <label htmlFor="my-modal-1" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">New Message Content</h3>
          <p className="flex py-4 px-2">
            <input
              value={contentText}
              onChange={(e) => {
                setContentText(e.currentTarget.value)
              }}
              className="input w-full max-w-xs bg-slate-900"
            />
            <button
              onClick={() => {
                updateContent()
              }}
              className="btn"
            >
              Submit
            </button>
          </p>
        </label>
      </label>
    </>
  )
}
