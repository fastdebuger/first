import { useState, useRef } from "react"
import {
  Button,
  Space,
  Form,
  message,
  Popconfirm,
} from "antd"
import {
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import {addExamQuestion, deleteExamQuestion, updateExamQuestion} from "@/services/hr/exam";
import AddAndEditModal from "./AddAndEditModal";
import {ErrorCode} from "@/common/const";
import { QuestionItem } from '../exam';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {configColumns} from "./columns";
import { BasicTableColumns } from "yayang-ui";


// 考题管理页面，用于管理题目池
const  ExamQuestion = ()=> {
  const [questionModalVisible, setQuestionModalVisible] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null)
  const [questionForm] = Form.useForm();

  const actionRef: any = useRef()

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

  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='题库管理'
        type="examQuestion/getExamQuestion"
        importType="examQuestion/getExamQuestion"
        tableColumns={getTableColumns()}
        funcCode={'题库管理123'}
        tableSortOrder={{ sort: 'create_ts', order: 'desc' }}
        buttonToolbar={() => {
          return [
            <Button type="primary" icon={<Plus size={16} />} onClick={handleAddQuestion}>
              新增题目
            </Button>
          ]
        }}
        selectedRowsToolbar={() => {
          return []
        }}
      />

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

export default ExamQuestion;
