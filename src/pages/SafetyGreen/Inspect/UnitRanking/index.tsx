import React, { useRef } from 'react';
import { Button, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';

import { configColumns } from "./columns";
import { WBS_CODE } from '@/common/const';

/**
 * 单位排名
 * @constructor
 */
const QualitySafetyInspectionPage: React.FC<any> = (props) => {
  const { route: { authority } } = props;
  const actionRef: any = useRef();

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      {
        title: "排名",
        subTitle: "排名",
        dataIndex: "rank",
        width: 80,
        align: "center",
        render: (_: any, __: any, index?: number) => (index !== undefined ? index + 1 : ''),
      },
      "wbs_name",
      "score",
    ])
      .noNeedToFilterIcon(['rank'])
      .noNeedToSorterIcon(['rank']);
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
          // style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
          type="primary"
          onClick={(e) => {
            if (actionRef.current) {
              actionRef.current.exportFile();
            }
          }}
        >
          导出
        </Button>
      </Space>
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return []

  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="wbs_name"
        tableTitle='单位排名'
        type="qualitySafetyInspection/getBranchWeightNumRadioScore"
        exportType="qualitySafetyInspection/getBranchWeightNumRadioScore"
        tableColumns={getTableColumns()}
        funcCode={authority}
        tableSortOrder={{ sort: 'score', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={
          [
            { Key: 'wbs_code', Val: WBS_CODE + "%", Operator: 'like' }
          ]
        }
      />
    </div>
  )
}
export default connect()(QualitySafetyInspectionPage);
