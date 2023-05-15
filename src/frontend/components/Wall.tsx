import React, { useEffect, useState } from "react"
import { canisterId, createActor, wall } from "../../declarations/wall"
import { Content, Message, _SERVICE } from "../../declarations/wall/wall.did"
import { ActorSubclass, Identity } from "@dfinity/agent"

export function Wall({
  identity,
  newContent,
  updateContent,
}: {
  identity: Identity | undefined
  newContent: Content | undefined
  updateContent: Content | undefined
}) {
  const [index, setIndex] = useState<bigint>(BigInt(0))
  const [messages, setMessages] = useState<Message[]>()
  const [authenticatedWall, setAuthenticatedWall] =
    useState<ActorSubclass<_SERVICE>>()

  useEffect(() => {
    refreshWall()
  }, [])

  useEffect(() => {
    setAuthenticatedWall(
      createActor(canisterId, {
        agentOptions: {
          identity,
        },
      }),
    )
    refreshWall()
  }, [identity])

  const refreshWall = async () => {
    const actor = authenticatedWall ?? wall
    const res = await actor.getAllMessagesRanked()
    res.forEach((i) => {
      console.log(i.creator.toString())
    })
    setMessages(res)
  }

  const onVote = async (upVote: boolean, index: bigint) => {
    const actor = authenticatedWall ?? wall
    if (upVote) {
      await actor.upVote(index)
    } else {
      await actor.downVote(index)
    }
    refreshWall()
  }

  const onDelete = async (index: bigint) => {
    const actor = authenticatedWall ?? wall
    await actor.deleteMessage(index)
    refreshWall()
  }

  const onNew = async (content: any) => {
    const actor = authenticatedWall ?? wall
    await actor.writeMessage(content)
    refreshWall()
  }

  useEffect(() => {
    onNew(newContent)
  }, [newContent])

  const onUpdate = async (index: bigint, content: any) => {
    const actor = authenticatedWall ?? wall
    await actor.updateMessage(index, content)
    refreshWall()
  }

  useEffect(() => {
    onUpdate(index, updateContent)
  }, [updateContent])

  return (
    <div className="container mx-auto py-2">
      <table className="table w-full">
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
                <td>{JSON.stringify(msg.content)}</td>
                <td>{msg.creator.toString()}</td>
                <td className="flex">
                  <button
                    className="mx-1"
                    onClick={() => {
                      onVote(true, msg.id)
                    }}
                  >
                    🔼
                  </button>
                  <button
                    className="mx-1"
                    onClick={() => {
                      onVote(false, msg.id)
                    }}
                  >
                    🔽
                  </button>
                  <span>{msg.vote.toString()}</span>
                </td>
                <td>
                  <label
                    onClick={() => {
                      setIndex(msg.id)
                    }}
                    htmlFor="my-modal-2"
                    className="btn btn-xs btn-warning"
                  >
                    update
                  </label>
                </td>
                <td>
                  <button
                    onClick={() => onDelete(msg.id)}
                    className="btn btn-xs btn-error"
                  >
                    delete
                  </button>
                </td>
              </tr>
            )
          })}
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <label htmlFor="my-modal-1" className="btn">
                New message
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
