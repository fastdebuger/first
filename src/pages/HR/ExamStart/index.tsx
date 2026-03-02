import { useState, useEffect, useCallback, Suspense } from "react"
import { Card, Radio, Checkbox, Button, Modal, Progress, Space, Tag, Spin, message } from "antd"
import { Clock, FileText, AlertCircle, CheckCircle2, Send } from "lucide-react"
import type { Question, ExamPaper } from "../exam";
import {useParams, history} from 'umi';
import moment from 'moment';
import {
  queryExamPaperInfo,
  queryExamPaperQuestions,
  queryExamRecordUserAnswer,
  saveEveryQuestionAnswer, submitExamPaper
} from "@/services/hr/exam";
import {ErrorCode} from "@/common/const";

/**
 * 按 question_id 分组，将选项聚合到 options 数组中
 * @param {Array} data - 原始数据数组
 * @returns {Array} 分组后的结果数组
 */
function groupByQuestionId(data: any[]) {
  // 用对象暂存分组，键为 question_id
  const groupMap: any = {};

  data.forEach(item => {
    const { question_id } = item;

    // 提取题目公共属性（同一 question_id 共享的属性）
    const questionInfo = {
      paper_id: item.paper_id,
      question_id: item.question_id,
      score_override: item.score_override,
      sort_order: item.sort_order,
      question_type: item.question_type,
      question_content: item.question_content
    };

    // 提取选项单独属性
    const option = {
      option_id: item.option_id,
      option_label: item.option_label,
      option_content: item.option_content,
      RowNumber: item.RowNumber
    };

    // 首次遇到该 question_id 时，初始化分组
    if (!groupMap[question_id]) {
      groupMap[question_id] = { ...questionInfo, options: [option] };
    } else {
      // 已存在分组，直接追加选项
      groupMap[question_id].options.push(option);
    }
  });

  // 将对象的值转为数组，即最终结果
  return Object.values(groupMap);
}

