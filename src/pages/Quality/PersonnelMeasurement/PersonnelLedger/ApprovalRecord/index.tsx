import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space, Segmented } from "antd";
import { connect, useIntl } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { getDisplayHierarchy, getDefaultFiltersInspector } from "@/utils/utils";
import ViewApproval from "@/components/Approval/ViewApproval";
import { inspectorApprovalStatusTag } from "@/common/common";
import ApprovalTaskSegmented from "@/components/ApprovalTaskSegmented";

import { configColumns } from "../columns";


/**
 * 质量检查员资格证年审
 * @constructor
 */
const ApprovalRecord: React.FC<any> = (props) => {
  const { authority, visible, onCancel, selectedRecord } = props;
  const actionRef: any = useRef();
  const { formatMessage } = useIntl();
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
      .needToFixed([{ value: 'approval_status', fixed: 'right' }])
      .setTableColumnToDatePicker([
        { value: 'birth_date', valueType: 'dateTs' },
        { value: 'work_date', valueType: 'dateTs' },
        { value: 'related_work_date', valueType: 'dateTs' },
        { value: 'approval_date', valueType: 'dateTs' },
      ])
    return cols.getNeedColumns();
  }

  // 年审批函数
  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return []
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any, reloadTable: (filters?: [], noFilters?: []) => void) => {
    return []
  }

  return (
    <Modal
      style={{
        maxWidth: '100vw',
        top: 0,
        paddingBottom: 0,
      }}
      bodyStyle={{
        height: 'calc(100vh - 55px)',
        overflowY: 'auto',
      }}
      width={'100%'}
      title={'年审记录：' + selectedRecord?.name}
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >

      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle={'计量人员审批'}
        type="workLicenseRegister/getMeasurePersonnelAudit"
        exportType="workLicenseRegister/getMeasurePersonnelAudit"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getMeasurePersonnelAudit1'}
        tableSortOrder={{ sort: 'personnel_id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={[
          ...getDefaultFiltersInspector(),
          { Key: 'name', Val: selectedRecord?.name, Operator: '=' }
        ]}
        rowSelection={null}
        tableDefaultField={{ my_approval_task: approvalTask }}
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

    </Modal>
  )
}
export default connect()(ApprovalRecord);
