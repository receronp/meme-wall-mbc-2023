import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { canisterId, createActor, wall } from "../../declarations/wall"
import { Message, _SERVICE } from "../../declarations/wall/wall.did"
import { ActorSubclass, Identity } from "@dfinity/agent"
import { getContent } from "../utils/ContentUtil"

export function Wall({
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
    const actor = authWall ?? wall
    if (upVote) {
      await actor.upVote(index)
    } else {
      await actor.downVote(index)
    }
    refreshWall()
  }

  const onDelete = async (index: bigint) => {
    const actor = authWall ?? wall
    await actor.deleteMessage(index)
    refreshWall()
  }

  return (
    <div className="container mx-auto py-2">
      <div className="grid grid-cols-4 gap-2 my-4">
        <div>
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
        <div className="col-span-2"></div>
        <div>
          <div
            className={!identity ? "tooltip" : undefined}
            data-tip="Login is needed"
          >
            <button disabled={!identity} className="btn btn-success btn-sm">
              <Link to={`content/`}>New Message</Link>
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-y-auto h-96">
        <table className="table w-full overflow-scroll">
          <thead>
            <tr>
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
                  <td>{getContent(msg.content) as string}</td>
                  <td>{msg.creator.toString()}</td>
                  <td className="flex">
                    <div
                      className={!identity ? "tooltip" : undefined}
                      data-tip="Login is needed"
                    >
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
                    </div>
                    <span>{msg.vote.toString()}</span>
                  </td>
                  <td>
                    <div
                      className={!identity ? "tooltip" : undefined}
                      data-tip="Login is needed"
                    >
                      <button
                        disabled={!identity}
                        className="btn btn-xs btn-warning"
                      >
                        <Link to={`content/${msg.id}`}>update</Link>
                      </button>
                    </div>
                  </td>
                  <td>
                    <div
                      className={!identity ? "tooltip" : undefined}
                      data-tip="Login is needed"
                    >
                      <button
                        disabled={!identity}
                        onClick={() => onDelete(msg.id)}
                        className="btn btn-xs btn-error"
                      >
                        delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
