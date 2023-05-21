import React, { useState } from "react"
import { Link } from "react-router-dom"
import { ActorSubclass, Identity } from "@dfinity/agent"
import { getContentString } from "../utils/ContentUtil"
import { wall } from "../../declarations/wall"
import { Message, _SERVICE } from "../../declarations/wall/wall.did"
import BaseCard from "./BaseCard"
import likeButton from "../assets/like-button-icon.svg"
import dislikeButton from "../assets/dislike-button-icon.svg"


export default function ContentCard({
  message,
  identity,
  refreshWall,
  authWall,
}: {
  message: Message
  identity: Identity | undefined
  refreshWall: () => Promise<void>
  authWall: ActorSubclass<_SERVICE> | undefined
}) {
  const [voteLoading, setVoteLoading] = useState<any>()
  const [deleteLoading, setDeleteLoading] = useState<any>()

  const onVote = async (upVote: boolean, index: bigint) => {
    setVoteLoading(true)
    const actor = authWall ?? wall
    if (upVote) {
      await actor.upVote(index)
    } else {
      await actor.downVote(index)
    }
    refreshWall()
    setVoteLoading(false)
  }

  const onDelete = async (index: bigint) => {
    setDeleteLoading(true)
    const actor = authWall ?? wall
    await actor.deleteMessage(index)
    refreshWall()
    setDeleteLoading(false)
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
        {!!identity && "Survey" in message.content &&
          <button className="btn btn-xs btn-info">
            <Link to={`survey/${msg.id}`}>survey</Link>
          </button>}
        {deleteLoading ?
          <button className="btn btn-square loading"></button>
          :
          identity?.getPrincipal().toText() == msg.creator.toText()
          && (
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
        {voteLoading ?
          <button className="btn btn-square loading"></button>
          :
          identity &&
          !(identity?.getPrincipal().toText() == msg.creator.toText()) && (
            <>
              <div className="inline-flex">
                <input
                  type="image"
                  src={likeButton}
                  style={{ filter: "invert(1)" }}
                  className="mx-1 h-8"
                  onClick={() => {
                    onVote(true, message.id)
                  }}
                />
                <input
                  type="image"
                  src={dislikeButton}
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
            <UserCardActions msg={msg} />
          </div>
          <div className="card-actions justify-end">
            <AuthorCardActions msg={msg} canUpdate={canUpdate} />
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
              <h2 className="text-primary">Text</h2>
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
          <figure className="bg-info-content">
            <img
              className="h-80 lg:h-96"
              src={getContentString(message.content)}
            />
          </figure>
          <div className="card-body">
            <div className="grid grid-cols-2 card-title">
              <h2 className="text-secondary">Image</h2>
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
            <CardActions msg={message} canUpdate={true} />
          </div>
        </BaseCard>
      ) : (
        <BaseCard>
          <div className="card-body">
            <div className="grid grid-cols-2 card-title">
              <h2 className="text-accent">Survey</h2>
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
            <CardActions msg={message} canUpdate={false} />
          </div>
        </BaseCard>
      )}
    </>
  )
}
