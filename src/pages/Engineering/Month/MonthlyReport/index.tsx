import React, {useEffect, useRef, useState} from 'react';
import {Button, message, Modal, Space} from "antd";
import {connect} from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BasicTableColumns, BaseImportModal} from 'yayang-ui';
import {ErrorCode} from "@/common/const";
import {hasPermission} from "@/utils/authority";

import {configColumns} from "./columns";
import MonthlyReportAdd from "./Add";
import MonthlyReportDetail from "./Detail";
import MonthlyReportEdit from "./Edit";
import {addConfirmationRecord} from "@/services/engineering/monthlyReport";
import moment from 'moment';

/**
 * 项目月报
 * @constructor
 */
const MonthlyReportPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const depCode = localStorage.getItem('auth-default-cpecc-depCode');
  const currentMonth = moment().format('YYYY-MM'); // 当前月
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if(dispatch) {

    }
  }, [])


  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "belong_month",
      "report_dep_name",
      "project_name",
      "project_level_str",
      "contract_start_date",
      "contract_end_date",
      "curr_month_plan",
      "curr_month_reality",
      "curr_month_difference",
      "construction_dep",
      "confirmation_status_str",
      {
        title: "操作",
        subTitle: "id",
        dataIndex: "operate",
        width: 160,
        align: "center",
        render: (text, record) => {
          return (
            <a onClick={() => {
              setSelectedRecord(record);
              setOpen(true);
            }}>查看详情</a>
          )
        }
      },
    ])
      .setTableColumnToDatePicker([
        {value: 'contract_start_date', valueType: 'dateTs', needValueType: 'date'},
        {value: 'contract_end_date', valueType: 'dateTs', needValueType: 'date'},
      ])
      .needToFixed([
        {value: 'confirmation_status_str', fixed: 'right'},
        {value: 'operate', fixed: 'right'},
      ]).needToExport([
        "belong_month",
        "report_dep_name",
        "project_name",
        "project_level",
        "contract_start_date",
        "contract_end_date",
        "curr_month_plan",
        "curr_month_reality",
        "curr_month_difference",
        "construction_dep",
        "confirmation_status_str",
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
          // style={{display: hasPermission(authority, '新增') ? 'inline' : 'none'}}
          type="primary"
          onClick={() => {
            setAddVisible(true);
          }}
        >
          新增
        </Button>
        <Button
          type="primary"
          // style={{display: hasPermission(authority, '导入') ? 'inline' : 'none'}}
          onClick={(e) => {
            e.stopPropagation();
            setVisible(true);
          }}
        >导入</Button>
      </Space>,
      <a
        // style={{display: hasPermission(authority, '导出') ? 'inline' : 'none'}}
        onClick={(e) => {
          if (actionRef.current) {
            actionRef.current.exportFile();
          }
        }}
      >导出</a>
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Button
        // style={{display: hasPermission(authority, '编辑') ? 'inline' : 'none'}}
        type={"primary"}
        onClick={() => {
          if (selectedRows.length === 0) {
            message.warn('请选择一条数据');
            return;
          }
          if (selectedRows.length !== 1){
            message.warn('每次只能操作一条数据');
            return;
          }
          if (Number(selectedRows[0].confirmation_status) === 1){
            message.warn('已发分公司确认，不能重复提交');
            return;
          }
          if (Number(selectedRows[0].confirmation_status) === 2){
            message.warn('已发公司确认，不能重复提交');
            return;
          }
          if (Number(selectedRows[0].confirmation_status) === 3){
            message.warn('公司已确认，不能重复提交');
            return;
          }
          Modal.confirm({
            title: '提交',
            content: '确定提交到分公司进行确认吗？',
            okText: '确认提交',
            cancelText: '我再想想',
            onOk: async () => {
              const res = await addConfirmationRecord({
                id: selectedRows[0].id,
              })
              if (res.errCode === ErrorCode.ErrOk) {
                message.success('提交成功，等待公司确认');
                actionRef.current.reloadTable();
              }
            }
          })
        }}
      >
        提交
      </Button>,
      <Button
        // style={{display: hasPermission(authority, '编辑') ? 'inline' : 'none'}}
        type={"primary"}
        onClick={() => {
          if (selectedRows.length === 0) {
            message.warn('请选择一条数据');
            return;
          }
          if (selectedRows.length !== 1){
            message.warn('每次只能操作一条数据');
            return;
          }
          if (Number(selectedRows[0].confirmation_status) === 1){
            message.warn('已发分公司确认，不能修改');
            return;
          }
          if (Number(selectedRows[0].confirmation_status) === 2){
            message.warn('已发公司确认，不能修改');
            return;
          }
          if (Number(selectedRows[0].confirmation_status) === 3){
            message.warn('公司已确认，不能修改');
            return;
          }
          setSelectedRecord(selectedRows[0]);
          setEditVisible(true)
        }}
      >
        编辑
      </Button>,
      // <Button
      //   danger
      //   style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
      //   type={"primary"}
      //   onClick={() => {
      //     if (selectedRows.length !== 1) {
      //       message.warning("每次只能删除一条数据");
      //       return;
      //     }
      //     Modal.confirm({
      //       title: "删除",
      //       content: "确定删除所选的内容？",
      //       okText: "确定删除",
      //       okType: "danger",
      //       cancelText: "我再想想",
      //       onOk() {
      //         dispatch({
      //           type: "monthlyReport/deleteMonthlyReport",
      //           payload: {
      //             id: selectedRows[0]['id'],
      //           },
      //           callback: (res: any) => {
      //             if (res.errCode === ErrorCode.ErrOk) {
      //               message.success("删除成功");
      //               if (actionRef.current) {
      //                 actionRef.current.reloadTable();
      //               }
      //             }
      //           },
      //         });
      //       },
      //       onCancel() {
      //         console.log("Cancel");
      //       },
      //     });
      //   }}
      // >
      //   删除
      // </Button>
    ]
  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='项目月报'
        type="monthlyReport/getMonthlyReport"
        exportType="monthlyReport/getMonthlyReport"
        importType="monthlyReport/importMonthlyReport"
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
          selectedRecord={selectedRecord}
          authority={authority}
          onCancel={() => setOpen(false)}
          callbackSuccess={() => {
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {addVisible && (
        <MonthlyReportAdd
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            setAddVisible(false);
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {visible && (
        <BaseImportModal
          visible={visible}
          onCancel={() => setVisible(false)}
          startUploadFile={(file: any) => {
            if(actionRef.current) {
              const formData = new FormData();
              formData.append('belong_month', currentMonth);
              formData.append('report_dep_code', depCode);
              return actionRef.current.importFile(file, 'monthlyReport', () => {
                setVisible(false);
              }, formData);
            }
          }}
          downLoadTemplate={() => {
            if (actionRef.current) {
              actionRef.current.downloadImportFile('monthlyReport');
            }
          }}
        />
      )}
      {editVisible && (
        <MonthlyReportEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  )
}
export default connect()(MonthlyReportPage);
