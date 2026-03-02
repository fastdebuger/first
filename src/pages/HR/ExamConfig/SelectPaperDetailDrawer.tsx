import { useState, useEffect } from "react"
import {
  Table,
  Tag, Space, Alert, Empty, Card, Row, Col, Drawer,
} from 'antd';

import {
  queryExamPaperExistQuestions,
  queryExamPaperList,
} from '@/services/hr/exam';
const EXAM_BANK: any[] = [];

/**
 * 查看和追加考题
 * @param props
 * @constructor
 */
const SelectPaperDetailDrawer = (props: any) => {
  const { paperId, paperName, paperTotalScore, moduleName,
    selectQuestionsModalVisible,
    onCancel
  } = props;

  const questionTypeMap: Record<string, string> = {
    single: "单选题",
    multiple: "多选题",
    judge: "判断题",
  }

  const [selectedPaper, setSelectedPaper] = useState<any>(null)
  const [existingQuestions, setExistingQuestions] = useState<any[]>([]);

  /**
   * 查看考试详情
   */
  const fetchPaperDetail = async () => {
    const res = await queryExamPaperList({
      sort: 'created_at',
      order: 'desc',
      filter: JSON.stringify([
        {Key: 'paper_id', Val: paperId, Operator: '='}
      ])
    })
    setSelectedPaper(res.rows.length > 0 ? res.rows[0] : null)
  }

  /**
   * 查看已经添加的考题
   */
  const fetchQuestions = async () => {
    const resExist = await queryExamPaperExistQuestions({
      sort: 'question_id',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'paper_id', Val: paperId, Operator: '='}
      ])
    })
    setExistingQuestions(resExist.rows || [])
  }

  useEffect(() => {
    fetchPaperDetail();
    fetchQuestions();
  }, [paperId])

  const getPracticalExamList = () => {
    const examList = EXAM_BANK[selectedPaper.module_code] || [];
    const findExam = examList.length > 0 ? examList.find((r: any) => {
      return r.paper_no = selectedPaper.practical_paper_no;
    }) : null;
    let totalScore = 0;
    let len = 0;
    if (findExam && findExam.paper_content && findExam.paper_content.length > 0) {
      len = findExam.paper_content.length;
      findExam.paper_content.forEach((item: any, itemIndex: number) => {
        totalScore += Number(item.score);
      })
    }
    return (
      <Card
        size={'small'}
        title={<Space>
          <h3>实操考题</h3>
          <strong>共 {len} 题</strong>
          <strong>总分 {totalScore} 分</strong>
        </Space>}
      >
        {(findExam && findExam.paper_content && findExam.paper_content.length > 0) ? (
          <>
            {findExam.paper_content.map((item: any, itemIndex: number) => (
              <p key={item.title}>
                <strong>{item.stepNo + 1}.</strong> {item.title} <a>({item.score}分)</a>
              </p>
            ))}
          </>
        ) : (
          <Empty/>
        )}
      </Card>
    )
  }

  const columns: any[] = [
    {
      title: "题目类型",
      dataIndex: "question_type",
      key: "question_type",
      width: 100,
      render: (type: string) => questionTypeMap[type],
    },
    {
      title: "题目内容",
      dataIndex: "question_content",
      key: "question_content",
      ellipsis: true,
    },
    {
      title: "系统",
      dataIndex: "module_name",
      key: "module_name",
      width: 160,
      ellipsis: true,
    },
    {
      title: "分值",
      dataIndex: "score",
      key: "score",
      width: 80,
    }
  ]

  const getExistQuestionsScore = () => {
    let totalScore = 0;
    existingQuestions.forEach((item: any, index: number) => {
      totalScore += Number(item.score);
    })
    return (
      <span>
        目前 {totalScore} 分
      </span>
    )
  }

  return (
    <Drawer
      title={<div>题目 - {paperName} 总分: {paperTotalScore}分 <Tag color={"blue"}>{moduleName}</Tag></div>}
      open={selectQuestionsModalVisible}
      visible={selectQuestionsModalVisible}
      onClose={onCancel}
      width={'66%'}
    >
      <Alert type={"info"} message={"普通考题：单选题、多选题。如需要实操，请追加实操考题"}/>
      <Table
        size={'small'}
        title={() => (
          <Row justify="space-between">
            <Col>
              <Space>
                <h3>普通考题</h3>
                <strong>已有 {existingQuestions.length} 题</strong>
                <strong>{getExistQuestionsScore()}</strong>
              </Space>
            </Col>
            <Col>
            </Col>
          </Row>
        )}
        columns={columns}
        dataSource={existingQuestions}
        rowKey="question_id"
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 道题目`,
        }}
      />
      {(selectedPaper && selectedPaper.practical_paper_no) && (
        <div style={{marginTop: 16}}>
          {getPracticalExamList()}
        </div>
      )}
    </Drawer>
  )
}

export default SelectPaperDetailDrawer;
