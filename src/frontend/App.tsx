import React, { useState } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Wall from "./routes/Wall"
import EditPage from "./routes/EditPage"
import ErrorPage from "./error-page"
import { ActorSubclass, Identity } from "@dfinity/agent"
import { _SERVICE } from "../declarations/wall/wall.did"

function App() {
  const [identity, setIdentity] = useState<Identity>()
  const [authWall, setAuthWall] = useState<ActorSubclass<_SERVICE>>()

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Wall identity={identity} authWall={authWall} setAuthWall={setAuthWall} />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/post",
      element: <EditPage authWall={authWall} identity={identity}/>,
    },
    {
      path: "/post/:key",
      element: <EditPage authWall={authWall} identity={identity}/>,
    },
  ])

  return (
    <>
      <Navbar setIdentity={setIdentity} />
      <RouterProvider router={router} />
      <Footer />
    </>
  )
}

export default App
