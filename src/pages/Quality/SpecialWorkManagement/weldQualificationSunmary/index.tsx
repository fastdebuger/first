import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { PROP_KEY } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import { configColumns } from "./columns";
import WeldQualificationSunmaryEdit from "./Edit";

/**
 * 焊工资格情况统计
 * @constructor
 */
const WeldQualificationSunmaryPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [editVisible, setEditVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  /**
     * 表格列配置引用columns文件
     * @returns 返回一个数组
     */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "sub_comp_code",
      "cert_no",
      "steel_seal_no",
      "first_date",
      "valid_project",
      "cer_approval_date",
      "valid_date",
      "project_category",
      'create_user_name',
      'create_ts_str',
      'modify_user_name',
      'modify_ts_str',
    ])
      .needToExport([
        "sub_comp_code",
        "cert_no",
        "steel_seal_no",
        "first_date",
        "valid_project",
        "cer_approval_date",
        "valid_date",
        "project_category",
        'create_user_name',
        'create_ts_str',
        'modify_user_name',
        'modify_ts_str',
      ])
      .setTableColumnToDatePicker([
        { value: 'cer_approval_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'valid_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
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
    return PROP_KEY !== 'branchComp' && [
      <Button
        type={"primary"}
        onClick={() => {
          if (selectedRows.length === 0) {
            message.warn('请选择一条数据');
            return;
          }
          if (selectedRows.length !== 1) {
            message.warn('每次只能操作一条数据');
            return;
          }
          setSelectedRecord(selectedRows[0]);
          setEditVisible(true)
        }}
      >
        编辑
      </Button>
    ]
  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='焊工资格情况'
        type="workLicenseRegister/getWelderQualification"
        exportType="workLicenseRegister/getWelderQualification"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getWelderQua1lification'}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {editVisible && (
        <WeldQualificationSunmaryEdit
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
export default connect()(WeldQualificationSunmaryPage);
