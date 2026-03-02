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

  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      ...getDisplayHierarchy(),
      'year',
      "month",
      "year_stage_str",
      'employee_code',
      "team_code",
      "welder_name",
      "employment_type",
      "project_name",
      "certificate_no",
      "equipment_type_str",
      "welding_method_code_str",
      "welding_quantity",
      "unit",
      "ndt_num",
      "qualified_num",
      "pass_percent",
      "repair_num",
      "material_category_str",
      "quality_accident_str",
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      'modify_user_name',
      
    ])
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
      title={'员工编号：' + selectedRecord?.employee_code}
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >

      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle={'焊工业绩'}
        type="workLicenseRegister/getWelderPerformance"
        exportType="workLicenseRegister/getWelderPerformance"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getWe1lderPeriformance'}
        tableSortOrder={{ sort: 'modify_ts', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={[
          ...getDefaultFiltersInspector(),
          { Key: 'employee_code', Val: selectedRecord?.employee_code, Operator: '=' }
        ]}
        rowSelection={null}
      />

    </Modal>
  )
}
export default connect()(ApprovalRecord);
