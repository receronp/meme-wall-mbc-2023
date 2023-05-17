import React, { ReactNode, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { ActorSubclass, Identity } from "@dfinity/agent"
import { wall } from "../../declarations/wall"
import { Content, Result, _SERVICE } from "../../declarations/wall/wall.did"
import LoginTooltip from "../components/LoginTooltip"
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
  const { key } = useParams()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ content: Content }>()
  const [loading, setLoading] = useState<boolean>(false)
  const [contentType, setContentType] = useState<string>("text")

  useEffect(() => {
    const getMessage = async () => {
      if (key) {
        const res = await (authWall ?? wall).getMessage(BigInt(key))
        if ("ok" in res) {
          const content = res.ok.content
          if ("Text" in content) {
            setContentType("text")
            register("content.Text", { value: content.Text })
          } else if ("Survey" in content) {
            setContentType("survey")
            register("content.Survey.title", { value: content.Survey.title })
            register("content.Survey.answers", {
              value: content.Survey.answers,
            })
          } else {
            setContentType("image")
          }
        } else {
          console.log(res.err)
        }
      } else {
        console.log("No id provided, writing a new message")
      }
    }
    getMessage()
  }, [])

  const onSubmit: SubmitHandler<{ content: Content }> = async (data) => {
    setLoading(true)
    if (authWall) {
      let res: bigint | Result | undefined
      if (contentType == "text" && "Text" in data.content) {
        res = key
          ? await authWall.updateMessage(BigInt(key), {
              Text: data.content.Text,
            })
          : await authWall.writeMessage({ Text: data.content.Text })
      } else if (contentType == "image" && "Image" in data.content) {
        const image: any = data.content.Image[0]
        const imageByteData = [...new Uint8Array(await image.arrayBuffer())]
        res = key
          ? await authWall.updateMessage(BigInt(key), {
              Image: imageByteData,
            })
          : await authWall.writeMessage({ Image: imageByteData })
      } else if (contentType == "survey" && "Survey" in data.content) {
        const survey = data.content.Survey
        if (key) {
          res = await authWall.updateMessage(BigInt(key), {
            Survey: survey,
          })
        } else {
          survey.answers = []
          res = await authWall.writeMessage({ Survey: survey })
        }
      }
      console.log(res)
    } else {
      console.log(
        "There seems to be an issue with the agent for the backend canister.",
      )
    }
    setLoading(true)
    navigate("/")
  }

  type CardProps = {
    title: string | undefined
    children?: ReactNode | undefined
  }

  const GenericCard: React.FC<CardProps> = ({ title, children }) => {
    return (
      <div className="card w-auto bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h2 className="card-title">{title}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {children}
            <div className="grid grid-cols-2">
              {errors.content ? (
                <div>
                  <span className="text-primary">This field is required</span>
                </div>
              ) : (
                <div></div>
              )}
              <div>
                <LoginTooltip display={!identity} message="Login is needed">
                  <input
                    disabled={!identity}
                    className="btn mx-4"
                    type="submit"
                  />
                </LoginTooltip>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const TextCard = () => {
    return (
      <GenericCard title="Message Text Content">
        <textarea
          placeholder="Text content"
          className="textarea textarea-bordered w-full my-2"
          {...register("content.Text", { required: true })}
        ></textarea>
      </GenericCard>
    )
  }

  const ImageCard = () => {
    return (
      <GenericCard title="Message Image Content">
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs my-2"
          {...register("content.Image", { required: true })}
        />
      </GenericCard>
    )
  }

  const SurveyCard = () => {
    return (
      <GenericCard title="Message Survey Content">
        <input
          type="text"
          placeholder="Survey title"
          className="input w-full max-w-xs input-bordered input-primary my-2"
          {...register("content.Survey.title", { required: true })}
        />
      </GenericCard>
    )
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
                    className={
                      contentType == "image" ? "btn btn-active" : "btn"
                    }
                    onClick={() => setContentType("image")}
                  >
                    Image
                  </button>
                  <button
                    className={
                      contentType == "survey" ? "btn btn-active" : "btn"
                    }
                    onClick={() => setContentType("survey")}
                  >
                    Survey
                  </button>
                </div>
              </div>
              {contentType == "text" ? (
                <TextCard />
              ) : contentType == "image" ? (
                <ImageCard />
              ) : (
                <SurveyCard />
              )}
            </div>
            <div></div>
          </div>
        </div>
      )}
    </>
  )
}
