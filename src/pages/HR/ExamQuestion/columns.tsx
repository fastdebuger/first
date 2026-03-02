import {QuestionItem} from "@/pages/HR/exam";
import { Tag } from "antd";
const questionTypeMap: Record<string, string> = {
  single: "单选题",
  other: "简答题",
  multiple: "多选题",
  judge: "判断题",
}

export const configColumns = [
  {
    title: "题目类型",
    dataIndex: "question_type",
    key: "question_type",
    width: 140,
    render: (type: string) => <Tag color="blue">{questionTypeMap[type]}</Tag>,
  },
  {
    title: "题目内容",
    dataIndex: "question_content",
    key: "question_content",
    ellipsis: true,
  },
  {
    title: "工种",
    dataIndex: "module_name",
    key: "module_name",
    width: 170,
  },
  {
    title: "岗位级别",
    dataIndex: "grade_name",
    key: "grade_name",
    width: 140,
  },
  // {
  //   title: "正确答案",
  //   dataIndex: "correct_answer",
  //   key: "correct_answer",
  //   width: 120,
  // },
  // {
  //   title: "分值",
  //   dataIndex: "score",
  //   key: "score",
  //   width: 80,
  // },
]
