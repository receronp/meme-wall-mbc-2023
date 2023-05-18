import React, { useEffect, useState } from "react"
import { Identity } from "@dfinity/agent"
import { AuthClient } from "@dfinity/auth-client"
import dfinityLogo from "../assets/dfinity-logo.svg"
import memeWall from "../assets/meme-wall.svg"

export default function Navbar({
  setIdentity,
}: {
  setIdentity: React.Dispatch<React.SetStateAction<Identity | undefined>>
}) {
  const [signedIn, setSignedIn] = useState<boolean>(false)
  const [client, setClient] = useState<any>()
  const [principal, setPrincipal] = useState<any>()

  const initAuth = async () => {
    const client = await AuthClient.create()
    const isAuthenticated = await client.isAuthenticated()

    setClient(client)

    if (isAuthenticated) {
      const identity = client.getIdentity()
      const principal = identity.getPrincipal().toString()
      setSignedIn(true)
      setPrincipal(principal)
      setIdentity(identity)
    }
  }

  type UserIdentity = { identity: Identity; principal: string }

  const signIn = async () => {
    const { identity, principal } = await new Promise<UserIdentity>(
      (resolve, reject) => {
        client.login({
          identityProvider: "https://identity.ic0.app/#authorize",
          onSuccess: () => {
            const identity = client.getIdentity()
            const principal = identity.getPrincipal().toString()
            resolve({ identity, principal })
          },
          onError: reject,
        })
      },
    )
    setSignedIn(true)
    setPrincipal(principal)
    setIdentity(identity)
  }

  const signOut = async () => {
    await client.logout()
    setSignedIn(false)
    setPrincipal("")
    setIdentity(undefined)
    window.location.href = "/"
  }

  useEffect(() => {
    initAuth()
  }, [])

  return (
    <div className="navbar bg-neutral text-neutral-content fixed top-0 z-20">
      <div className="grid w-full grid-cols-2">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl" href="/">
            <img className="w-48" src={memeWall}></img>
          </a>
        </div>
        <div className="inline-flex justify-end">
          {!signedIn && client && (
            <div className="dropdown dropdown-end">
              <div className="navbar-end btn btn-wide">
                <button
                  onClick={signIn}
                  className="flex space-x-2 items-center"
                >
                  <span>Login with Internet Identity</span>
                  <img
                    style={{
                      width: "33px",
                    }}
                    src={dfinityLogo}
                  />
                </button>
              </div>
            </div>
          )}
          {signedIn && (
            <>
              <div className="hidden lg:block">Signed in as: {principal}</div>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost">
                  <div className="w-10 rounded-full">
                    <img src={dfinityLogo} />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="mt-3 p-2 shadow menu menu-compact dropdown-content rounded-box w-52 bg-neutral"
                >
                  <li onClick={signOut}>
                    <a>Logout</a>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
