import { useState, useEffect } from "react"
import {
  Row,
  Col,
  Button,
  Modal,
  Space,
  Form,
  Input,
  Select,
  InputNumber,
  Radio,
  Checkbox,
  Skeleton,
  Tree,
  Empty,
  Alert,
} from "antd"
import {
  Plus,
  Trash2,
} from "lucide-react"
import {queryExamQuestionOptions} from "@/services/hr/exam";
import { queryExamModuleInfo } from '@/services/hr/exam';
import {queryWorkTypeTree} from "@/services/hr/hrCourse";
import { buildTreeAndParent } from "@/utils/utils";
import {deepArr} from "@/utils/utils-array";
import { DownOutlined } from "@ant-design/icons";

const { TextArea } = Input
const { Option } = Select

const AddAndEditModal = (props: any) => {

  const { questionForm, editingQuestion, questionModalVisible, onCancel, handleSaveQuestion } = props;

  const [treeData, setTreeData] = useState<any[]>([
    {
      title: '全部',
      key: 'all',
      children: []
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['all']);
  const [selectedTreeInfo, setSelectedTreeInfo] = useState<any>(null);

  const watchQuestionType = Form.useWatch( 'question_type', questionForm)
  const watchOptions = Form.useWatch( 'options', questionForm)

  const fetchTree = async () => {
    const res = await queryWorkTypeTree({
      sort: 'id',
      order: 'asc'
    })
    const treeList = buildTreeAndParent(res.result || []);
    const deepCloneTreeDate = deepArr(treeData);
    deepCloneTreeDate[0].children = treeList;
    setTreeData(deepCloneTreeDate);
  }

  useEffect(() => {
    fetchTree();
  }, [])

  const fetchInitData = async()=> {
    setLoading(true);

    // 是编辑考题，需要查询选项信息
    if(editingQuestion) {
      const resOptions = await queryExamQuestionOptions({
        sort: 'sort_order',
        order: 'asc',
        filter: JSON.stringify([
          {"Key":"question_id","Val": editingQuestion.question_id,"Operator":"="}
        ])
      })
      // setOptions(resOptions)
      const options: any[] = resOptions.rows || [];
      let correctAnswers: any = null;
      const filterArr = options.filter(r => r.is_correct).map(r => r.option_label);
      if(editingQuestion.question_type === 'single') {
        correctAnswers = filterArr[0];
      } else if (editingQuestion.question_type === 'multiple') {
        correctAnswers = filterArr
      } else if (editingQuestion.question_type === 'judge') {
        correctAnswers = filterArr[0];
      }

      console.log('correctAnswers----', correctAnswers);

      questionForm.setFieldsValue({
        options,
        correct_answer: correctAnswers
      })
      setLoading(false);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchInitData();
  }, [])

  useEffect(() => {
    // 多选题 有几个选项 就几分，这样后面好统计
    if (watchQuestionType === 'multiple') {
      questionForm.setFieldsValue({
        score: (watchOptions && watchOptions.length) ? watchOptions.length : 0,
      })
    }
  }, [watchQuestionType, watchOptions]);

  const showWarnModal = () => {
    Modal.warning({
      title: '课程选择',
      content: '新增需要指定具体的课程分类，请选择左侧要新增的课程分类，比如：社会保险',
      okText: '知道了',
    })
  }

  const onSelect = (_selectedKeys: string[], info: any) => {
    console.log('selected', _selectedKeys, info);
    const record = info.node;
    console.log('-----record', record);

    if (record.children.length != 0) {
      showWarnModal();
      return;
    }
    setSelectedKeys(_selectedKeys);
    setSelectedTreeInfo(info.node);
  };

  return (
    <Modal
      title={editingQuestion ? "编辑题目" : "新增题目"}
      open={questionModalVisible}
      visible={questionModalVisible}
      onOk={() => handleSaveQuestion(selectedTreeInfo)}
      onCancel={onCancel}
      maskClosable={false}
      width={'80%'}
      okText="保存"
      cancelText="取消"
    >
      <Skeleton loading={loading}>
        <Row gutter={16}>
          <Col span={6}>
            {treeData[0].children.length > 0 ? (
              <div style={{paddingLeft: 8}}>
                <Input.Search style={{ marginBottom: 8 }} placeholder="输入分类名称搜索" />
                <div style={{height: 'calc(100vh - 200px)', overflowY: 'scroll'}}>
                  <Tree
                    showLine
                    switcherIcon={<DownOutlined />}
                    defaultExpandedKeys={['all', `${treeData[0].children[1].id}`]}
                    selectedKeys={selectedKeys}
                    onSelect={onSelect}
                    treeData={treeData}
                  />
                </div>
              </div>
            ) : (
              <Empty description={'未配置课程分类树信息'}/>
            )}
          </Col>
          <Col span={18}>
            <Alert type={'info'} message={`请选择左侧的课程分类, ${selectedTreeInfo ? `已选择课程：${selectedTreeInfo.full_path}` : ''}`} style={{marginBottom: 8}}/>
            <Form form={questionForm} layout="vertical">
              <Form.Item name="question_type" label="题目类型" rules={[{ required: true, message: "请选择题目类型" }]}>
                <Radio.Group disabled={!selectedTreeInfo}>
                  <Radio value="single">单选题</Radio>
                  {/*<Radio value="multiple">多选题</Radio>*/}
                  <Radio value="judge">判断题</Radio>
                  <Radio value="other">简答题</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item name="question_content" label="题目内容" rules={[{ required: true, message: "请输入题目内容" }]}>
                <TextArea disabled={!selectedTreeInfo} rows={3} placeholder="请输入题目内容" />
              </Form.Item>

              <Form.Item noStyle shouldUpdate={(prev, curr) => prev.question_type !== curr.question_type}>
                {({ getFieldValue }) => {
                  const questionType = getFieldValue("question_type")

                  if (questionType === "other") {
                    return (
                      <Form.Item
                        name="correct_answer"
                        label="答案标准"
                        rules={[{ required: true, message: "请输入答案标准" }]}
                      >
                        <TextArea disabled={!selectedTreeInfo} rows={3} placeholder="请输入答案标准" />
                      </Form.Item>
                    )
                  }

                  if (questionType === "judge") {
                    return (
                      <Form.Item
                        name="correct_answer"
                        label="正确答案"
                        rules={[{ required: true, message: "请选择正确答案" }]}
                      >
                        <Radio.Group  disabled={!selectedTreeInfo}>
                          <Radio value="正确">正确</Radio>
                          <Radio value="错误">错误</Radio>
                        </Radio.Group>
                      </Form.Item>
                    )
                  }

                  return (
                    <>
                      <Form.List name="options">
                        {(fields, { add, remove }) => (
                          <>
                            <div style={{ marginBottom: "8px", fontWeight: 500 }}>选项设置</div>
                            {fields.map((field, index) => (
                              <Space key={field.key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                                <Form.Item
                                  {...field}
                                  name={[field.name, "option_label"]}
                                  style={{ marginBottom: 0, width: "60px" }}
                                >
                                  <Input disabled />
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "option_content"]}
                                  rules={[{ required: true, message: "请输入选项内容" }]}
                                  style={{ marginBottom: 0, flex: 1 }}
                                >
                                  <Input  disabled={!selectedTreeInfo} style={{width: '300px'}} placeholder="请输入选项内容" />
                                </Form.Item>
                                {fields.length > 2 && (
                                  <Button
                                    type="link"
                                    danger
                                    icon={<Trash2 size={16} />}
                                    onClick={() => remove(field.name)}
                                  />
                                )}
                              </Space>
                            ))}
                            {fields.length < 6 && (
                              <Button
                                disabled={!selectedTreeInfo}
                                type="dashed"
                                onClick={() =>
                                  add({ option_label: String.fromCharCode(65 + fields.length), option_content: "" })
                                }
                                block
                                icon={<Plus size={16} />}
                              >
                                添加选项
                              </Button>
                            )}
                          </>
                        )}
                      </Form.List>

                      <Form.Item
                        name="correct_answer"
                        label="正确答案"
                        rules={[{ required: true, message: "请选择正确答案" }]}
                        style={{ marginTop: "16px" }}
                      >
                        {questionType === "multiple" ? (
                          <Checkbox.Group  disabled={!selectedTreeInfo}>
                            <Space direction="vertical">
                              <Checkbox value="A">A</Checkbox>
                              <Checkbox value="B">B</Checkbox>
                              <Checkbox value="C">C</Checkbox>
                              <Checkbox value="D">D</Checkbox>
                            </Space>
                          </Checkbox.Group>
                        ) : (
                          <Radio.Group  disabled={!selectedTreeInfo}>
                            <Space direction="vertical">
                              <Radio value="A">A</Radio>
                              <Radio value="B">B</Radio>
                              <Radio value="C">C</Radio>
                              <Radio value="D">D</Radio>
                            </Space>
                          </Radio.Group>
                        )}
                      </Form.Item>
                    </>
                  )
                }}
              </Form.Item>

              {/*<Form.Item name="max_score" label="分值" rules={[{ required: true, message: "请输入分值" }]}>
                <InputNumber
                  disabled={watchQuestionType === 'multiple'}
                  min={1} max={100} style={{ width: "100%" }}
                />
              </Form.Item>*/}
            </Form>
          </Col>
        </Row>
      </Skeleton>
    </Modal>
  )
}

export default AddAndEditModal;
