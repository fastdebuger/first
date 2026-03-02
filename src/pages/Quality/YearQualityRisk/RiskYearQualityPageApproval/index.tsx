import React, {useEffect, useRef, useState} from 'react';
import {Button, message, Modal, Space} from "antd";
import {connect, useIntl, useLocation  } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BasicTableColumns, BaseImportModal} from 'yayang-ui';
import {ErrorCode} from "@/common/const";
import {hasPermission} from "@/utils/authority";
import { getDisplayHierarchy, getDefaultFiltersInspector,getUserInfoAndParams } from "@/utils/utils";
import { inspectorApprovalStatusTag } from "@/common/common";
import { PROP_KEY } from "@/common/const";
import InitiateApproval from "@/components/Approval/InitiateApproval";
import ViewApproval from "@/components/Approval/ViewApproval";

import {configColumns} from "./columns";
import DateSelfToolbar from "@/components/DateSelfToolbar";

/**
 * 监视和测量设备审批记录
 * @constructor
 */
const RiskMonthlyPageApproval: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const { formatMessage } = useIntl();

  const location: any = useLocation();
  const query = location.query || {};

  // 初始化默认年份
  const [defaultYear, setDefaultYear] = useState<any>(query?.year || new Date().getFullYear());
  // 月份状态，用于日期选择器的默认值
  const [defaultMonth, setDefaultMonth] = useState<any>(query?.month || new Date().getMonth() + 1);

  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      ...getDisplayHierarchy(),
      'year',
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
      "create_ts_str",
      "create_user_name",
    ])
    .needToExport([
      ...getDisplayHierarchy(),
      'year',
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
          key={selectedRows?.id || 'default'} // 添加key属性强制重新渲染
          recordId={selectedRows[0]?.id}
          selectedRecord={{
            ...selectedRows[0],
            approval_schedule: !canInitiateApprovalAllRows
          }}
          dispatch={dispatch}
          funcode={'A07'}
          type='workLicenseRegister/startApprovalYearRiskAnnual'
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
          funcCode={'A07'}
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
        tableTitle={'年度质量风险评估审批'}
        type="workLicenseRegister/getRiskAnnualApproval"
        exportType="workLicenseRegister/getRiskAnnualApproval"
        tableColumns={getTableColumns()}
        funcCode={authority+ 'getRiskAnnualApproval'}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={[
          { "Key": "year", "Val": Number(defaultYear) || new Date().getFullYear(), "Operator": "=" },
          ...getDefaultFiltersInspector(),
        ]}
        renderSelfToolbar={() => {
          return (
            <Space>
              <DateSelfToolbar
                showMonth={false}
                defaultYear={defaultYear}
                defaultMonth={defaultMonth}
                setDefaultYear={setDefaultYear}
                setDefaultMonth={setDefaultMonth}
              />
              
            </Space>
            
          )
        }}
      />
     
      
    </div>
  )
}
export default connect()(RiskMonthlyPageApproval);
