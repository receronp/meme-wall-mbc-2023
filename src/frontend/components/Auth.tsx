import React, { useCallback, useEffect, useState } from "react"
import { AuthClient } from "@dfinity/auth-client"
import dfinityLogo from "../assets/dfinity.svg"
import { Identity } from "@dfinity/agent"

// Note: This is just a basic example to get you started
function Auth({
  setIdentity,
}: {
  setIdentity: React.Dispatch<React.SetStateAction<Identity | undefined>>
}) {
  const [signedIn, setSignedIn] = useState<boolean>(false)
  const [principal, setPrincipal] = useState<string>("")
  const [client, setClient] = useState<any>()

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
          identityProvider: `http://${process.env.INTERNET_IDENTITY_CANISTER_ID}.localhost:4943`,
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
  }

  useEffect(() => {
    initAuth()
  }, [])

  return (
    <div className="auth-section">
      {!signedIn && client ? (
        <button onClick={signIn} className="auth-button">
          Login with Internet Identity
          <img
            style={{ width: "33px", marginRight: "-1em", marginLeft: "0.7em" }}
            src={dfinityLogo}
          />
        </button>
      ) : null}

      {signedIn ? (
        <>
          <p>Signed in as: {principal}</p>
          <button onClick={signOut} className="auth-button">
            Sign out
          </button>
        </>
      ) : null}
    </div>
  )
}

export { Auth }
