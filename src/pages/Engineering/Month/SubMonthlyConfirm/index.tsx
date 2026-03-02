import React, {useEffect, useRef, useState} from 'react';
import {Button, Divider, message, Modal} from "antd";
import {connect} from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BasicTableColumns} from 'yayang-ui';

import {configColumns} from "./columns";
import MonthlyReportDetail from "../MonthlyReport/Detail";
import {updateConfirmationRecord} from "@/services/engineering/monthlyReport";

/**
 * 分公司月报确认
 * @constructor
 */
const SubMonthlyConfirmPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if(dispatch) {

    }
  }, [])


  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "sub_comp_name",
      "monthly_report_start", // 周报日期开始
      "monthly_report_end", // 周报日期结束
      "report_dep_name",
      "project_name",
      // 报告期
      "sub_confirmation_str",
      {
        title: "操作",
        subTitle: "id",
        dataIndex: "operate",
        width: 160,
        align: "center",
        render: (text, record) => {
          return (
            <>
              <a onClick={() => {
                setSelectedRecord(record);
                setOpen(true);
              }}>查看</a>
              <Divider type="vertical" />
              {Number(record.sub_confirmation) === 0 && (
                <a onClick={async () => {
                  Modal.confirm({
                    title: '确认',
                    content: '是否确认？',
                    okText: '确认',
                    cancelText: '我再想想',
                    onOk: async () => {
                      const res = await updateConfirmationRecord({
                        sub_confirmation: '1',
                        monthly_id: record.monthly_id,
                        branch_confirmation: record.branch_confirmation
                      })
                      if (res.errCode === 0) {
                        message.success("已确认");
                        actionRef.current.reloadTable();
                      }
                    }
                  })
                }}>确认</a>
              )}
            </>
          )
        }
      },
    ])
      .setTableColumnToDatePicker([
        {value: 'contract_start_date', valueType: 'dateTs', needValueType: 'date'},
        {value: 'contract_end_date', valueType: 'dateTs', needValueType: 'date'},
      ])
      .needToFixed([
        {value: 'branch_confirmation_str', fixed: 'right'},
        {value: 'operate', fixed: 'right'},
      ])
      .needToExport([
        "sub_comp_name",
        "monthly_report_start", // 周报日期开始
        "monthly_report_end", // 周报日期结束
        "report_dep_name",
        "project_name",
        // 报告期
        "sub_confirmation_str",
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
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='月报分公司确认'
        type="monthlyReport/getCompConfirmationRecords"
        exportType="monthlyReport/getCompConfirmationRecords"
        tableColumns={getTableColumns()}
        funcCode={authority}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {open && selectedRecord && (
        <MonthlyReportDetail
          visible={open}
          actionRef={actionRef}
          monthlyId={'monthly_id'}
          selectedRecord={selectedRecord}
          authority={authority}
          onCancel={() => setOpen(false)}
        />
      )}
    </div>
  )
}
export default connect()(SubMonthlyConfirmPage);