function ExamTakingContent() {
  // const router = useRouter()
  // const searchParams = useSearchParams()
  const { recordId: _recordId, paperId } = useParams<{recordId: string, paperId: string}>(); // "123"

  console.log('--123123')
  const [loading, setLoading] = useState(true)
  const [paper, setPaper] = useState<ExamPaper | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [remainingTime, setRemainingTime] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const fetchExamRecordUserAnswer = async () => {
    const res = await queryExamRecordUserAnswer({
      sort: 'record_id',
      order: 'asc',
      recordId: _recordId,
    })
    if (res.rows.length > 0) {
      const _answer: any = {};
      res.rows.forEach((item: any) => {
        _answer[item.question_id] = item.user_answer;
      })
      setAnswers({..._answer});
    }
  }

  const fetchInitData = async () => {
    setLoading(true);
    const res = await queryExamPaperInfo({
      sort: 'record_id',
      order: 'desc',
      recordId: _recordId,
    })
    const resQues = await queryExamPaperQuestions({
      sort: 'paper_id',
      order: 'asc',
      paperId: paperId,
    })
    fetchExamRecordUserAnswer();
    setLoading(false);
    if (resQues.rows.length > 0) {
      const result: any[] = groupByQuestionId(resQues.rows)
      setQuestions(result || []);
    }
    if (res.rows.length > 0) {
      const exam_duration_min = Number(res.rows[0].exam_duration_min || 0); // 总共考试时长
      const exam_start_time = Number(res.rows[0].exam_start_time || 0); // 考试开始时间
      const currentTime = moment().unix(); //当前时间的时间戳
      const cha = (exam_duration_min * 60) - (currentTime - exam_start_time);
      if (cha <= 0) {
        handleAutoSubmit()
      }
      setRemainingTime(cha < 0 ? 0 : cha);
      setPaper(res.rows[0]);
    }
  }


  useEffect(() => {
    if (_recordId) {
      fetchInitData()
    }
  }, [_recordId, paperId])

  // 倒计时
  useEffect(() => {
    if (remainingTime <= 0) return

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          // 时间到，自动提交
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [remainingTime])


  const handleAnswerChange = async (questionId: string, answer: string | string[]) => {
    const answerStr = Array.isArray(answer) ? answer.sort().join(",") : answer
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerStr,
    }))
    console.log("recordId", _recordId, questionId, answerStr);
    const res = await saveEveryQuestionAnswer({
      record_id: _recordId,
      question_id: questionId,
      user_answer: answerStr,
    })
    console.log(res)
  }


  const handleAutoSubmit = useCallback(() => {
    Modal.warning({
      title: "考试时间已到",
      content: "请提交您的答卷, 如果不提交，则得分为0",
      okText: "提交答卷",
      onOk: () => submitExam(),
    })
  }, [])

  const handleSubmit = () => {
    const unansweredCount = questions.length - Object.keys(answers).length

    if (unansweredCount > 0) {
      Modal.confirm({
        title: "确认提交",
        content: `您还有 ${unansweredCount} 道题未作答，确定要提交吗？`,
        okText: "确定提交",
        cancelText: "继续答题",
        onOk: () => {
          submitExam()
        },
      })
    } else {
      Modal.confirm({
        title: "确认提交",
        content: "确定要提交答卷吗？提交后将无法修改。",
        okText: "确定提交",
        cancelText: "再检查一下",
        onOk: () => {
          submitExam()
        },
      })
    }
  }

  const submitExam = async () => {
    try {
      setSubmitting(true)
      const res = await submitExamPaper({
        record_id: _recordId,
        end_time: moment().unix(),
      })
      if (res.errCode === ErrorCode.ErrOk) {
        // 显示结果
        Modal.success({
          title: "考试完成",
          content: "您可返回上一页，查看考试结果",
          // content: (
          //   <div style={{ padding: "20px 0" }}>
          //     <div style={{ fontSize: "16px", marginBottom: "12px" }}>您的得分：</div>
          //     <div style={{ fontSize: "32px", fontWeight: "bold", color: "#52c41a", marginBottom: "12px" }}>
          //       totalScore 分
          //     </div>
          //     <div style={{ fontSize: "14px", color: "#666" }}>
          //       totalScore  (paper?.pass_score || 60) ? "恭喜您通过考试！" : "很遗憾，您未通过考试。"
          //     </div>
          //   </div>
          // ),
          onOk: () => {
            history.goBack();
          }
        })
      }
    } catch (error) {
      message.error("提交失败，请重试")
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  const getProgressPercent = () => {
    return Math.round((getAnsweredCount() / questions.length) * 100)
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#f0f2f5",
        }}
      >
        <Spin size="large" tip="加载考试中..." />
      </div>
    )
  }

  return (
    <div style={{ background: "#f0f2f5"}}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* 顶部信息栏 */}
        <Card
          style={{
            marginBottom: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FileText size={24} color="#1890ff" />
              <div>
                <div style={{ fontSize: "18px", fontWeight: 600 }}>
                  {paper?.personal_type_name} -{paper?.group_name || '(通用版)'} {paper?.paper_name}
                </div>
                <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
                  总分：{paper?.total_score} 分 | 及格分：{paper?.pass_score} 分
                </div>
              </div>
            </div>

            <Space size="large">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>答题进度</div>
                <Progress
                  type="circle"
                  percent={getProgressPercent()}
                  width={60}
                  format={() => `${getAnsweredCount()}/${questions.length}`}
                />
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>剩余时间</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: remainingTime < 300 ? "#ff4d4f" : "#1890ff",
                  }}
                >
                  <Clock size={20} />
                  {formatTime(remainingTime)}
                </div>
              </div>

              <Button type="primary" size="large" icon={<Send size={18} />} onClick={handleSubmit} loading={submitting}>
                提交答卷
              </Button>
            </Space>
          </div>
        </Card>

        {/* 题目列表 */}
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {questions.map((question, index) => (
            <Card
              key={question.question_id}
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                borderLeft: answers[question.question_id] ? "4px solid #52c41a" : "4px solid #d9d9d9",
              }}
            >
              <div style={{ marginBottom: "16px" }}>
                <Space>
                  <Tag
                    color={
                      question.question_type === "single"
                        ? "blue"
                        : question.question_type === "multiple"
                          ? "purple"
                          : "orange"
                    }
                  >
                    {question.question_type === "single"
                      ? "单选题"
                      : question.question_type === "multiple"
                        ? "多选题"
                        : "判断题"}
                  </Tag>
                  <Tag color="green">{question.score_override} 分</Tag>
                  {answers[question.question_id] && (
                    <Tag icon={<CheckCircle2 size={14} />} color="success">
                      已答
                    </Tag>
                  )}
                </Space>
              </div>

              <div style={{ fontSize: "16px", fontWeight: 500, marginBottom: "20px", lineHeight: "1.6" }}>
                {index + 1}. {question.question_content}
              </div>

              {question.question_type === "judge" ? (
                <Radio.Group
                  value={answers[question.question_id]}
                  onChange={(e) => handleAnswerChange(question.question_id, e.target.value)}
                  style={{ width: "100%" }}
                >
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Radio
                      value="正确"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #d9d9d9",
                        borderRadius: "8px",
                        marginLeft: 0,
                      }}
                    >
                      <span style={{ fontSize: "15px" }}>正确</span>
                    </Radio>
                    <Radio
                      value="错误"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #d9d9d9",
                        borderRadius: "8px",
                        marginLeft: 0,
                      }}
                    >
                      <span style={{ fontSize: "15px" }}>错误</span>
                    </Radio>
                  </Space>
                </Radio.Group>
              ) : question.question_type === "single" ? (
                <Radio.Group
                  value={answers[question.question_id]}
                  onChange={(e) => handleAnswerChange(question.question_id, e.target.value)}
                  style={{ width: "100%" }}
                >
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    {question.options?.map((option) => (
                      <Radio
                        key={option.option_id}
                        value={option.option_label}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1px solid #d9d9d9",
                          borderRadius: "8px",
                          marginLeft: 0,
                        }}
                      >
                        <span style={{ fontSize: "15px" }}>
                          {option.option_label}. {option.option_content}
                        </span>
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              ) : (
                <Checkbox.Group
                  value={answers[question.question_id]?.split(",") || []}
                  onChange={(values) => handleAnswerChange(question.question_id, values as string[])}
                  style={{ width: "100%" }}
                >
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    {question.options?.map((option) => (
                      <Checkbox
                        key={option.option_id}
                        value={option.option_label}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1px solid #d9d9d9",
                          borderRadius: "8px",
                          marginLeft: 0,
                        }}
                      >
                        <span style={{ fontSize: "15px" }}>
                          {option.option_label}. {option.option_content}
                        </span>
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              )}
            </Card>
          ))}
        </Space>

        {/* 底部提交按钮 */}
        <Card style={{ marginTop: "20px", textAlign: "center" }}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "#666" }}>
              <AlertCircle size={16} />
              <span>请仔细检查答案，提交后将无法修改</span>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<Send size={18} />}
              onClick={handleSubmit}
              loading={submitting}
              style={{ minWidth: "200px" }}
            >
              提交答卷
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  )
}

export default function ExamTakingPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          <Spin size="large" />
        </div>
      }
    >
      <ExamTakingContent />
    </Suspense>
  )
}
