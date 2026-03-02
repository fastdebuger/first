import React, { useRef, useState } from 'react';
import { Button, Space, message, Modal } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { PROP_KEY, ErrorCode, CURR_USER_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { getDisplayHierarchy, getDefaultFiltersInspector } from "@/utils/utils";
import Add from "./Add";
import Edit from "./Edit";

import { configColumns } from "./columns";

/**
 * 外委实验室调查评价
 * @constructor
 */
const OutsourcedSurveyAssess: React.FC<any> = (props) => {
  const { dispatch, authority, currentLedgerRecord } = props;
  const actionRef: any = useRef();
  // 用于新增状态
  const [addVisible, setAddVisible] = useState<boolean>(false);
  // 用于编辑状态
  const [editVisible, setEditVisible] = useState<boolean>(false);
  // 存贮当前选中的数据
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const isMaintainerFlag = currentLedgerRecord?.maintainer.includes(CURR_USER_CODE);

  /**
     * 表格列配置引用columns文件
     * @returns 返回一个数组
     */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'year',
      'lab_full_name', // 实验室名称
      "qualification_change", // 实验室资质范围、有效期的变化情况
      "data_reliability_str", // 数据可靠性
      "service_quality_str", // 服务质量
      "contract_performance_str", // 合同履约
      "is_choose_str", // 下年度是否选用(0 否 1 是)
      "create_user_name", //审查人
      "create_ts_str", //  审查日期
      ...getDisplayHierarchy(),

    ])
      .needToExport([
        'year',
        'lab_full_name', // 实验室名称
        "qualification_change", // 实验室资质范围、有效期的变化情况
        "data_reliability_str", // 数据可靠性
        "service_quality_str", // 服务质量
        "contract_performance_str", // 合同履约
        "is_choose_str", // 下年度是否选用(0 否 1 是)
        "create_user_name", //审查人
        "create_ts_str", //  审查日期
        ...getDisplayHierarchy(),

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
            // 判断是否是维护人员
            if (isMaintainerFlag) {
              setAddVisible(true);
            } else {
              message.error('抱歉，只有维护人员可以维护该模块！')
            }
          }}
        >
          新增
        </Button>
      </Space>

    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any, reloadTable: (filters?: [], noFilters?: []) => void) => {
    return isMaintainerFlag && [
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
                type: "workLicenseRegister/deleteExternalLaboratoryAnnualAudit",
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
        tableTitle='外委实验室年度审查'
        type="workLicenseRegister/getExternalLaboratoryAnnualAudit"
        exportType="workLicenseRegister/getExternalLaboratoryAnnualAudit"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getExterna1lLaboratoryA2nnualAudit'}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={getDefaultFiltersInspector()}

      />
      {addVisible && (
        <Add
          visible={addVisible}
          currentLedgerRecord={currentLedgerRecord}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            setAddVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {editVisible && (
        <Edit
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
export default connect()(OutsourcedSurveyAssess);
