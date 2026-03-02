import React from 'react';
import {generateClassQuizQuestion} from "@/services/hr/quizQuestion";
import QueryTrainingClassQuizDrawer from "@/pages/HR/Common/QueryTrainingClassQuizDrawer";
import {Button, Drawer, Empty, Form, InputNumber, Skeleton, Space } from 'antd';
import QuestionItem from "./QuestionItem";
import ShowOnlyOfficeInfo from "@/pages/HR/Common/ShowOnlyOfficeInfo";

const MaterialItem = (props: any) => {

  const { classId, selectedMaterialItem, sysBasicDictList } = props;
  const [commitLoading, setCommitLoading] = React.useState(false);
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [updateKey, setUpdateKey] = React.useState(0);
  return (
    <>
      <div>
        {selectedMaterialItem.node_type === 'grade' && (
          <Form
            layout={'inline'}
            initialValues={{}}
            onFinish={async (values: any) => {
              setCommitLoading(true);
              const res = await generateClassQuizQuestion({
                ...values,
                material_id: selectedMaterialItem.materialId,
              })
              setCommitLoading(false);
              if(res.result && res.result.questions && res.result.questions.length > 0) {
                setQuestions(res.result.questions)
              }
            }}
          >
            <Form.Item name="single_count" label="单选题数量" rules={[{ required: true, message: '必填项' }]}>
              <InputNumber placeholder="请填写生成的单选题数量" min={0} max={5} />
            </Form.Item>
            <Form.Item name="judge_count" label="判断题数量" rules={[{ required: true, message: '必填项' }]}>
              <InputNumber placeholder="请填写生成的判断题数量" min={0} max={5} />
            </Form.Item>
            <Form.Item name="other_count" label="简答题数量" rules={[{ required: true, message: '必填项' }]}>
              <InputNumber placeholder="请填写生成的简答题数量" min={0} max={5} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button loading={commitLoading} type="primary" htmlType="submit">生成考题</Button>
                <QueryTrainingClassQuizDrawer
                  updateKey={updateKey}
                  classCourseId={selectedMaterialItem.classCourseId}
                />
              </Space>
            </Form.Item>
          </Form>
        )}
      </div>
      <div style={{marginTop: 16}}>
        <Skeleton loading={commitLoading} >
          {questions.length > 0 ? (
            <>
              {questions.map((item: any, itemIndex:number) => {
                return (
                  <QuestionItem
                    classId={classId}
                    selectedMaterialItem={selectedMaterialItem}
                    sysBasicDictList={sysBasicDictList}
                    item={item}
                    itemIndex={itemIndex}
                    callback={() => {
                      setUpdateKey(Math.random())
                    }}
                  />
                )
              })}
            </>
          ) : (
            <Empty description={'暂无数据'}/>
          )}
        </Skeleton>
      </div>
    </>
  )
}

export default MaterialItem;
