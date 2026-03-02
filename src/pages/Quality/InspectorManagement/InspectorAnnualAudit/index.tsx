import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space, Segmented  } from "antd";
import { connect, useIntl } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { ErrorCode, PROP_KEY } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import InitiateApproval from "@/components/Approval/InitiateApproval";
import { getDisplayHierarchy, getDefaultFiltersInspector, getUserInfoAndParams } from "@/utils/utils";
import ViewApproval from "@/components/Approval/ViewApproval";
import { inspectorApprovalStatusTag } from "@/common/common";
import ApprovalTaskSegmented from "@/components/ApprovalTaskSegmented";

import { configColumns } from "./columns";
import Detail from "./Detail";
import Edit from "./Edit";

/**
 * 质量检查员资格证年审
 * @constructor
 */
const InspectorAnnualAudit: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const { formatMessage } = useIntl();
  // 控制编辑弹窗显示状态的状态变量
  const [editVisible, setEditVisible] = useState<boolean>(false);
  // 控制某个面板或菜单展开状态的状态变量
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // 存储当前选中记录数据的状态变量
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  // 筛选审批任务值
  const [approvalTask, setApprovalTask] = useState<any>('all');
  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      ...getDisplayHierarchy(),
      {
        "title": "InspectorSeniorityApply.name",
        "subTitle": "姓名",
        "dataIndex": "name",
        "width": 160,
        "align": "center",
        render(text: any, record: any) {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record);
                setIsOpen(true);
              }}
              style={{ color: '#1890ff', cursor: 'pointer' }}
            >
              {text}
            </a>
          );
        }
      },
      'gender',
      'birth_date',
      'job',
      'job_title',
      'work_date',
      'education',
      'graduation_school',
      'major',
      'related_work_date',
      'apply_major',
      'quality_situation',
      'pass_percent',
      'certificate_situation',
      'reward_count',
      'reward_amount',
      'reward_personnel',
      'reward_reason',
      'fine_count',
      'fine_amount',
      'fine_personnel',
      'fine_reason',
      'accident_situation',

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
    ])
      .needToFixed([{ value: 'approval_status', fixed: 'right' }])
      .setTableColumnToDatePicker([
        { value: 'birth_date', valueType: 'dateTs' },
        { value: 'work_date', valueType: 'dateTs' },
        { value: 'related_work_date', valueType: 'dateTs' },
        { value: 'approval_date', valueType: 'dateTs' },
      ])
      .needToExport([
        ...getDisplayHierarchy(),
        'name',
        'gender',
        'birth_date',
        'job',
        'job_title',
        'work_date',
        'education',
        'graduation_school',
        'major',
        'related_work_date',
        'apply_major',
        'quality_situation',
        'pass_percent',
        'certificate_situation',
        'reward_count',
        'reward_amount',
        'reward_personnel',
        'reward_reason',
        'fine_count',
        'fine_amount',
        'fine_personnel',
        'fine_reason',
        'accident_situation',
        "create_ts_str",
        "create_user_name",
        "modify_ts_str",
        'modify_user_name'
      ])
    return cols.getNeedColumns();
  }

  // 年审批函数
  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Space>
        <Button
          // style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
          onClick={(e) => {
            if (actionRef.current) {
              actionRef.current.exportFile();
            }
          }}
        >导出</Button>
      </Space>
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any, reloadTable: (filters?: [], noFilters?: []) => void) => {
    // 修改发起审批功能，如果flow_status等于0或者3则可以发起审批
    const canInitiateApprovalAllRows = selectedRows.every((row: any) => [0, -1].includes(Number(row.approval_status)));
    const userInfo = getUserInfoAndParams();

    return [
      PROP_KEY === 'dep' && selectedRows.length === 1 && (
        <InitiateApproval
          // style={{ display: hasPermission(authority, '发起审批') ? 'inline' : 'none' }}
          key={selectedRows?.RowNumber || 'default'} // 添加key属性强制重新渲染
          recordId={selectedRows[0]?.id}
          selectedRecord={{
            ...selectedRows[0],
            approval_schedule: !canInitiateApprovalAllRows
          }}
          dispatch={dispatch}
          funcode={'A02'}
          type='workLicenseRegister/annualAuditStartApproval'
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
            funcCode={'A02'}
            id={selectedRows[0]?.id}
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
    ]
  }

  return (
    <>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle={formatMessage({ id: 'InspectorAnnualAudit' })}
        type="workLicenseRegister/getInspectorAnnualAudit"
        exportType="workLicenseRegister/getInspectorAnnualAudit"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getInspectorAnnua2lAudit'}
        tableSortOrder={{ sort: 'modify_ts', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={getDefaultFiltersInspector()}
        tableDefaultField={{ my_approval_task: approvalTask }}
        renderSelfToolbar={() => {
          return (
            <ApprovalTaskSegmented
              value={approvalTask}
              onChange={(value: any) => {
                setApprovalTask(value);
                if(actionRef.current){
                  actionRef.current.reloadTable();
                }
              }}
            />
            
          )
        }}
      />

      {editVisible && (
        <Edit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {isOpen && (
        <Detail
          visible={isOpen}
          selectedRecord={selectedRecord}
          onCancel={() => setIsOpen(false)}
          callbackSuccess={() => {
            setIsOpen(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </>
  )
}
export default connect()(InspectorAnnualAudit);
