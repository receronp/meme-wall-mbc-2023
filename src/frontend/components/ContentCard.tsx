import React, { ReactNode } from "react"
import { ActorSubclass, Identity } from "@dfinity/agent"
import { getContentString } from "../utils/ContentUtil"
import { wall } from "../../declarations/wall"
import { Message, _SERVICE } from "../../declarations/wall/wall.did"
import { Link } from "react-router-dom"

export default function ContentCard({
  message,
  identity,
  refreshWall,
  authWall,
  setLoading,
}: {
  message: Message
  identity: Identity | undefined
  refreshWall: () => Promise<void>
  authWall: ActorSubclass<_SERVICE> | undefined
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}) {
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

  const BaseCard = ({ children }: { children: ReactNode | undefined }) => {
    return (
      <>
        <div className="card w-96 bg-base-200 shadow-xl">{children}</div>
      </>
    )
  }

  const AuthorCardActions = ({
    msg,
    canUpdate,
  }: {
    msg: Message
    canUpdate: boolean
  }) => {
    return (
      <>
        {identity?.getPrincipal().toText() == msg.creator.toText() && (
          <>
            {canUpdate ? (
              <button className="btn btn-xs btn-warning">
                <Link to={`post/${msg.id}`}>update</Link>
              </button>
            ) : (
              <></>
            )}
            <button
              onClick={() => onDelete(msg.id)}
              className="btn btn-xs btn-error"
            >
              delete
            </button>
          </>
        )}
      </>
    )
  }

  const UserCardActions = ({ msg }: { msg: Message }) => {
    return (
      <>
        {identity &&
          !(identity?.getPrincipal().toText() == msg.creator.toText()) && (
            <>
              <div className="inline-flex">
                <input
                  type="image"
                  src="../assets/like-button-icon.svg"
                  style={{ filter: "invert(1)" }}
                  className="mx-1 h-8"
                  onClick={() => {
                    onVote(true, message.id)
                  }}
                />
                <input
                  type="image"
                  src="../assets/dislike-button-icon.svg"
                  style={{ filter: "invert(1)" }}
                  className="mx-1 h-8"
                  onClick={() => {
                    onVote(false, message.id)
                  }}
                />
              </div>
            </>
          )}
      </>
    )
  }

  const CardActions = ({
    msg,
    canUpdate,
  }: {
    msg: Message
    canUpdate: boolean
  }) => {
    return (
      <>
        <div className="grid grid-cols-2">
          <div className="card-actions">
            <UserCardActions msg={message} />
          </div>
          <div className="card-actions justify-end">
            <AuthorCardActions msg={message} canUpdate={canUpdate} />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {"Text" in message.content ? (
        <BaseCard>
          <div className="card-body">
            <div className="grid grid-cols-2 card-title">
              <h2>Text Message</h2>
              <p className="text-sm text-right">
                Vote Diff: {message.vote.toString()}
              </p>
            </div>
            <div>
              <span>{message.content.Text}</span>
              <div className="divider"></div>
              <span>
                <strong>Author: </strong>
                {message.creator.toString()}
              </span>
            </div>
            <CardActions msg={message} canUpdate={true} />
          </div>
        </BaseCard>
      ) : "Image" in message.content ? (
        <BaseCard>
          <figure className="h-48 bg-info-content">
            <img
              className="cardMedia-media"
              src={getContentString(message.content)}
            />
          </figure>
          <div className="card-body">
            <div className="grid grid-cols-2 card-title">
              <h2>Image Message</h2>
              <p className="text-sm text-right">
                Vote Diff: {message.vote.toString()}
              </p>
            </div>
            <p>
              <span>
                <strong>Author: </strong>
                {message.creator.toString()}
              </span>
            </p>
            <div className="card-actions justify-end">
              <AuthorCardActions msg={message} canUpdate={false} />
            </div>
          </div>
        </BaseCard>
      ) : (
        <BaseCard>
          <div className="card-body">
            <div className="grid grid-cols-2 card-title">
              <h2>Survey Message</h2>
              <p className="text-sm text-right">
                Vote Diff: {message.vote.toString()}
              </p>
            </div>
            <div>
              <span>{message.content.Survey.title}</span>
              <div className="divider"></div>
              <span>
                <strong>Author: </strong>
                {message.creator.toString()}
              </span>
            </div>
            <div className="card-actions justify-end">
              <AuthorCardActions msg={message} canUpdate={false} />
            </div>
          </div>
        </BaseCard>
      )}
    </>
  )
}
