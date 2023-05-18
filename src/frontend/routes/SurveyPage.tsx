import React, { ReactNode, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { ActorSubclass, Identity } from "@dfinity/agent"
import LoginTooltip from "../components/LoginTooltip"
import LoadingContent from "../components/LoadingContent"
import BaseCard from "../components/BaseCard"
import { wall } from "../../declarations/wall"
import { Answer, _SERVICE } from "../../declarations/wall/wall.did"

export default function SurveyPage({
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
    } = useForm<{ answer: string }>()
    const [title, setTitle] = useState<string>("")
    const [answers, setAnswers] = useState<Answer[]>()
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        refreshSurvey()
    }, [])

    const refreshSurvey = async () => {
        if (key) {
            const res = await (authWall ?? wall).getMessage(BigInt(key))
            if ("ok" in res) {
                const content = res.ok.content
                if ("Survey" in content) {
                    setTitle(content.Survey.title)
                    setAnswers(content.Survey.answers)
                }
            } else {
                console.log(res.err)
                navigate("/")
            }
        }
    }

    const onSubmit: SubmitHandler<{ answer: string }> = async (data) => {
        setLoading(true)
        if (authWall) {
            if (key) {
                const res = await authWall.surveyAnswer(BigInt(key), [data.answer, BigInt(0)])
                console.log(res)
            }
        } else {
            console.log("There seems to be an issue with the agent for the backend canister.")
        }
        refreshSurvey()
        setLoading(false)
    }

    const SurveyCard = () => {
        return (
            <div className="card bg-base-100 shadow-xl fixed right-10 left-10 top-14 z-10">
                <div className="card-body text-center">
                    <h2 className="card-title">{title}</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <textarea
                            autoFocus
                            placeholder="Type your answer here..."
                            className="textarea textarea-bordered w-full my-2"
                            {...register("answer", { required: true })}
                        ></textarea>
                        <div>
                            {errors.answer && (
                                <div>
                                    <span className="text-primary">This field is required</span>
                                </div>
                            )}
                            <div>
                                <LoginTooltip
                                    display={!identity}
                                    message={"Login is needed"}
                                >
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

    return (
        <>
            {loading ? (
                <LoadingContent />
            ) : (
                <>
                    <SurveyCard />
                    <div className="card fixed z-10 -rotate-90 top-96">
                        <h2 className="card-title">Answers</h2>
                    </div>
                    <div className="container mx-auto pt-64">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 my-2">
                            {answers?.map((answer, i) => {
                                return (
                                    <div key={i} className="grid place-content-center my-4">
                                        <div className="card bg-base-200 shadow-xl max-w-xs mx-2">
                                            <div className="card-body">
                                                <div className="text-ellipsis overflow-hidden">
                                                    <span>{answer[0]}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div></>
            )}
        </>
    )
}
