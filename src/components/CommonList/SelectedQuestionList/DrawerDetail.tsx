import {queryWorkTypeTree} from "@/services/hr/hrCourse";
import {buildTree} from "@/utils/utils";
import {deepArr} from "@/utils/utils-array";
import {configColumns} from "@/pages/HR/ExamQuestion/columns";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import React, {useEffect, useRef, useState } from 'react';
import {Button, Drawer, Col, Empty, Input, Modal, Row, Space, Tree, message, Popconfirm, Form} from "antd";
import { BasicTableColumns } from 'yayang-ui';
import { DownOutlined } from '@ant-design/icons';
import {QuestionItem} from "@/pages/HR/exam";
import {addExamQuestion, deleteExamQuestion, updateExamQuestion} from "@/services/hr/exam";
import {ErrorCode} from "@/common/const";
import {Edit, Trash2 } from "lucide-react";
import AddAndEditModal from "@/pages/HR/ExamQuestion/AddAndEditModal";

const DrawerDetail = (props: any) => {
  const { onChange } = props;

  const actionRef: any = useRef();

  const [selectedKeys, setSelectedKeys] = useState<string[]>(['all']);
  const [selectedTreeInfo, setSelectedTreeInfo] = useState<any>(null);

  const [questionModalVisible, setQuestionModalVisible] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null)
  const [questionForm] = Form.useForm();


  const [treeData, setTreeData] = useState<any[]>([
    {
      title: '全部',
      key: 'all',
      children: []
    }
  ]);

  const fetchTree = async () => {
    const res = await queryWorkTypeTree({
      sort: 'id',
      order: 'asc'
    })
    const treeList = buildTree(res.result || []);
    const deepCloneTreeDate = deepArr(treeData);
    deepCloneTreeDate[0].children = treeList;
    setTreeData(deepCloneTreeDate);
  }

  useEffect(() => {
    fetchTree();
  }, [])

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "question_type",
      "question_content",
      "module_name",
      "grade_name",
      {
        title: "操作",
        subTitle: "操作",
        dataIndex: "operate",
        align: "center",
        width: 150,
        fixed: "right",
        render: (_, record) => (
          <Space size="small">
            <Button type="link" size="small" icon={<Edit size={16} />} onClick={() => handleEditQuestion(record)}>
              编辑
            </Button>
            <Popconfirm
              title="确定删除此题目吗？"
              onConfirm={() => handleDeleteQuestion(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger size="small" icon={<Trash2 size={16} />}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ])
      .needToFixed([
        {value: 'operate', fixed: 'right'},
      ])
      .needToExport([

      ])
    return cols.getNeedColumns();
  }


  const handleAddQuestion = () => {
    setEditingQuestion(null)
    questionForm.resetFields()
    questionForm.setFieldsValue({
      question_type: "single",
      score: 5,
      personnel_type: "",
      options: [
        { option_label: "A", option_content: "" },
        { option_label: "B", option_content: "" },
        { option_label: "C", option_content: "" },
        { option_label: "D", option_content: "" },
      ],
    })
    setQuestionModalVisible(true)
  }

  const handleEditQuestion = (question: QuestionItem) => {
    console.log('handleEditQuestion---', question)
    setEditingQuestion(question)
    questionForm.setFieldsValue(question)
    setQuestionModalVisible(true)
  }

  const handleDeleteQuestion = async (questionId: string) => {
    const res = await deleteExamQuestion({
      id: questionId,
    })
    if (res.errCode === ErrorCode.ErrOk) {
      message.success("删除成功");
      actionRef.current.reloadTable();
    }
  }

  const handleSaveQuestion = async (selectedTreeInfo: any) => {
    try {
      const values = await questionForm.validateFields();
      console.log(values, "values");
      const correctStr = Array.isArray(values.correct_answer) ? values.correct_answer.join(',') : values.correct_answer;

      const savedQuestion: QuestionItem = {
        ...values,
        options:
          values.question_type !== "judge"
            ? values.options?.map((opt: any, idx: number) => ({
              question_id: editingQuestion ? editingQuestion.question_id : null,
              option_label: opt.option_label,
              option_content: opt.option_content,
              sort_order: idx + 1,
              is_correct: correctStr.indexOf(opt.option_label) > -1 ? 1 : 0
            }))
            : undefined,
        created_at: new Date().toISOString(),
      };

      if (editingQuestion) {
        const res = await updateExamQuestion({
          question_id: editingQuestion.question_id,
          question_type: savedQuestion.question_type,
          question_content: savedQuestion.question_content,
          module_code: selectedTreeInfo.parentNode.expand_id,
          grade: selectedTreeInfo.expand_id,

          answer: savedQuestion.correct_answer,
          options: JSON.stringify(savedQuestion.options),
          // score: savedQuestion.score,
          // sort_order: getSortOrder(values.question_type),
        })
        if (res.errCode === ErrorCode.ErrOk) {
          message.success('更新成功');
          actionRef.current.reloadTable();
        }
      } else {
        const payload = {
          question_type: savedQuestion.question_type,
          question_content: savedQuestion.question_content,
          module_code: selectedTreeInfo.parentNode.expand_id,
          grade: selectedTreeInfo.expand_id,

          answer: savedQuestion.correct_answer,
          options: JSON.stringify(savedQuestion.options),
          // score: savedQuestion.score,
          // sort_order: getSortOrder(values.question_type),
        };

        const res = await addExamQuestion(payload)
        if (res.errCode === ErrorCode.ErrOk) {
          message.success('创建成功');
          actionRef.current.reloadTable();
        }
      }
      // message.success(editingQuestion ? "更新成功" : "创建成功")
      setQuestionModalVisible(false)
    } catch (error) {
      console.error("Validation failed:", error)
    }
  }

  const showWarnModal = () => {
    Modal.warning({
      title: '课程选择',
      content: '新增需要指定具体的课程分类，请选择左侧要新增的课程分类，比如：社会保险',
      okText: '知道了',
    })
  }



  const onSelect = (_selectedKeys: string[], info: any) => {
    console.log('selected', _selectedKeys, info);
    setSelectedKeys(_selectedKeys);
    setSelectedTreeInfo(info.node);
  };


  return (
    <div>
      <Row gutter={8}>
        <Col span={5}>
          {treeData[0].children.length > 0 ? (
            <div style={{paddingTop: 10, paddingLeft: 8}}>
              <Input.Search style={{ marginBottom: 8 }} placeholder="输入分类名称搜索" />
              <div style={{height: 'calc(100vh - 200px)', overflowY: 'scroll'}}>
                <Tree
                  showLine
                  switcherIcon={<DownOutlined />}
                  defaultExpandedKeys={['all', `${treeData[0].children[0].id}`]}
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
        <Col span={19}>
          <BaseCurdSingleTable
            cRef={actionRef}
            rowKey="id"
            tableTitle='题库管理'
            type="examQuestion/getExamQuestion"
            importType="examQuestion/getExamQuestion"
            tableColumns={getTableColumns()}
            funcCode={'题库管理2123'}
            tableSortOrder={{ sort: 'create_ts', order: 'desc' }}
            buttonToolbar={() => {
              return [
                <Button type="primary"  onClick={handleAddQuestion}>
                  新增题目
                </Button>
              ]
            }}
            rowSelection={{
              type: 'radio',
              callback: (keys: string[], rows: any[]) => {
                if (rows.length > 0) {
                  if (onChange) onChange(rows[0])
                }
              }
            }}
            selectedRowsToolbar={() => {
              return []
            }}
          />
        </Col>
      </Row>
      {questionModalVisible && (
        <AddAndEditModal
          editingQuestion={editingQuestion}
          questionModalVisible={questionModalVisible}
          onCancel={() => setQuestionModalVisible(false)}
          handleSaveQuestion={handleSaveQuestion}
          questionForm={questionForm}
        />
      )}
    </div>
  )
}

export default DrawerDetail;
