import React, { useState } from "react"
import { Auth } from "./components/Auth"
import { Intro } from "./components/Intro"
import { Identity } from "@dfinity/agent"

function App() {
  const [identity, setIdentity] = useState<Identity>()

  return (
    <div className="App">
      <Auth setIdentity={setIdentity} />
      <Intro identity={identity} />
    </div>
  )
}

export default App
