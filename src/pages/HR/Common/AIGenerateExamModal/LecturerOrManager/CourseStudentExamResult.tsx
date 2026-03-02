import React, { useEffect } from 'react';
import {queryCourseSign} from "@/services/hr/hrTrainingPlan";
import {Avatar, Col, Drawer, Empty, List, Row, Skeleton, Space, Tag } from 'antd';
import studentPng from '@/assets/hr/student.png';
import {getTrainingClassQuizQuestion, getTrainingClassQuizStudentAnswer} from "@/services/hr/quizQuestion";
import {ConnectState} from "@/models/connect";
import { connect } from 'umi';


const ShowQuestionItem = (props: any) => {
  const { item, itemIndex, sysBasicDictList, answers } = props;

  const questionTypeObj = sysBasicDictList.find((sysItem: any) => sysItem.type === 'question_type' && sysItem.value === item.question_type);

  const findAnswerObj = answers.find(r => r.quiz_question_id === item.id);
  if (!questionTypeObj.label) {
    return (
      <span style={{color: 'orange'}}>数据库字典表未配置此题的类型</span>
    )
  }
  // class_course_id
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
          {findAnswerObj && (
            <div>
              考试回答：{findAnswerObj.user_answer}
              <div>
                {findAnswerObj.score_details && (
                  <span>
                    解析：{findAnswerObj.score_details || ''}
                  </span>
                )}
              </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  )
}


const DrawerItem = ({classCourseId, sysBasicDictList, selectedUser}: any) => {
  const [loading, setLoading] = React.useState(false);
  const [questions, setQuestions] = React.useState<any[]>([]);

  const [answers, setAnswers] = React.useState<any[]>([]);

  const fetchList = async () => {
    setLoading(true);
    const res = await getTrainingClassQuizQuestion({
      sort: 'id',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'class_course_id', Val: classCourseId, Operator: '='}
      ]),
    })
    const resAnswer = await getTrainingClassQuizStudentAnswer({
      user_code: selectedUser.user_code, // 当前考生的答案
      class_course_id: classCourseId,
    })
    setLoading(false);
    setAnswers(resAnswer.result || []);
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
    fetchList();
  }, [classCourseId]);

  return (
    <div style={{marginTop: 16}}>
      <Skeleton loading={loading} >
        {questions.length > 0 ? (
          <>
            {questions.map((item: any, itemIndex:number) => {
              return (
                <ShowQuestionItem
                  sysBasicDictList={sysBasicDictList}
                  item={item}
                  answers={answers}
                  itemIndex={itemIndex}
                />
              )
            })}
          </>
        ) : (
          <Empty description={'暂无数据'}/>
        )}
      </Skeleton>
    </div>
  )
}

const CourseStudentExamResult = (props: any) => {

  const { classCourseId, selectedRecord, sysBasicDictList, } = props;
  const [list, setList] = React.useState<any[]>([])
  const [visible, setVisible] = React.useState<boolean>(false)
  const [selectedUser, setSelectedUser] = React.useState<Record<string, string>>({});

  const fetchList = async () => {
    const res = await queryCourseSign({
      sort: 'id',
      order: 'asc',
      class_course_id: classCourseId,
      class_id: selectedRecord.id,
      filter: JSON.stringify([
        {Key: 'sign_status', Val: 'signed', Operator: '='}
      ]),
    })
    setList(res.rows);
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={list}
        renderItem={item => (
          <List.Item
            actions={[<>
              <div>
                <div>
                  <strong style={{fontSize: 18}}>
                    得分：{item.total_score || 0}
                  </strong>
                </div>
                <div>
                  <Space>
                    <Tag color="green">{item.exam_status_str}</Tag>
                    <a onClick={() => {
                      setSelectedUser(item);
                      setVisible(true);
                    }}>成绩详情 &gt;&gt;</a>
                  </Space>
                </div>
              </div>
            </>]}
          >
            <List.Item.Meta
              avatar={<Avatar src={studentPng} />}
              title={<strong>{item.user_name}</strong>}
              description={`用户编码: ${item.user_code}`}
            />
          </List.Item>
        )}
      />
      {visible && selectedUser && (
        <Drawer
          title={`成绩（考生：${selectedUser.user_name}）`}
          width={'70%'}
          placement="right"
          onClose={() => setVisible(false)}
          open={visible}
        >
          <DrawerItem selectedUser={selectedUser} classCourseId={classCourseId} sysBasicDictList={sysBasicDictList}/>
        </Drawer>
      )}
    </>
  )
}

export default connect(({common}: ConnectState) => ({
  sysBasicDictList: common.sysBasicDictList,
}))(CourseStudentExamResult);
