import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { Content, Result, _SERVICE } from "../../declarations/wall/wall.did"
import { ActorSubclass, Identity } from "@dfinity/agent"
import { getContent } from "../utils/ContentUtil"
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

export function ContentPage({
  authWall,
  identity,
}: {
  authWall: ActorSubclass<_SERVICE> | undefined
  identity: Identity | undefined
}) {
  const navigate = useNavigate()
  const { key } = useParams()
  const [content, setContent] = useState<Content>()

  useEffect(() => {
    const getMessage = async () => {
      if (authWall && identity) {
        if (key) {
          const res = await (authWall as ActorSubclass<_SERVICE>).getMessage(
            BigInt(key),
          )
          if ("ok" in res) {
            setContent(res.ok.content)
          } else {
            console.log(res.err)
          }
        } else {
          console.log("No id provided, write a new message")
        }
      } else {
        navigate("/")
      }
    }
    getMessage()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ text: string }>()

  const onSubmit: SubmitHandler<{ text: string }> = async (data) => {
    if (authWall) {
      let res: bigint | Result
      if (key) {
        res = await authWall.updateMessage(BigInt(key), {
          Text: data.text,
        })
        console.log("ok" in res ? res.ok : res.err)
      } else {
        res = await authWall.writeMessage({ Text: data.text })
        console.log(res)
      }
    }
    navigate("/")
  }

  const [contentType, setContentType] = useState<string>("text")

  const TextCard = () => {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Update Message Content</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              defaultValue={content ? (getContent(content) as string) : ""}
              placeholder="Type here"
              className="input w-full max-w-xs input-bordered input-primary my-2"
              {...register("text", { required: true })}
            />
            {errors.text && <span>This field is required</span>}
            <input className="btn mx-4" type="submit" />
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-2">
      <div className="grid grid-cols-3">
        <div></div>
        <div>
          <div className="flex my-2">
            <div className="btn-group btn-group-vertical lg:btn-group-horizontal">
              <button
                className={contentType == "text" ? "btn btn-active" : "btn"}
                onClick={() => setContentType("text")}
              >
                Text
              </button>
              <button
                className={contentType == "image" ? "btn btn-active" : "btn"}
                onClick={() => setContentType("image")}
              >
                Image
              </button>
              <button
                className={contentType == "survey" ? "btn btn-active" : "btn"}
                onClick={() => setContentType("survey")}
              >
                Survey
              </button>
            </div>
          </div>
          {contentType == "text" ? (
            <TextCard />
          ) : contentType == "image" ? (
            <div>Image</div>
          ) : (
            <div>Survey</div>
          )}
        </div>
        <div></div>
      </div>
    </div>
  )
}
