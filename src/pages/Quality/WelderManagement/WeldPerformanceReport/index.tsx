import React, { useEffect, useRef, useState } from 'react';
import { Button, Space, Select } from "antd";
import { connect, useIntl } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { hasPermission } from "@/utils/authority";
import { getDisplayHierarchy } from "@/utils/utils";
import { ConnectState } from '@/models/connect';

import { configColumns } from "./columns";
import DateSelfToolbar from "@/components/DateSelfToolbar";

/**
 * 质量回访计划
 * @constructor
 */
const VisitFollowPlan: React.FC<any> = (props) => {
  const { dispatch, route: { authority }, userList } = props;
  // 可以引用表格的.current属性可以在不触发重新渲染的情况下被更新
  const actionRef: any = useRef();
  // 用于存贮当前的详情记录数据
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  /**
   * 初始化年份和月份状态
   * 使用当前年份和月份作为初始值，月份需要加1因为月份从0开始
   */
  const [defaultYear, setDefaultYear] = useState<any>(new Date().getFullYear());
  const [defaultMonth, setDefaultMonth] = useState<any>(new Date().getMonth() + 1);

  // 请求焊工业绩模块的人员列表库
  useEffect(() => {
    dispatch({
      type: "workLicenseRegister/getWelderList",
      payload: {
        sort: 'employee_code',
        order: 'desc',
        filters: JSON.stringify([
          { "Key": "dep_code", "Val": localStorage.getItem('auth-default-cpecc-depCode'), "Operator": "=" },
        ]),
      }
    });
  }, []);

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
      .needToExport([
        ...getDisplayHierarchy(),
        'year',
        "month",
        "year_stage_str",
        "team_code",
        "welder_name",
        "employment_type",
        "employee_code",
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
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return []
  }

  const defaultMonthAndClearHalfYear = (month: any) => {
    setDefaultMonth(month);
  }

  // 将 tableDefaultFilter 过滤条件提取为函数
  const getTableDefaultFilter = (params: any) => {
    const {
      defaultYear = new Date().getFullYear(),
      selectedRecord,
      getDefaultFiltersInspector = () => []
    } = params;

    // 构建基础过滤器
    const baseFilters = [
      { "Key": "year", "Val": defaultYear, "Operator": "=" },
      ...getDefaultFiltersInspector()
    ];

    if (selectedRecord) {
      baseFilters.push({ "Key": "employee_code", "Val": selectedRecord?.employee_code, "Operator": "=" });
    }

    return baseFilters;
  };

  const handleChange = (value: any,option: any) => {
    setSelectedRecord(option)
  }

  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle={'焊工业绩档案'}
        type="workLicenseRegister/getWelderPerformance"
        exportType="workLicenseRegister/getWelderPerformance"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getWe1lderPerformance2'}
        tableSortOrder={{ sort: 'employee_code,month', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={getTableDefaultFilter({ defaultYear, selectedRecord })}
        renderSelfToolbar={(_reloadTable: any) => {
          return (
            <Space>
              <DateSelfToolbar
                defaultYear={defaultYear}
                showMonth={false}
                setDefaultYear={setDefaultYear}
                setDefaultMonth={defaultMonthAndClearHalfYear}
              />

              <Select 
                style={{ width: '220px' }}
                options={userList || []}
                placeholder="请选择人员"
                allowClear
                fieldNames={{
                  label: 'employee_name', // 显示字段
                  value: 'employee_code', // 实际值字段
                }}
                onChange={handleChange}
              />
              工程队编号：<b>{selectedRecord?.team_code ?? '-'}</b>
              焊工姓名：<b>{selectedRecord?.welder_name ?? '-'}</b>
              用工形式：<b>{selectedRecord?.employment_type ?? '-'}</b>
            </Space>
          )
        }}
      />
    </div>
  )
}
export default connect(({ workLicenseRegister }: ConnectState) => ({
  userList: workLicenseRegister.userList,
}))(VisitFollowPlan);
