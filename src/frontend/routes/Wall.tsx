import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ActorSubclass, Identity } from "@dfinity/agent"
import ContentCard from "../components/ContentCard"
import LoginTooltip from "../components/LoginTooltip"
import LoadingContent from "../components/LoadingContent"
import { canisterId, createActor, wall } from "../../declarations/wall"
import { Message, _SERVICE } from "../../declarations/wall/wall.did"

export default function Wall({
  identity,
  authWall,
  setAuthWall,
}: {
  identity: Identity | undefined
  authWall: ActorSubclass<_SERVICE> | undefined
  setAuthWall: React.Dispatch<
    React.SetStateAction<ActorSubclass<_SERVICE> | undefined>
  >
}) {
  const [messages, setMessages] = useState<Message[]>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    refreshWall()
  }, [])

  useEffect(() => {
    setAuthWall(
      createActor(canisterId, {
        agentOptions: {
          identity,
        },
      }),
    )
    refreshWall()
  }, [identity])

  const refreshWall = async () => {
    const actor = authWall ?? wall
    const res = await actor.getAllMessagesRanked()
    setMessages(res)
  }

  return (
    <>
      {loading ? (
        <LoadingContent />
      ) : (
        <div className="container mx-auto py-10">
          <div className="grid lg:fixed lg:right-10 lg:top-32">
            <div className="stats shadow h-16 bg-base-200">
              <div className="stat">
                <div className="stat-title text-xs">Price of ICP</div>
                <div className="stat-value text-primary text-xl">USDT $5.35966</div>
              </div>
            </div>
            <div className="my-4 flex justify-end">
              <LoginTooltip display={!identity} message="Login is needed">
                <button disabled={!identity} className="btn btn-success btn-sm">
                  <Link to={`post/`}>New Post</Link>
                </button>
              </LoginTooltip>
            </div>
          </div>
          <div className="grid">
            <div className="col-span-4">
              {messages?.map((msg, i) => {
                return (
                  <div key={i} className="grid place-content-center my-4">
                    <ContentCard
                      message={msg}
                      identity={identity}
                      refreshWall={refreshWall}
                      authWall={authWall}
                      setLoading={setLoading}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
