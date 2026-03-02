import React, { useEffect } from 'react';
import QuestionList from "@/pages/HR/Common/QuestionList";
import { Alert, Button, Empty, message, Modal, Skeleton } from 'antd';
import {
  calculateScore,
  getTrainingClassQuizQuestionNoAnswer,
  getUserSignExamStatus,
  updateExamStatus
} from "@/services/hr/quizQuestion";
import LecturerRate from "@/pages/HR/Common/AIGenerateExamModal/ShowTrainPartInfo/LecturerRate";

const TrainExamQuestion = (props: any) => {

  const { sysBasicDictList, selectedMaterialItem } = props;
  const userCode = localStorage.getItem('auth-default-userCode');

  const [questions, setQuestions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [initLoading, setInitLoading] = React.useState(false);
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [submitting, setSubmitting] = React.useState(false);
  // 0 未开始，1 进行中，2 已结束
  const [examStatus, setExamStatus] = React.useState<number>(0)
  /**
   * 查询考试状态
   */
  const fetchExamStatus = async () => {
    setInitLoading(true);
    const res = await getUserSignExamStatus({
      class_course_id: selectedMaterialItem.classCourseId,
    })
    const _examStatus = (res.result && res.result.exam_status) ? res.result.exam_status : 0;
    // 未开始考试的状态，弹窗确定是否开始考试
    if(_examStatus === 0) {
      const res = await updateExamStatus({
        class_course_id: selectedMaterialItem.classCourseId,
        exam_status: '1',
        user_code: userCode,
      })
      if (res.errCode === 0) {
        setExamStatus(1)
        fetchQuestions()
      }
    }
    // 考试中 也加载考题
    if (_examStatus === 1) {
      fetchQuestions()
    }
    setInitLoading(false);
    setExamStatus(_examStatus);
  }

  const fetchQuestions = async () => {
    setLoading(true);
    const res = await getTrainingClassQuizQuestionNoAnswer({
      sort: 'id',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'class_course_id', Val: selectedMaterialItem.classCourseId, Operator: '='}
      ]),
    })
    setLoading(false);
    if (res.rows.length > 0) {
      res.rows.forEach((row: any) => {
        Object.assign(row, {
          question_id: row.id, // 这里AS出一个字段来，可以用之前的写的代码了
        })
        if (row.options) {
          try {
            const parse = JSON.parse(row.options);
            Object.assign(row, {
              newOptions: parse,
            });
          } catch (e) {
            Object.assign(row, {
              newOptions: [],
            });
          }
        } else {
          Object.assign(row, {
            newOptions: [],
          });
        }
      })
    }
    setQuestions(res.rows || [])
  }

  useEffect(() => {
    fetchExamStatus();
  }, []);

  const submitExam = async () => {
    try {
      setSubmitting(true)
      const res = await calculateScore({
        class_course_id: selectedMaterialItem.classCourseId,
        user_code: userCode,
      })
      if (res.errCode === 0) {
        fetchExamStatus()
        Modal.success({
          title: "提交成功",
          content: "提交成功，等待讲师评分，可对讲师进行课程打分",
          onOk: () => {

          }
        })
      }
    } catch (error) {
      message.error("提交失败，请重试")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async () => {
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

  return (
    <div>
      <Alert type={'info'} message={'请选择左侧的课程资料'} action={Number(examStatus) === 1 && <Button
        type="primary"
        onClick={handleSubmit}
        loading={submitting}
      >
        提交答卷
      </Button>}/>
      <Skeleton loading={initLoading} style={{marginTop: 8}}>
        {/* 未开始考试 */}
        {Number(examStatus) === 0 && (
          <div style={{ marginTop: '10px' }}>
            <Alert type-={'warning'} message={'随堂题已发布，开始进入考试吧'} action={<Button
              onClick={async () => {
                const res = await updateExamStatus({
                  class_course_id: selectedMaterialItem.classCourseId,
                  exam_status: '1',
                  user_code: userCode,
                })
                if (res.errCode === 0) {
                  setExamStatus(1)
                  fetchQuestions()
                }
              }}
            >
              开始考试
            </Button>}/>
            <Empty description={'暂无数据'}/>
          </div>
        )}
        {/* 考试中 */}
        {Number(examStatus) === 1 && (
          <Skeleton loading={loading} >
            {questions.length > 0 ? (
              <>
                <QuestionList
                  classCourseId={selectedMaterialItem.classCourseId}
                  questions={questions} sysBasicDictList={sysBasicDictList}
                  commitAnswers={(_answers: Record<string, string>) => {
                    setAnswers(_answers)
                  }}
                />
              </>
            ) : (
              <Empty description={'暂无数据'}/>
            )}
          </Skeleton>
        )}
        {/*{ 考试结束，去评分 }*/}
        {Number(examStatus) === 2 && (
          <div style={{ marginTop: '16px' }}>
            <LecturerRate selectedMaterialItem={selectedMaterialItem}/>
          </div>
        )}
      </Skeleton>
    </div>
  )
}
export default TrainExamQuestion;
