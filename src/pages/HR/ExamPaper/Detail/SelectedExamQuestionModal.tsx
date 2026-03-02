import { Button, Modal, Row, Col, message, Table, Popconfirm, Tag } from 'antd';
import React, { useEffect, useRef } from 'react';
import {configureCourse, queryClassCourse} from "@/services/hr/hrTrainingClass";
import {ErrorCode} from "@/common/const";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {configColumns} from "@/pages/HR/ExamQuestion/columns";
import { BasicTableColumns } from 'yayang-ui';
import {getExamPaperQuestion, savePaperQuestionMap} from "@/services/hr/exam";

const questionTypeMap: Record<string, string> = {
  single: "单选题",
  multiple: "多选题",
  judge: "判断题",
  other: '简答题'
}

const SelectedExamQuestionModal: React.FC = (props: any) => {

  const { selectedRecord } = props;
  const actionRef = useRef();

  const [visible, setVisible] = React.useState(false);
  const [list, setList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [commitLoading, setCommitLoading] = React.useState(false);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "question_type",
      "question_content",
      "module_name",
      "grade_name",
    ])
      .needToExport([

      ])
    return cols.getNeedColumns();
  }

  // courses:[{course_id:1,start_time:1,end_time:1,lecturer:[{lecturer_id:1}]}]

  const fetchList = async () => {
    setLoading(true);
    const res = await getExamPaperQuestion({
      sort: 'id',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'paper_id', Val: selectedRecord.id, Operator: '='},
      ]),
    })
    console.log('-------res', res)
    setLoading(false);
    setList(res.rows || [])
  }

  useEffect(() => {
    fetchList()
  }, []);

  const columns = [
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
    // {
    //   title: "工种",
    //   dataIndex: "module_name",
    //   key: "module_name",
    //   width: 170,
    // },
    // {
    //   title: "岗位级别",
    //   dataIndex: "grade_name",
    //   key: "grade_name",
    //   width: 140,
    // },
    {
      title: "操作",
      subTitle: "操作",
      dataIndex: "operate",
      width: 100,
      align: "center",
      render: (h: any, record: any) => {
        return (
          <Popconfirm title="确定删除?" onConfirm={async () => {
            setLoading(true);
            const filterArr = list.filter(item => item.id !== record.id);
            const result: any[] = [];
            if (filterArr.length > 0) {
              filterArr.forEach((item) => {
                const arr: any[] = item.lecturer_ids.split(',');
                const lecturer = arr.map(it => Object.assign({
                  lecturer_id: it,
                }))
                result.push({
                  course_id: item.course_id,
                  start_time: item.start_time,
                  end_time: item.end_time,
                  lecturer,
                })
              })
            }
            const res = await configureCourse({
              courses: JSON.stringify(result),
              id: selectedRecord.id,
            })
            setLoading(false);
            if (res.errCode === ErrorCode.ErrOk) {
              message.success('删除成功');
              setVisible(false);
              fetchList();
            }
          }}>
            <a style={{color: '#f40'}}>删除</a>
          </Popconfirm>
        )
      }
    },
  ]


  return (
    <>
      <Row justify="space-between">
        <Col></Col>
        <Col>
          <Button loading={commitLoading} type="primary" onClick={() => {
            setVisible(true);
          }}>
            新增
          </Button>
        </Col>
      </Row>
      <Table
        rowKey={'id'}
        loading={loading}
        style={{marginTop: 8}}
        size={'small'}
        columns={columns}
        dataSource={list}
      />
      {visible && (
        <Modal
          title={"新增题目"}
          visible={visible}
          onCancel={() => setVisible(false)}
          destroyOnClose={true}
          width={'96vw'}
          style={{
            top: 4,
            bottom: 4,
            maxWidth: '100vw',
            paddingBottom: 0,
            maxHeight: '100vh',
            overflow: 'hidden',
          }}
          bodyStyle={{ height: 'calc(100vh - 35px)', marginTop: '-20px' }}
          footer={null}
        >
          <div>
            <Row gutter={8}>
              <Col span={24}>
                <BaseCurdSingleTable
                  cRef={actionRef}
                  rowKey="id"
                  tableTitle='题库管理'
                  type="examQuestion/getExamQuestion"
                  importType="examQuestion/getExamQuestion"
                  tableColumns={getTableColumns()}
                  funcCode={'题库管理2123'}
                  tableSortOrder={{ sort: 'create_ts', order: 'desc' }}
                  tableDefaultFilter={[
                    {Key: 'module_code', Val: selectedRecord.module_code, Operator: '='},
                    {Key: 'grade', Val: selectedRecord.grade, Operator: '='},
                  ]}
                  buttonToolbar={() => {
                    return [

                    ]
                  }}
                  selectedRowsToolbar={(selectedRows: any[]) => {
                    return [
                      <Button onClick={() => {
                        if (selectedRows.length < 0) {
                          message.warning('至少选择一道题目');
                          return;
                        }
                        Modal.confirm({
                          title: '添加题目',
                          content: '确定添加考题到该考卷吗？',
                          okText: '添加',
                          cancelText: '我再想想',
                          onOk: async () => {
                            const result: any[] = [];
                            selectedRows.forEach((item, index) => {
                              result.push({
                                question_id: item.id,
                                sort_order: index,
                              })
                            })
                            const res = await savePaperQuestionMap({
                              paper_id: selectedRecord.id,
                              questions: JSON.stringify(result),
                            })
                            if(res.errCode === ErrorCode.ErrOk) {
                              message.success('添加成功');
                              setVisible(false);
                            }
                          }
                        })
                      }}>
                        添加考题
                      </Button>
                    ]
                  }}
                />
              </Col>
            </Row>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SelectedExamQuestionModal;
