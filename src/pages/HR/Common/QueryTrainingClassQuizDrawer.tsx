import {Badge, Button, Col, Drawer, Empty, InputNumber, message, Modal, Row, Skeleton } from 'antd';
import React, { useEffect } from 'react';
import {
  addQuizQuestionSortAndScore, getClassCourseStartTestStatus,
  getTrainingClassQuizQuestion,
  updateStartTestStatus
} from "@/services/hr/quizQuestion";
import type {ConnectState} from "@/models/connect";
import { connect } from 'umi';

const QuestionItem = (props: any) => {
  const { item, itemIndex, sysBasicDictList } = props;
  const questionTypeObj = sysBasicDictList.find((sysItem: any) => sysItem.type === 'question_type' && sysItem.value === item.question_type);

  if (!questionTypeObj.label) {
    return (
      <span style={{color: 'orange'}}>数据库字典表未配置此题的类型</span>
    )
  }

  return (
    <div style={{marginBottom: 8}}>
      <Row gutter={16}>
        <Col span={18}>
          <p><strong>第{itemIndex + 1}题: {item.question_content}</strong> ({questionTypeObj.label})</p>
          <div style={{paddingLeft: 8}}>
            {item.newOptions && item.newOptions.length > 0 && (
              <>
                {item.newOptions.map((op: any, opIndex: number) => {
                  if (Number(op.is_correct) === 1) {
                    return (
                      <div style={{color: 'blue'}}>选项{op.option_label}{op.option_content}</div>
                    )
                  }
                  return (
                    <div>选项{op.option_label}{op.option_content}</div>
                  )
                })}
              </>
            )}
            {!item.options && (
              <div style={{color: 'blue'}}>
                答案：{item.answer}
              </div>
            )}
          </div>
        </Col>
        <Col span={6}>
          <InputNumber style={{width: 88}} defaultValue={item.max_score} addonAfter="分" placeholder={'分数'} onChange={async (value: any) => {
            const _value = value || 0;
            const res = await addQuizQuestionSortAndScore({
              id: item.id,
              max_score: _value,
              sort_order: itemIndex,
            })
            if(res.errCode === 0) {
              Object.assign(item, {
                max_score: _value,
              })
            }
          }} min={0} max={100}/>
        </Col>
      </Row>
    </div>
  )
}

/**
 * 查看AI出题的详情
 * @param props
 * @constructor
 */
const QueryTrainingClassQuizDrawer = (props: any) => {
  const { updateKey = 0, classCourseId, sysBasicDictList } = props;
  const [drawVisible, setDrawVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [isStart, setIsStart] = React.useState(0);

  const fetchIsStart = async () => {
    const res = await getClassCourseStartTestStatus({
      class_course_id: classCourseId
    })
    if (res.result) {
      setIsStart(res.result.start_test_status);
    }
  }

  useEffect(() => {
    fetchIsStart();
  }, [classCourseId]);

  const fetchList = async () => {
    setLoading(true);
    const res = await getTrainingClassQuizQuestion({
      sort: 'id',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'class_course_id', Val: classCourseId, Operator: '='}
      ]),
    })
    setLoading(false);
    if (res.rows.length > 0) {
      res.rows.forEach((row: any) => {
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
    fetchList()
  }, [updateKey, drawVisible]);

  return (
    <>
      <Badge count={questions.length}>
        <Button onClick={() => {
          setDrawVisible(true);
        }}>查看/发布随堂测题</Button>
      </Badge>
      {drawVisible && (
        <Drawer
          width={'60%'}
          title={(
            <Row justify={'space-between'}>
              <Col>
                <strong style={{fontSize: 18}}>查看/发布随堂测试题</strong>
              </Col>
              <Col>
                <Button
                  disabled={isStart === 1}
                  type={'primary'}
                  onClick={async () => {
                    let totalScore = 0;
                    questions.forEach((question: any) => {
                      totalScore += question.max_score || 0;
                    })
                    if (totalScore === 0) {
                      message.warn('需要设置每一题的分数才能发布');
                      return;
                    }
                    if (totalScore !== 100) {
                      message.warn('考题总分不是100分 无法发布');
                      return;
                    }
                    const res = await updateStartTestStatus({
                      start_test_status: '1',
                      class_course_id: classCourseId
                    })
                    if (res.errCode === 0) {
                      fetchIsStart();
                      Modal.info({
                        title: '发布随堂考题',
                        content: '已发布随堂考题，可让考试点击 进入随堂测试 进行考试',
                      });
                    }
                  }}
                >
                  {isStart === 1 ? '已发布' : '发布'}
                </Button>
              </Col>
            </Row>
          )}
          placement="right"
          onClose={() => setDrawVisible(false)} open={drawVisible}
        >
          <Skeleton loading={loading} >
            {questions.length > 0 ? (
              <>
                {questions.map((item: any, itemIndex:number) => {
                  return (
                    <QuestionItem  sysBasicDictList={sysBasicDictList} item={item} itemIndex={itemIndex} />
                  )
                })}
              </>
            ) : (
              <Empty description={'暂无数据'}/>
            )}
          </Skeleton>
        </Drawer>
      )}
    </>
  )
}

export default connect(({ common }: ConnectState) => ({
  sysBasicDictList: common.sysBasicDictList
}))(QueryTrainingClassQuizDrawer);
