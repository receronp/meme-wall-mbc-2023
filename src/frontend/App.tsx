import React, { useState } from "react"
import { Auth } from "./components/Auth"
import { Identity } from "@dfinity/agent"
import { Wall } from "./components/Wall"
import { Footer } from "./components/Footer"
import { UpdateModal } from "./components/UpdateModal"
import { Content } from "../declarations/wall/wall.did"
import { NewModal } from "./components/NewModal"

function App() {
  const [newContent, setNewContent] = useState<Content>()
  const [updateContent, setUpdateContent] = useState<Content>()
  const [identity, setIdentity] = useState<Identity>()

  return (
    <div className="App">
      <NewModal setContent={setNewContent} />{" "}
      <UpdateModal setContent={setUpdateContent} />
      <Auth setIdentity={setIdentity} />
      <Wall identity={identity} newContent={newContent} updateContent={updateContent} />
      <Footer />
    </div>
  )
}

export default App
