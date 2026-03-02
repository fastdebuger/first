import React from 'react';
import {QUESTION_OPTIONS} from "@/common/const";
import {addTrainingClassQuizQuestion} from "@/services/hr/quizQuestion";
import {Button, Col, message, Modal, Row } from 'antd';

const QuestionItem = (props: any) => {
  const { classId, callback, selectedMaterialItem, item, itemIndex, sysBasicDictList } = props;
  const [isCommit, setIsCommit] = React.useState(false);
  const questionTypeObj = sysBasicDictList.find((sysItem: any) => sysItem.type === 'question_type' && sysItem.label === item.type);

  if (!questionTypeObj.value) {
    return (
      <span style={{color: 'orange'}}>数据库字典表未配置此题的类型</span>
    )
  }
  // class_course_id
  return (
    <div style={{marginBottom: 8}}>
      <Row gutter={16}>
        <Col span={18}>
          <p><strong>第{itemIndex + 1}题: {item.question}</strong> ({item.type})</p>
          <div style={{paddingLeft: 8}}>
            {item.options && item.options.length > 0 && (
              <>
                {item.options.map((op: any, opIndex: number) => {
                  return (
                    <div>选项{QUESTION_OPTIONS[opIndex]}{op.replace(QUESTION_OPTIONS[opIndex], '')}</div>
                  )
                })}
              </>
            )}
            <div style={{color: 'blue'}}>
              答案：{item.answer}
            </div>
          </div>
        </Col>
        <Col span={6}>
          <Button disabled={isCommit} size={'small'} onClick={() => {
            Modal.confirm({
              title: '采纳此题',
              content: '确定采纳此题后，会保存为本课程的随堂测试题',
              okText: '确定',
              onOk: async () => {
                const optionList: any = [];
                if (item.options && item.options.length > 0) {
                  item.options.forEach((op, opIndex) => {
                    optionList.push({
                      option_label: QUESTION_OPTIONS[opIndex],
                      option_content: op.replace(`${QUESTION_OPTIONS[opIndex]}.`, ''),
                      is_correct: QUESTION_OPTIONS[opIndex] === item.answer ? 1 : 0
                    })
                  })
                }
                const payload = {
                  class_id: classId,
                  class_course_id: selectedMaterialItem.classCourseId,
                  course_id: selectedMaterialItem.courseId,
                  question_type: questionTypeObj.value,
                  question_content: item.question,
                  options: JSON.stringify(optionList),
                  answer: item.answer,
                  is_convert: 0,
                }
                const res = await addTrainingClassQuizQuestion({
                  ...payload,
                })
                if (res.errCode === 0) {
                  message.success('已加入本课程题库中')
                  setIsCommit(true);
                  callback()
                }
              }
            })
          }}>
            {isCommit ? '已采纳' : '采纳'}
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default QuestionItem;
