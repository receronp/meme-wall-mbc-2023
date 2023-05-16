import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { canisterId, createActor, wall } from "../../declarations/wall"
import { Message, _SERVICE } from "../../declarations/wall/wall.did"
import { ActorSubclass, Identity } from "@dfinity/agent"
import { getContentString } from "../utils/ContentUtil"
import LoginTooltip from "../components/LoginTooltip"

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

  const onVote = async (upVote: boolean, index: bigint) => {
    setLoading(true)
    const actor = authWall ?? wall
    if (upVote) {
      await actor.upVote(index)
    } else {
      await actor.downVote(index)
    }
    refreshWall()
    setLoading(false)
  }

  const onDelete = async (index: bigint) => {
    setLoading(true)
    const actor = authWall ?? wall
    await actor.deleteMessage(index)
    refreshWall()
    setLoading(false)
  }

  return (
    <>
      {loading ? (
        <div className="hero bg-base-200" style={{ minHeight: "82vh" }}>
          <div className="hero-content text-center">
            <div className="max-w-md">
              <progress className="progress w-56"></progress>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto py-2">
          <div className="grid grid-cols-4 gap-2 my-4">
            <div>
              <h1 className="text-xl font-bold">Messages</h1>
            </div>
            <div className="col-span-2"></div>
            <div>
              <LoginTooltip identity={identity}>
                <button disabled={!identity} className="btn btn-success btn-sm">
                  <Link to={`content/`}>New Message</Link>
                </button>
              </LoginTooltip>
            </div>
          </div>
          <div className="overflow-y-auto h-96">
            <table className="table w-full overflow-scroll">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Content</th>
                  <th>Creator</th>
                  <th>Vote</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {messages?.map((msg, i) => {
                  return (
                    <tr key={i}>
                      {"Text" in msg.content ? (
                        <>
                          <td>{"TEXT"}</td>
                          <td>
                            <span>{msg.content.Text}</span>
                          </td>
                        </>
                      ) : "Image" in msg.content ? (
                        <>
                          <td>{"IMAGE"}</td>
                          <td>
                            <img
                              className="cardMedia-media"
                              src={getContentString(msg.content) as string}
                            />
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{"SURVEY"}</td>
                          <td>
                            <span>{getContentString(msg.content)}</span>
                          </td>
                        </>
                      )}
                      <td>{msg.creator.toString()}</td>
                      <td>
                        <div className="grid grid-rows-2">
                          <LoginTooltip identity={identity}>
                            <button
                              disabled={!identity}
                              className="mx-1"
                              onClick={() => {
                                onVote(true, msg.id)
                              }}
                            >
                              🔼
                            </button>
                            <button
                              disabled={!identity}
                              className="mx-1"
                              onClick={() => {
                                onVote(false, msg.id)
                              }}
                            >
                              🔽
                            </button>
                          </LoginTooltip>
                          <div className="items-center text-center">
                            <span>{msg.vote.toString()}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <LoginTooltip identity={identity}>
                          <button
                            disabled={!identity}
                            className="btn btn-xs btn-warning"
                          >
                            <Link to={`content/${msg.id}`}>update</Link>
                          </button>
                        </LoginTooltip>
                      </td>
                      <td>
                        <LoginTooltip identity={identity}>
                          <button
                            disabled={!identity}
                            onClick={() => onDelete(msg.id)}
                            className="btn btn-xs btn-error"
                          >
                            delete
                          </button>
                        </LoginTooltip>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
