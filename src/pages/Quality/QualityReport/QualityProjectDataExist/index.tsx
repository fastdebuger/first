import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, DatePicker } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { hasPermission } from "@/utils/authority";
import moment from 'moment';

import { configColumns } from "./columns";

const { RangePicker } = DatePicker;

// 获取当月的月初和月末时间戳（秒级）
const getCurrentMonthRange = (): [number, number] => {
  const now = moment();
  const start = now.clone().startOf('month').unix();
  const end = now.clone().endOf('month').unix();
  return [start, end];
};

/**
 * 质量月报填报情况
 * @constructor
 */
const QualityProjectDataExistPage: React.FC<any> = (props) => {
  const { route: { authority } } = props;
  const actionRef: any = useRef();

  // 初始化时间为当月的月初和月末时间戳（秒级）
  const [dateRange, setDateRange] = useState<[number, number]>(getCurrentMonthRange());

  useEffect(() => {
    console.log(dateRange, 'dateRange');

  }, [dateRange])

  // 处理日期范围变化（转换为秒级时间戳）
  const handleDateChange = (dates: [moment.Moment, moment.Moment] | null) => {
    if (dates) {
      setDateRange([dates[0].unix(), dates[1].unix()]);
    } else {
      setDateRange(getCurrentMonthRange());
    }
  };

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "dep_name",
      "tbl_quality_project_quality_overview",
      "tbl_quality_produced_products",
      "tbl_quality_tech_service_quaxlity",
      "tbl_quality_system_operation",
      "tbl_quality_inspection",
      "tbl_quality_excellence_activity",
      "tbl_quality_qc_activity",
      "tbl_quality_other_quality_statistics",
      "tbl_quality_statistics_analysis",
      "tbl_quality_serious_nonconformities",
      "tbl_quality_management_plan",
      "tbl_quality_experience",
      "tbl_quality_nc_corrective_action",
      "tbl_quality_inspection_summary_h",
      "tbl_quality_monthly_welding_pass_rate_h",
      "tbl_quality_accident_summary",
      "tbl_quality_monthly_quality_statistics",
    ])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Button
        type="primary"
        style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
        onClick={(e) => {
          if (actionRef.current) {
            actionRef.current.exportFile();
          }
        }}
      >导出</Button>
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [

    ]
  }

  // 构造查询参数
  const buildParams = () => {
    return {
      mints: dateRange[0],
      maxts: dateRange[1]
    };
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        <RangePicker
          value={[moment.unix(dateRange[0]), moment.unix(dateRange[1])]}
          onChange={handleDateChange}
          allowClear={false}
        />
        <Button
          type="primary"
          onClick={() => {
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
          style={{ marginLeft: 8 }}
        >
          查询
        </Button>
      </div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="tbl_quality_produced_products"
        tableTitle='质量月报填报情况'
        type="qualityExperience/queryDataExist"
        exportType="qualityExperience/queryDataExist"
        tableColumns={getTableColumns()}
        funcCode={authority + '质量月报填报情况'}
        tableSortOrder={{ sort: 'dep_name', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        tableDefaultField={buildParams()}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
    </div>
  )
}
export default connect()(QualityProjectDataExistPage);
