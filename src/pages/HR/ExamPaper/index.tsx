import { useState, useEffect, useRef } from "react"
import {
  Button,
  Space,
  Form,
  message,
  Modal,
  Divider,
} from "antd"
import { ExamPaper } from "../exam";
import {publishExamPaper} from "@/services/hr/exam";
import {ErrorCode} from "@/common/const";
import SelectQuestionModal from "./SelectQuestionModal";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from "yayang-ui";
import { configColumns } from './columns';

import ExamPaperAdd from "./Add";
import ExamPaperDetail from "./Detail";
import ExamPaperEdit from "./Edit";
// import {hasPermission} from "@/utils/authority";
import { connect } from "umi";


const ExamPaperPage = (props: any) => {
  const { dispatch } = props;
  const [selectQuestionsModalVisible, setSelectQuestionsModalVisible] = useState(false)
  const [selectedPaper, setSelectedPaper] = useState<ExamPaper | null>(null)

  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const actionRef: any = useRef();

  const questionTypeMap: Record<string, string> = {
    single: "单选题",
    multiple: "多选题",
    judge: "判断题",
  }


  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      // "id",
      // "wbs_code",
      // "prop_key",
      "paper_name",
      "module_name",
      "grade_name",
      "start_time",
      "end_time",
      "publish_status",
      "is_allow_apply_str",

      "total_score",
      "pass_score",
      "single_count",
      "single_score",
      "judge_count",
      "judge_score",
      "other_count",
      "other_score",
      "create_ts",
      // "create_tz",
      // "create_user_code",
      "create_user_name",
      // "modify_ts",
      // "modify_tz",
      // "modify_user_code",
      // "modify_user_name",
      {
        title: "compinfo.operate",
        subTitle: "操作",
        dataIndex: "operate",
        width: 200,
        align: "center",
        render: (text, record) => {
          return (
            <>
              <a onClick={() => {
                setSelectedRecord(record);
                setOpen(true);
              }}>追加考题/人</a>
              <Divider type="vertical" />
              <a onClick={() => {
                setSelectedRecord(record);
                setOpen(true);
              }}>详情</a>
              {/*{Number(record.publish_status) !== 1 && Number(record.approval_status) === 2 && (*/}
              {Number(record.publish_status) !== 1 && (
                <>
                  <Divider type="vertical" />
                  <a onClick={() => {
                    Modal.confirm({
                      title: "发布",
                      content: "确定要发布吗？",
                      okText: "确定发布",
                      cancelText: "我再想想",
                      onOk: async () => {
                        const res = await publishExamPaper({
                          id: record.id,
                        })
                        if (res.errCode === ErrorCode.ErrOk) {
                          message.success("已发布");
                          if (actionRef.current) {
                            actionRef.current.reloadTable();
                          }
                        }
                      }
                    })
                  }}>发布</a>
                </>
              )}
            </>
          )
        }
      },
    ])
      .needToFixed([
        {value: 'operate', fixed: 'right'},
      ])
      .setTableColumnToDatePicker([
        {value: 'start_time', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'end_time', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'create_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'modify_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      ])
    return cols.getNeedColumns();
  }


  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Space>
        <Button
          // style={{display: hasPermission(authority, '新增') ? 'inline' : 'none'}}
          type="primary"
          onClick={() => {
            setAddVisible(true);
          }}
        >
          新增
        </Button>
        {/*<Button
          type="primary"
          // style={{display: hasPermission(authority, '导入') ? 'inline' : 'none'}}
          onClick={(e) => {
            e.stopPropagation();
            setVisible(true);
          }}
        >导入</Button>*/}
      </Space>,
      <a
        // style={{display: hasPermission(authority, '导出') ? 'inline' : 'none'}}
        onClick={(e) => {
          if (actionRef.current) {
            actionRef.current.exportFile();
          }
        }}
      >导出</a>
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Button
        // style={{display: hasPermission(authority, '编辑') ? 'inline' : 'none'}}
        type={"primary"}
        onClick={() => {
          if (selectedRows.length === 0) {
            message.warn('请选择一条数据');
            return;
          }
          if (selectedRows.length !== 1){
            message.warn('每次只能操作一条数据');
            return;
          }
          setSelectedRecord(selectedRows[0]);
          setEditVisible(true)
        }}
      >
        编辑
      </Button>,
      <Button
        danger
        // style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warning("每次只能删除一条数据");
            return;
          }
          Modal.confirm({
            title: "删除",
            content: "确定删除所选的内容？",
            okText: "确定删除",
            okType: "danger",
            cancelText: "我再想想",
            onOk() {
              dispatch({
                type: "examPaper/deleteExamPaper",
                payload: {
                  id: selectedRows[0]['id'],
                },
                callback: (res: any) => {
                  if (res.errCode === ErrorCode.ErrOk) {
                    message.success("删除成功");
                    if (actionRef.current) {
                      actionRef.current.reloadTable();
                    }
                  }
                },
              });
            },
            onCancel() {
              console.log("Cancel");
            },
          });
        }}
      >
        删除
      </Button>
    ]
  }

  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='考卷管理'
        type="examPaper/getExamPaper"
        exportType="examPaper/getExamPaper"
        tableColumns={getTableColumns()}
        funcCode={'考卷管理1'}
        tableSortOrder={{ sort: 'create_ts', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />

      {open && selectedRecord && (
        <ExamPaperDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={'考卷管理'}
          onClose={() => setOpen(false)}
          callbackSuccess={() => {
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {addVisible && (
        <ExamPaperAdd
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            setAddVisible(false);
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {editVisible && (
        <ExamPaperEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}

      {/* 选择题目Modal */}
      {selectQuestionsModalVisible && (
        <SelectQuestionModal
          paperId={selectedPaper?.paper_id}
          paperName={selectedPaper?.paper_name}
          paperTotalScore={selectedPaper?.total_score}
          moduleName={selectedPaper?.module_name}
          selectQuestionsModalVisible={selectQuestionsModalVisible}
          onCancel={() => {
            setSelectQuestionsModalVisible(false);
            // fetchExamPapers();
          }}
          questionTypeMap={questionTypeMap}
        />
      )}
    </div>
  )
}
export default connect()(ExamPaperPage);
