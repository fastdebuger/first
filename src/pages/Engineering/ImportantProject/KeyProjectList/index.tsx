import React, {useEffect, useRef, useState} from 'react';
import {Button, Select, Space} from "antd";
import {connect} from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BasicTableColumns} from 'yayang-ui';
import {hasPermission} from "@/utils/authority";

import {configColumns} from "./columns";
import DateRangerSelect, {getLastThuToThisWedRange} from "@/pages/Engineering/Week/WeeklyReport/Common/DateRangerSelect";

/**
 * 重点项目台账
 * @constructor
 */
const KeyProjectListPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const [lastThu, thisWed] = getLastThuToThisWedRange();
  const [tableDefault, setTableDefault] = useState({
    weekly_report_start: lastThu.format('YYYY-MM-DD'),
    weekly_report_end: thisWed.format('YYYY-MM-DD')
  })

  const SelectOptionList = [
    {key: 'all', val: '', title: '全部'},
    {key: 'is_first', val: '1', title: '按新开工'},
    {key: 'project_status', val: '2', title: '按在执行'},
    {key: 'is_complete', val: '1', title: '按完工'},
    {key: 'is_busy', val: '1', title: '按累计执行'},
    {key: 'is_plan_complete', val: '1', title: '按计划完工'},
  ]

  useEffect(() => {
    if(dispatch) {

    }
  }, [])

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "project_name",
      "contract_mode_str",
      "project_level_str",
      "specialty_type_str",
      "region_category_str",
      "owner_group_str",
      "contract_say_price",
      "curr_week_plan",
      "curr_week_reality",
      "curr_week_difference",
      "construction_dep",
      "general_contractor_name",
      "project_status_str",
    ])
      .needToExport([
        "project_name",
        "contract_mode_str",
        "project_level_str",
        "specialty_type_str",
        "region_category_str",
        "owner_group_str",
        "contract_say_price",
        "curr_week_plan",
        "curr_week_reality",
        "curr_week_difference",
        "construction_dep",
        "general_contractor_name",
        "project_status_str",
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
        // style={{display: hasPermission(authority, '导出') ? 'inline' : 'none'}}
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
  return (
    <div key={JSON.stringify(tableDefault)}>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="project_name"
        tableTitle='重点项目台账'
        type="importantProject/getKeyProjectList"
        exportType="importantProject/getKeyProjectList"
        tableColumns={getTableColumns()}
        funcCode={authority}
        renderSelfToolbar={(reloadTable) => {
          return (
            <Space>
              <DateRangerSelect
                defaultRangeStr={[
                  tableDefault.weekly_report_start,
                  tableDefault.weekly_report_end,
                ]}
                onChange={(rangStr) => {
                  setTableDefault({
                    weekly_report_start: rangStr[0],
                    weekly_report_end: rangStr[1]
                  })
                }}
              />
              <Select
                style={{width: 160}}
                defaultValue={'all'}
                onChange={(value: string) => {
                  const findObj = SelectOptionList.find(option => {
                    return option.key === value;
                  })
                  if (findObj) {
                    if (findObj.key === 'all') {
                      reloadTable([])
                    } else {
                      reloadTable([{
                        Key: findObj.key, Val: findObj.val
                      }])
                    }
                  }
                }}
              >
                {
                  SelectOptionList.map((item: any, index: number) => {
                    return (
                      <Select.Option key={item.label} value={item.key}>{item.title}</Select.Option>
                    )
                  })
                }
              </Select>
            </Space>
          )
        }}
        tableSortOrder={{ sort: 'project_name', order: 'desc' }}
        tableDefaultField={tableDefault}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
    </div>
  )
}
export default connect()(KeyProjectListPage);
