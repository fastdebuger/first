import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Space } from "antd";
import { connect, useIntl } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, PROP_KEY } from "@/common/const";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import InitiateApproval from "@/components/Approval/InitiateApproval";
import ViewApproval from "@/components/Approval/ViewApproval";
import { getDisplayHierarchy, getDefaultFiltersInspector, getUserInfoAndParams } from "@/utils/utils";
import { inspectorApprovalStatusTag } from "@/common/common";
import ApprovalTaskSegmented from "@/components/ApprovalTaskSegmented";

import { configColumns } from "./columns";

/**
 * 计量人员管理复审
 * @constructor
 */
const PersonnelLedgerAudit: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
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
      'name',
      "gender",
      "birth_date",
      "education",
      "employee_no",
      "job_title",

      "approval_date",
      'qualified_project_1',
      'validity_date_1',
      'validity_date_2',
      'qualified_project_3',
      'validity_date_3',
      'qualified_project_4',
      'validity_date_4',
      'qualified_project_5',
      'validity_date_5',
      "create_ts_str",
      "create_user_name",
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
      .setTableColumnToDatePicker([
        { value: 'birth_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'train_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'approval_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
      .needToFixed([
        { value: 'approval_status', fixed: 'right' }
      ])
      .needToExport([
        ...getDisplayHierarchy(),
        'name',
        "gender",
        "birth_date",
        "education",
        "employee_no",
        "job_title",
        "graduation_school",
        "major",
        "department",
        "post",
        "train_date",
        "train_grade",
        "phone",
        "create_ts_str",
        "create_user_name",
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

      PROP_KEY !== 'branchComp' && selectedRows.length === 1 && (
        <InitiateApproval
          // style={{ display: hasPermission(authority, '发起审批') ? 'inline' : 'none' }}
          key={selectedRows?.id || 'default'} // 添加key属性强制重新渲染
          recordId={selectedRows[0]?.id}
          selectedRecord={{
            ...selectedRows[0],
            approval_schedule: !canInitiateApprovalAllRows
          }}
          dispatch={dispatch}
          funcode={'A04'}
          type='workLicenseRegister/startApprovalPersonnelAudit'
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
            funcCode={'A04'}
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
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='计量管理人员复审'
        type="workLicenseRegister/getMeasurePersonnelAudit"
        exportType="workLicenseRegister/getMeasurePersonnelAudit"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getMeasurePersonnel2Audit'}
        tableSortOrder={{ sort: 'personnel_id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={getDefaultFiltersInspector()}
        renderSelfToolbar={() => {
          return (
            <ApprovalTaskSegmented
              value={approvalTask}
              onChange={(value: any) => {
                setApprovalTask(value);
                if (actionRef.current) {
                  actionRef.current.reloadTable();
                }
              }}
            />

          )
        }}
      />

    </div>
  )
}
export default connect()(PersonnelLedgerAudit);
