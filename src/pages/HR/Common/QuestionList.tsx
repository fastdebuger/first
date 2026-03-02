import React, { useEffect } from "react";
import {Card, Space, Tag } from "antd";
import { CheckCircle2 } from "lucide-react";
import { encodeAnswer } from "../QuestionStrategy/answerCodec";
import { getStrategy } from "../QuestionStrategy/registry";
import {getTrainingClassQuizStudentAnswer, saveStudentAnswer} from "@/services/hr/quizQuestion";

const QuestionList = ({
  classCourseId,
  questions,
  sysBasicDictList,
  commitAnswers
 }: {
  classCourseId: string;
  questions: any[];
  sysBasicDictList: any[];
  commitAnswers: (answers: Record<string, string>) => void;
}) => {
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const userCode = localStorage.getItem('auth-default-userCode')
  const fetchExamRecordUserAnswer = async () => {
    const res = await getTrainingClassQuizStudentAnswer({
      user_code: userCode,
      class_course_id: classCourseId,
    })
    if (res.result.length > 0) {
      console.log('----getTrainingClassQuizStudentAnswer----', res);
      const _answer: any = {};
      res.result.forEach((item: any) => {
        _answer[item.quiz_question_id] = item.user_answer;
      })
      setAnswers({..._answer});
    }
  }

  useEffect(() => {
    fetchExamRecordUserAnswer();
  }, []);

  const saveEveryQuestionAnswer = async (answerFields: any) => {
    const res = await saveStudentAnswer({
      quiz_question_id: answerFields.questionId,
      user_answer: answerFields.answerStr,
    })
  }

  const handleAnswerChange = (questionId: string, val: string | string[]) => {
    const answerStr = encodeAnswer(val);

    setAnswers((prev) => {
      const newAnswers = { ...prev, [questionId]: answerStr };
      commitAnswers(newAnswers);
      return newAnswers;
    });
    // TODO: 统一在这里做节流保存 / onBlur保存 / 批量提交
    // saveEveryQuestionAnswer({ record_id: _recordId, question_id: questionId, user_answer: answerStr })
    saveEveryQuestionAnswer({
      questionId,
      answerStr,
    })
  };

  return (
    <>
      {questions.map((question: any, idx: number) => {
        const questionTypeObj =
          sysBasicDictList.find(
            (d: any) => d.type === "question_type" && d.value === question.question_type
          ) || {};

        if (!questionTypeObj?.label) {
          return <span key={question.question_id} style={{ color: "orange" }}>数据库字典表未配置此题的类型</span>;
        }

        const strategy = getStrategy(question.question_type);
        if (!strategy) {
          return (
            <Card key={question.question_id}>
              <div style={{ color: "orange" }}>未实现题型渲染策略：{question.question_type}</div>
            </Card>
          );
        }

        const answerStr = answers[question.question_id] || "";

        return (
          <Card
            key={question.question_id}
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              borderLeft: answerStr ? "4px solid #52c41a" : "4px solid #d9d9d9",
              marginBottom: 8,
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Tag color={questionTypeObj.color || "blue"}>{questionTypeObj.label}</Tag>
                <Tag color="green">{question.max_score} 分</Tag>
                {answerStr && (
                  <Tag icon={<CheckCircle2 size={14} />} color="success">
                    已答
                  </Tag>
                )}
              </Space>
            </div>

            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 20, lineHeight: 1.6 }}>
              {idx + 1}. {question.question_content}
            </div>

            {strategy.render(question, {
              answerStr,
              onAnswerChange: (val) => handleAnswerChange(question.question_id, val),
            })}
          </Card>
        );
      })}
    </>
  );
}

export default QuestionList;
