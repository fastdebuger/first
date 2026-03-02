import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, PROP_KEY } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import { configColumns } from "./columns";
import SpecialWorkLedgerAdd from "./Add";
import SpecialWorkLedgerDetail from "./Detail";
import SpecialWorkLedgerEdit from "./Edit";

/**
 * 特种设备作业人员台账
 * @constructor
 */
const SpecialWorkLedgerPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "sub_comp_name",
      {
        "title": "compinfo.employee_number",
        "subTitle": "姓名",
        "dataIndex": "employee_number",
        "width": 160,
        "align": "center",
        render(text: any, record: any) {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record);
                setOpen(true);
              }}
            >
              {text}
            </a>
          );
        }
      },
      "name",
      "phone",
      "current_unit", // 现单位
      "employment_type_str", // 用工形式
      "gender", // 性别
      "nation_str", // 民族
      "operation_project_str", // 作业项目
      "education_str", // 文化程度
      "id_card", // 身份证号
      "address", // 身份证地址
      "file_no", // 档案编号
      "health_status", // 职业健康状况
      "review_date", // 复审日期
      "next_review_date", // 下次审核日期
      "violation_status", // 违章作业情况
      "work_start_date", // 参加工作时间
      "work_years", // 从事本工种年限
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      'modify_user_name',
    ])
      .needToExport([
        "sub_comp_code",
        "employee_number",
        "name",
        "phone",
        "current_unit",
        "employment_type_str",
        "gender",
        "nation_str",
        "operation_project_str",
        "education_str",
        "id_card",
        "address",
        "file_no",
        "health_status",
        "review_date",
        "next_review_date",
        "violation_status",
        "work_start_date",
        "work_years",
        "create_ts_str",
        "create_user_name",
        "modify_ts_str",
        'modify_user_name',
      ])
      .setTableColumnToDatePicker([
        { value: 'review_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'next_review_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'work_start_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
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
          type="primary"
          onClick={() => {
            setAddVisible(true);
          }}
        >
          新增
        </Button>
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
    return PROP_KEY !== 'branchComp' && [
      <Button
        type={"primary"}
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warn('每次只能操作一条数据');
            return;
          }
          setSelectedRecord(selectedRows[0]);
          setEditVisible(true)
        }}
      >
        编辑
      </Button>,
      <Button
        danger
        type={"primary"}
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warning("每次只能删除一条数据");
            return;
          }
          Modal.confirm({
            title: "删除",
            content: "确定删除所选的内容？",
            okText: "确定删除",
            okType: "danger",
            cancelText: "我再想想",
            onOk() {
              dispatch({
                type: "workLicenseRegister/deleteSpecialEquipmentWorker",
                payload: {
                  id: selectedRows[0]['id'],
                },
                callback: (res: any) => {
                  if (res.errCode === ErrorCode.ErrOk) {
                    message.success("删除成功");
                    if (actionRef.current) {
                      actionRef.current.reloadTable();
                    }
                  }
                },
              });
            },
            onCancel() {
              console.log("Cancel");
            },
          });
        }}
      >
        删除
      </Button>
    ]
  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='特种设备作业人员台账'
        type="workLicenseRegister/getSpecialEquipmentWorker"
        exportType="workLicenseRegister/getSpecialEquipmentWorker"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getSpecialEquipmentWorker'}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {open && selectedRecord && (
        <SpecialWorkLedgerDetail
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
      {addVisible && (
        <SpecialWorkLedgerAdd
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            setAddVisible(false);
            if (actionRef.current) {
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
            if (actionRef.current) {
              return actionRef.current.importFile(file, authority, () => {
                setVisible(false);
              });
            }
          }}
          downLoadTemplate={() => {
            if (actionRef.current) {
              actionRef.current.downloadImportFile(authority);
            }
          }}
        />
      )}
      {editVisible && (
        <SpecialWorkLedgerEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  )
}
export default connect()(SpecialWorkLedgerPage);
