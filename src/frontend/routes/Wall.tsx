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
  const [price, setPrice] = useState<string>("")

  useEffect(() => {
    refreshWall()
    refreshPrice()
    const interval10 = setInterval(() => {
      refreshPrice()
    }, 1000 * 10);
    return () => {
      clearInterval(interval10)
    };
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
    refreshPrice()
  }, [identity])

  const refreshWall = async () => {
    const actor = authWall ?? wall
    const res = await actor.getAllMessagesRanked()
    setMessages(res)
  }

  const refreshPrice = async () => {
    const actor = authWall ?? wall
    const res = await actor.getPrice()
    setPrice(res)
  }

  return (
    <>
      {loading ? (
        <LoadingContent />
      ) : (
        <div className="container mx-auto py-10">
          <div className="grid mx-2 lg:fixed lg:right-10 lg:top-32">
            <div className="stats shadow h-20 bg-base-200">
              <div className="stat">
                <div className="stat-title text-xs">Price of PEPE/USDT</div>
                <div className="stat-value text-primary text-xl">{price}</div>
                <div className="stat-desc">
                  <p>
                    <a className="text-accent"
                      href="https://indodax.com/api/ticker/pepeusdt"
                      target="_blank">Indodax API</a></p>
                </div>
              </div>
            </div>
            <div className="my-2 lg:my-4 flex justify-end">
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
