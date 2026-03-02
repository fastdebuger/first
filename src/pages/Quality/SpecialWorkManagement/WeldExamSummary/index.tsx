import React, { useRef, useState } from "react";
import BaseHeaderAndBodyTable from "@/components/BaseHeaderAndBodyTable";
import { hasPermission } from "@/utils/authority";
import { Button, message, Modal, Space, Alert } from "antd";
import { BasicTableColumns } from "yayang-ui";
import { connect } from "umi";
import { ErrorCode, PROP_KEY } from "@/common/const";
import { inspectorApprovalStatusTag } from "@/common/common";
import ApprovalTaskSegmented from "@/components/ApprovalTaskSegmented";
import InitiateApproval from "@/components/Approval/InitiateApproval";
import ViewApproval from "@/components/Approval/ViewApproval";
import { getUserInfoAndParams } from "@/utils/utils";

import { configColumns } from "./columns";
import WeldExamSummaryAdd from "./Add";
import WeldExamSummaryEdit from "./Edit";
import WeldExamSummaryDetail from "./Detail";
import WeldingExamination from "./WeldingExamination";


/**
 * 焊工考试项目汇总
 * @param props
 * @constructor
 */
const WeldExamSummaryPage: React.FC<any> = (props: any) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  // 筛选审批任务值
  const [approvalTask, setApprovalTask] = useState<any>('all');
  // 控制 焊工考试项目汇总表的状态
  const [weldingVisible, setWeldingVisible] = useState<boolean>(false);

  /**
     * 表格列配置引用columns文件
     * @returns 返回一个数组
     */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'sub_comp_name',
      {
        title: "compinfo.exam_address",
        subTitle: "考试单位",
        dataIndex: "exam_address",
        width: 160,
        align: "center",
        render: (text: any, record: any) => {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record);
                setOpen(true);
              }}
              style={{ color: '#1890ff', cursor: 'pointer' }}
            >
              {text}
            </a>
          )
        }
      },
      'person_count', // 考试人数
      'plan_exam_time',
      'approval_date',
      'remark',
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      'modify_user_name',
      {
        "title": "common.status",
        "subTitle": "审批状态",
        "dataIndex": "approval_status",
        "width": 160,
        "align": "center",
        render: (text: any, _record: any) => {
          return inspectorApprovalStatusTag(text);
        }
      },
    ]).initBodyTableColumns([
      'first_date',
      'exam_type', // 考试性质
      'valid_project', // 证书有效项目
      'valid_date', // 书有效日期
      'exam_result_str', // 考试结果
      'is_exchange_str', // 是否换取项目
      'b_remark',

    ])
      .needToFixed([
        { value: 'approval_status', fixed: 'right' }
      ])
      .setTableColumnToDatePicker([
        { value: 'plan_exam_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'approval_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'first_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'valid_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
    return cols.getNeedColumns();
  };

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar: any = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      [
        <Space>
          {PROP_KEY !== 'branchComp' && (
            <Button
              type={"primary"}
              onClick={() => {
                setAddVisible(true);
              }}
            >新增</Button>
          )}
          <Button
            type={"primary"}
            onClick={() => {
              if (actionRef.current) {
                actionRef.current.exportFile();
              }
            }}
          >导出</Button>
        </Space>
      ]
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const headerToolbar = (selectedRows?: any) => {
    let approvalincluded = [0, -1];
    if(approvalTask === '0'){
      approvalincluded.push(1);
    }
    // 修改发起审批功能，如果flow_status等于0或者3则可以发起审批
    const canInitiateApprovalAllRows = selectedRows.every((row: any) => approvalincluded.includes(Number(row.approval_status)));
    const userInfo = getUserInfoAndParams();
    return [
      canInitiateApprovalAllRows && (
        <Button
          type={"primary"}
          onClick={() => {
            if (selectedRows?.length !== 1) {
              message.warn('每次编辑一行数据')
              return;
            }
            setSelectedRecord(selectedRows[0])
            setEditVisible(true);
          }}
        >编辑</Button>
      ),

      PROP_KEY !== 'branchComp' && selectedRows.length === 1 && (
        <InitiateApproval
          // style={{ display: hasPermission(authority, '发起审批') ? 'inline' : 'none' }}
          key={selectedRows?.RowNumber || 'default'} // 添加key属性强制重新渲染
          recordId={selectedRows[0]?.h_id}
          selectedRecord={{
            ...selectedRows[0],
            approval_schedule: !canInitiateApprovalAllRows
          }}
          dispatch={dispatch}
          funcode={'A11'}
          type='workLicenseRegister/welderExamstartApproval'
          onSuccess={() => {
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      ),
      [
        selectedRows?.length === 1 && (
          <ViewApproval
            // style={{ display: hasPermission(authority, '查看审批') ? 'inline' : 'none' }}
            key={`view-${selectedRows[0]?.RowNumber || 'default'}`} // 添加key属性强制重新渲染
            instanceId={selectedRows[0]?.approval_process_id}
            funcCode={'A11'}
            id={selectedRows[0]?.h_id}
            selectedRecord={{
              ...selectedRows[0],
              ...userInfo
            }}
            onSuccess={() => {
              if (actionRef.current) {
                actionRef.current.reloadTable();
              }
            }}
          />
        )
      ],
      canInitiateApprovalAllRows && (
        <Button
          danger
          type={"primary"}
          onClick={() => {
            if (selectedRows?.length !== 1) {
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
                  type: "workLicenseRegister/delWelderExam",
                  payload: {
                    h_id: selectedRows[0]['h_id'],
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
      ),
      <Button
        type={"primary"}
        onClick={() => {
          if (selectedRows?.length !== 1) {
            message.warn('每次编辑一行数据')
            return;
          }
          setSelectedRecord(selectedRows[0])
          setWeldingVisible(true);
        }}
      >
        焊工考试项目汇总表
        {/* WeldingExamination */}
      </Button>

    ]
  }

  return (
    <div>
      <BaseHeaderAndBodyTable
        cRef={actionRef}
        tableTitle="焊工考试项目汇总"
        header={{
          sort: "h_id",
          order: "desc",
          rowKey: "h_id",
          type: "workLicenseRegister/queryWelderExamHead",
          exportType: "workLicenseRegister/queryWelderExamHead",
        }}
        scan={{
          sort: "h_id",
          order: "desc",
          rowKey: "h_id",
          type: "workLicenseRegister/queryWelderExamFlat",
          exportType: "workLicenseRegister/queryWelderExamFlat",
        }}
        tableColumns={getTableColumns()}
        buttonToolbar={renderButtonToolbar}
        funcCode={authority + 'queryWe1lderExamHead2'}
        selectedRowsToolbar={() => ({
          headerToolbar: headerToolbar,
          scanToolbar: () => []
        })}
        tableDefaultField={{ my_approval_task: approvalTask }}
        renderSelfToolbar={() => {
          return (
            <Space>
              <ApprovalTaskSegmented
                value={approvalTask}
                onChange={(value: any) => {
                  setApprovalTask(value);
                  if (actionRef.current) {
                    actionRef.current.reloadTable();
                  }
                }}
              />
              <Alert type="warning" message="您可在待我审批状态下，点击编辑维护‘考试结果’" />
            </Space>
          )
        }}
      />
      {open && (
        <WeldExamSummaryDetail
          authority={authority}
          open={open}
          onClose={() => setOpen(false)}
          selectedRecord={selectedRecord}
          actionRef={actionRef}
        />
      )}
      {editVisible && (
        <WeldExamSummaryEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          approvalTask={approvalTask}
          onCancel={() => setEditVisible(false)}
          callbackEditSuccess={() => {
            setEditVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {addVisible && (
        <WeldExamSummaryAdd
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackAddSuccess={() => {
            setAddVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}

      {weldingVisible && (
        <WeldingExamination
          dispatch={dispatch}
          visible={weldingVisible}
          onCancel={() => setWeldingVisible(false)}
          selectedRecord={selectedRecord}
        />
      )}
    </div>
  )
}
export default connect()(WeldExamSummaryPage);
