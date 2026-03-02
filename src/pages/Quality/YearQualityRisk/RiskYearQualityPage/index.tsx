import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Space } from "antd";
import { connect, useIntl, history } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, PROP_KEY, CURR_USER_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { getDisplayHierarchy, getDefaultFiltersInspector } from "@/utils/utils";

import { configColumns } from "./columns";
import Add from "./Add";
import Edit from "./Edit";
import Detail from "./Detail";
import DateSelfToolbar from "@/components/DateSelfToolbar";

/**
 * 年度质量风险评估
 * @constructor
 */
const RiskYearQualityPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  // 用于控制导入的状态
  const [visible, setVisible] = useState(false);
  // 用于控制新增的状态
  const [addVisible, setAddVisible] = useState(false);
  // 用于控制编辑的状态
  const [editVisible, setEditVisible] = useState(false);
  // 用于控制详情的状态
  const [open, setOpen] = useState(false);
  // 存储当前选中记录数据的状态
  const [selectedRecord, setSelectedRecord] = useState(null);
  /**
 * 初始化年份和月份状态
 * 使用当前年份和月份作为初始值，月份需要加1因为月份从0开始
 */
  const [defaultYear, setDefaultYear] = useState<any>(new Date().getFullYear());
  const [defaultMonth, setDefaultMonth] = useState<any>(new Date().getMonth() + 1);

  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      ...getDisplayHierarchy(),
      'year',
      {
        "title": "compinfo.project",
        "subTitle": "工程名称",
        "dataIndex": "project",
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
      "create_ts_str",
      "create_user_name",
    ])
      .setTableColumnToDatePicker([
        { value: 'verification_date', valueType: 'dateTs' },
        { value: 'valid_date', valueType: 'dateTs' },
      ])
      .needToExport([
        ...getDisplayHierarchy(),
        'year',
        'project',
        "create_ts_str",
        "create_user_name",
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
        {PROP_KEY === 'dep' && (
          <Button
            type="primary"
            onClick={() => {
              dispatch({
                type: 'workLicenseRegister/getRiskSubmitRecordTime',
                payload: {
                  year: defaultYear,
                  dep_code: localStorage.getItem('auth-default-cpecc-depCode')
                },
                callback: (res: any) => {
                  if (!res.result.submit_str) {
                    setAddVisible(true);
                  } else {
                    message.warning('您当前年份已经发布，不能新增了！');
                  }
                }
              });
            }}
          >
            新增
          </Button>
        )}

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
    return PROP_KEY === 'dep' && [
      <Button
        type={"primary"}
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warn('每次只能操作一条数据');
            return;
          }
          // CURR_USER_CODE 当前用户编码
          if(selectedRows[0].create_user_code !== CURR_USER_CODE){
            message.error('您不是申请人无操作权限！');
            return;
          }
          setSelectedRecord(selectedRows[0]);
          setEditVisible(true);
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
          // CURR_USER_CODE 当前用户编码
          if(selectedRows[0].create_user_code !== CURR_USER_CODE){
            message.error('您不是申请人无操作权限！');
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
                type: "workLicenseRegister/delRiskAnnual",
                payload: {
                  h_id: selectedRows[0]['h_id'],
                  year: defaultYear

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
        rowKey="h_id"
        tableTitle={'年度质量风险评估'}
        type="workLicenseRegister/queryRiskAnnualHead"
        exportType="workLicenseRegister/queryRiskAnnualHead"
        tableColumns={getTableColumns()}
        funcCode={authority + 'queryRiskAnnualHead'}
        tableSortOrder={{ sort: 'modify_ts', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={[
          { "Key": "year", "Val": Number(defaultYear) || new Date().getFullYear(), "Operator": "=" },
          ...getDefaultFiltersInspector(),
        ]}
        renderSelfToolbar={(_reloadTable: any) => {
          return (
            <Space>
              <DateSelfToolbar
                showMonth={false}
                defaultYear={defaultYear}
                defaultMonth={defaultMonth}
                setDefaultYear={setDefaultYear}
                setDefaultMonth={setDefaultMonth}
              />
            </Space>

          )
        }}
      />

      {addVisible && (
        <Add
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
      {editVisible && selectedRecord && (
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

      {open && selectedRecord && (
        <Detail
          visible={open}
          selectedRecord={selectedRecord}
          onCancel={() => setOpen(false)}
          callbackSuccess={() => {
            setOpen(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  )
}
export default connect()(RiskYearQualityPage);
