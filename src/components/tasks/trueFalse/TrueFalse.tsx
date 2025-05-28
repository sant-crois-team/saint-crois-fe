"use client";

import { IAnswer, ITaskData } from "@/models";
import styles from "./trueFalseTask.module.css";
import { useOwnStore } from "@/store/storeProvider";
import { useEffect } from "react";
import { useLanguageSync } from "@/utils/useLanguage";

type propsTypes = {
    taskData: ITaskData;
    index: number;
};

const learningLanguage = "Ukrainian";

const TrueFalseTask: React.FC<propsTypes> = ({ taskData, index }) => {
    const { setUserAnswers, userAnswers } = useOwnStore((state) => state);

    const { t } = useLanguageSync();

    const initUserAnswers = () => {
        const initObject = {
            taskId: taskData.taskId,
            questions: [] as {
                questionId: string;
                userAnswer: string | null;
            }[],
        };

        taskData.questions?.map((q) => {
            const newQuestion = {
                questionId: q.questionId,
                userAnswer: null,
            };

            initObject.questions.push(newQuestion);
        });

        setUserAnswers(initObject as IAnswer);
    };

    useEffect(initUserAnswers, [
        setUserAnswers,
        taskData.questions,
        taskData.taskId,
    ]);

    const changeOption = (
        e: React.ChangeEvent<HTMLInputElement>,
        newQuestionId: string
    ) => {
        const selectedOption = e.target.value;

        const existingAnswer = userAnswers.find(
            (answer: IAnswer) => answer.taskId === taskData.taskId
        );

        let updatedQuestions;

        if (existingAnswer) {
            const existingQuestionIndex = existingAnswer.questions.findIndex(
                (q) => q.questionId === newQuestionId
            );

            if (existingQuestionIndex > -1) {
                updatedQuestions = existingAnswer.questions.map(
                    (q, index: number) =>
                        index === existingQuestionIndex
                            ? { ...q, userAnswer: selectedOption }
                            : q
                );
            } else {
                updatedQuestions = [
                    ...existingAnswer.questions,
                    { questionId: newQuestionId, userAnswer: selectedOption },
                ];
            }
        } else {
            updatedQuestions = [
                { questionId: newQuestionId, userAnswer: selectedOption },
            ];
        }

        const questionList = {
            taskId: taskData.taskId,
            questions: updatedQuestions,
        };

        setUserAnswers(questionList);
    };

    const options = [t("true"), t("false"), t("not specified")];

    return (
        <div>
            <h2 className="headlines-m" style={{ margin: "1.5rem 0" }}>
                {`${t("exersice")} ${index}`}
            </h2>

            <p className="headlines-m" style={{ margin: "0 0 1.25rem" }}>
                {taskData?.taskDescriptions[learningLanguage]}
            </p>

            <div className={styles.qustion_container}>
                {taskData?.questions?.map((question) => (
                    <div
                        className={styles.question_item}
                        key={question.questionId}
                    >
                        <h3
                            className="headlines-s"
                            style={{ marginBottom: "1rem" }}
                        >
                            {question?.questionText}
                        </h3>

                        <div className={styles.option_container}>
                            {options.map((option, index) => {
                                return (
                                    <div className={styles.option} key={index}>
                                        <label className="body-l">
                                            {option}

                                            <input
                                                type="radio"
                                                value={option}
                                                onChange={(e) =>
                                                    changeOption(
                                                        e,
                                                        question.questionId
                                                    )
                                                }
                                                checked={
                                                    userAnswers
                                                        .find(
                                                            (answer: IAnswer) =>
                                                                answer.taskId ===
                                                                taskData.taskId
                                                        )
                                                        ?.questions.find(
                                                            (q) =>
                                                                q.questionId ===
                                                                question.questionId
                                                        )?.userAnswer === option
                                                }
                                            />
                                            <span
                                                className={
                                                    styles.custom_radioBtn
                                                }
                                            />
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrueFalseTask;
