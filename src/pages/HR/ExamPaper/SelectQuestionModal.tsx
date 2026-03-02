import { useState, useEffect } from "react"
import {
  Table,
  Button,
  Modal,
  Tag, Space, Popconfirm, message, Alert, Empty, Collapse, Switch, Tooltip, Card, Row, Col,
} from 'antd';
import {
  Trash2,
} from "lucide-react"
import {
  addExamPaperQuestions,
  cancelExamPaperQuestion,
  queryExamPaperBakQuestions, queryExamPaperExistQuestions,
  addPracticalExam, queryExamPaperList,
} from '@/services/hr/exam';
import {ErrorCode} from "@/common/const";

const EXAM_BANK: any[] = [];

/**
 * 普通考题
 * @param props
 * @constructor
 */
const BakModal = (props: any) => {
  const { visible, onCancel, columns, selectedPaper, existingQuestions} = props;

  const [bakQuestions, setBakQuestions] = useState<any[]>([]);
  const [selectedQuestionKeys, setSelectedQuestionKeys] = useState<any[]>([]);
  const [selectedQuestionRows, setSelectedQuestionRows] = useState<any[]>([]);

  const fetchBakQuestions = async () => {
    const resBak = await queryExamPaperBakQuestions({
      sort: 'question_id',
      order: 'asc',
      moduleCode: selectedPaper.module_code,
      paperId: selectedPaper.paper_id,
    })
    setBakQuestions(resBak.rows || []);
  }

  useEffect(() => {
    fetchBakQuestions();
  }, []);

  return (
    <Modal
      title={'备选考题'}
      open={visible}
      visible={visible}
      onCancel={onCancel}
      width={'80%'}
      footer={(
        <Button
          disabled={selectedQuestionKeys.length === 0}
          type="primary"
          onClick={async () => {
            const totalScore = Number(selectedPaper.total_score || 0);
            let existScore = 0;
            existingQuestions.forEach((question: any) => {
              existScore += Number(question.score);
            })
            let addScore = 0;
            selectedQuestionRows.forEach((row: any) => {
              addScore += Number(row.score);
            })
            console.log('addScore', addScore);
            console.log('existScore', existScore);
            console.log('totalScore', totalScore);
            if (existScore + addScore > totalScore) {
              message.error(`总分超过${totalScore}分，不能追加`);
              return;
            }
            const res = await addExamPaperQuestions({
              paper_id: selectedPaper.paper_id,
              questionList: JSON.stringify(selectedQuestionRows),
            })
            if (res.errCode === ErrorCode.ErrOk) {
              fetchBakQuestions();
              setSelectedQuestionKeys([]);
              setSelectedQuestionRows([]);
              onCancel();
            }
        }}>
          追加考题
        </Button>
      )}
    >
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Tag color="blue">
            {selectedPaper?.personal_type_name || ""}
            {selectedPaper?.group_name ? ` - ${selectedPaper.group_name}` : " - 通用 "}
            备选考题
          </Tag>
          <span style={{ marginLeft: "16px", color: "#666" }}>共 {bakQuestions.length} 道备选考题</span>
        </div>
      </div>

      <Table
        rowSelection={{
          selectedRowKeys: selectedQuestionKeys,
          onChange: (keys, rows) => {
            setSelectedQuestionKeys(keys as string[])
            setSelectedQuestionRows(rows);
          },
        }}
        columns={columns}
        dataSource={bakQuestions}
        rowKey="question_id"
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 道题目`,
        }}
      />
    </Modal>
  )
}


/**
 * 实操考题
 * @param props
 * @constructor
 */
const PracticalModal = (props: any) => {
  const { visible, onCancel, selectedPaper} = props;
  const examList = EXAM_BANK[selectedPaper.module_code]
  return (
    <Modal
      width={'80%'}
      title={'实操备选'}
      visible={visible}
      open={visible}
      onCancel={onCancel}
      footer={(
        <Button
          disabled={examList.length === 0}
          type="primary"
          onClick={async () => {
            const filterArr = examList.filter((r: any) => r.checked);
            console.log("filterArr----", filterArr);
            if (filterArr.length  !== 1) {
              message.warn('每次只能选择一场实操考试');
              return;
            }
            const res = await addPracticalExam({
              paperId: selectedPaper.paper_id,
              practicalPaperNo: filterArr[0].paper_no,
            })
            if (res.errCode === ErrorCode.ErrOk) {
              message.success('实操考试已追加');
              onCancel();
            }
          }}>
          追加考题
        </Button>
      )}
    >
      <Alert type={"info"} message={'选择其中的一套实操考题，可追加到考题中，用户打完普通考题后，会继续进行实操考题的考试'}/>
      <div style={{ marginTop: "16px" }}>
        {(examList && examList.length > 0) ? (
          <Collapse>
            {examList.map((exam: any, index: number) => {
              const arr = exam.paper_content || [];
              let totalScore = 0;
              if (arr.length > 0) {
                arr.forEach((row: any) => {
                  totalScore += Number(row.score);
                })
              }
              return (
                <Collapse.Panel
                  header={(
                    <div>
                      <strong>{exam.paper_name}. 总分（{totalScore}分）</strong>
                      <Switch
                        checkedChildren="启用"
                        unCheckedChildren="关闭"
                        onChange={(checked, event) => {
                          event.stopPropagation();
                          Object.assign(exam, {
                            checked,
                          })
                        }}
                      />
                    </div>)}
                  key={exam.paper_id}
                >
                  {(exam.paper_content && exam.paper_content.length > 0) ? (
                    <>
                      {exam.paper_content.map((item: any, itemIndex: number) => (
                        <p key={item.title}>
                          <strong>{item.stepNo + 1}.</strong> {item.title} <a>({item.score}分)</a>
                        </p>
                      ))}
                    </>
                  ) : (
                    <Empty/>
                  )}
                </Collapse.Panel>
              );
            })}
          </Collapse>
        ) : (
          <Empty/>
        )}
      </div>
    </Modal>
  )
}

/**
 * 查看和追加考题
 * @param props
 * @constructor
 */
const SelectQuestionModal = (props: any) => {
  const { paperId, paperName, paperTotalScore, moduleName,
    selectQuestionsModalVisible,
    onCancel, questionTypeMap
  } = props;

  const [selectedPaper, setSelectedPaper] = useState<any>(null)
  const [existingQuestions, setExistingQuestions] = useState<any[]>([]);
  const [bakVisible, setBakVisible] = useState<boolean>(false);
  const [practicalVisible, setPracticalVisible] = useState<boolean>(false);


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
          <Tooltip title={'删除后，可重新追加实操考题'}>
            <Button danger type={'link'} onClick={() => {
              Modal.confirm({
                title: '删除实操考题',
                content: '删除后，需要该场考题需要实操内容，可重新追加',
                okText: '确定删除',
                cancelText: '我再想想',
                onOk: async () => {
                  const res = await addPracticalExam({
                    paperId: selectedPaper.paper_id,
                    practicalPaperNo: "",
                  })
                  if (res.errCode === ErrorCode.ErrOk) {
                    message.success('实操考试已删除');
                    fetchPaperDetail();
                  }
                }
              })
            }}>
              删除
            </Button>
          </Tooltip>
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
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_: string, record: any) => (
        <Space size="small">
          <Popconfirm
            title="确定删除此题目吗？"
            onConfirm={async () => {
              const res = await cancelExamPaperQuestion({
                id: record.id,
              })
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("已删除");
                fetchQuestions();
              }
            }}
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
    <Modal
      title={<div>题目 - {paperName} 总分: {paperTotalScore}分 <Tag color={"blue"}>{moduleName}</Tag></div>}
      open={selectQuestionsModalVisible}
      visible={selectQuestionsModalVisible}
      onCancel={onCancel}
      width={'90%'}
      footer={null}
    >
      <Alert type={"info"} message={"普通考题：单选题、多选题。如需要实操，请追加实操考题"}/>
      <Table
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
              <Button type="primary" onClick={() => setBakVisible(true)}>
                追加普通考题
              </Button>
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
      {!(selectedPaper && selectedPaper.practical_paper_no) && (
        <Button type="primary" onClick={() => setPracticalVisible(true)}>
          追加实操题
        </Button>
      )}
      {(selectedPaper && selectedPaper.practical_paper_no) && (
        <div style={{marginTop: 16}}>
          {getPracticalExamList()}
        </div>
      )}
      {/* 基础考试 */}
      {bakVisible && (
        <BakModal
          existingQuestions={existingQuestions}
          selectedPaper={selectedPaper}
          visible={bakVisible}
          onCancel={() => {
            setBakVisible(false);
            fetchQuestions();
          }}
          columns={columns.filter(r => r.key != 'action')}
        />
      )}
      {/* 实操考试 */}
      {practicalVisible && (
        <PracticalModal
          existingQuestions={existingQuestions}
          selectedPaper={selectedPaper}
          visible={practicalVisible}
          onCancel={() => {
            setPracticalVisible(false);
            fetchPaperDetail();
          }}
        />
      )}
    </Modal>
  )
}

export default SelectQuestionModal;
