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
 * 质量检查员资格证年审记录
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
        tableTitle={formatMessage({ id: 'InspectorAnnualAudit' })}
        type="workLicenseRegister/getInspectorAnnualAudit"
        exportType="workLicenseRegister/getInspectorAnnualAudit"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getInspectorAnnua2lA2udit'}
        tableSortOrder={{ sort: 'modify_ts', order: 'desc' }}
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
                console.log('value', value);
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
