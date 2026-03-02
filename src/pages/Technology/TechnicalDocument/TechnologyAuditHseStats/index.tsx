import React, { useRef, useState } from 'react';
import { Button,Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import { configColumns } from "./columns";
import TechnologyAuditHseStatsDetail from "./Detail";

/**
 * HSE危害因素辨识与风险评价报告统计
 * @constructor
 */
const TechnologyAuditHseStats: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      {
        title: "分公司名称/区域指挥部名称",
        subTitle: "分公司名称/区域指挥部名称",
        dataIndex: "up_wbs_name",
        width: 200,
        align: "center",
        render(text: any, record: any) {
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
          );
        }
      },
      {
        title: "项目经理部名称",
        subTitle: "项目经理部名称",
        dataIndex: "out_info_dep_name",
        width: 200,
        align: "center",
      },
      'contract_out_name',
      'form_make_time_str',
      {
        title: "审批日期",
        subTitle: "审批日期",
        dataIndex: "approval_date_str",
        width: 160,
        align: "center",
        render: (text: any) => {
          return text || '审批未完成';
        }
      },
      'contract_say_price',
    ])
      .needToExport([
        'up_wbs_name',
        'out_info_dep_name',
        'contract_out_name',
        'form_make_time_str',
        'approval_date_str',
        'contract_say_price',
      ])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Space key="toolbar">
        <Button
          type="primary"
          style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
          onClick={() => {
            if (actionRef.current) {
              actionRef.current.exportFile();
            }
          }}
        >
          导出
        </Button>
      </Space>,
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = () => {
    return [
    ]
  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle={"HSE危害因素辨识与风险评价报告统计"}
        type="technologyBaseData/getTechnologyBaseData"
        exportType="technologyBaseData/getTechnologyBaseData"
        tableColumns={getTableColumns()}
        funcCode={`${authority}HSE危害因素辨识与风险评价报告统计`}
        tableSortOrder={{ sort: 'form_make_time', order: 'desc' }}
        tableDefaultField={{ type_code: '0' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={[
          { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' }
        ]}
      />
      {open && selectedRecord && (
        <TechnologyAuditHseStatsDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
          callbackSuccess={() => {
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  )
}
export default connect()(TechnologyAuditHseStats);

