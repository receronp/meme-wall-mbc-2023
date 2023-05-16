import React, { useState } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { Wall } from "./components/Wall"
import { Footer } from "./components/Footer"
import { Navbar } from "./components/Navbar"
import ErrorPage from "./error-page"
import { ContentPage } from "./routes/ContentPage"
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
      path: "/content",
      element: <ContentPage authWall={authWall} identity={identity}/>,
    },
    {
      path: "/content/:key",
      element: <ContentPage authWall={authWall} identity={identity}/>,
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
