import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, message, Modal, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import { configColumns } from "./columns";
import QualitySeriousNonconformitiesAdd from "./Add";
import QualitySeriousNonconformitiesDetail from "./Detail";
import QualitySeriousNonconformitiesEdit from "./Edit";
import { useQualityMonthlyReportLock } from "@/pages/Quality/QualityReport/hooks/useQualityMonthlyReportLock";

/**
 * 本月严重不合格品情况
 * @constructor
 */
const QualitySeriousNonconformitiesPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { monthlyReportLocked } = useQualityMonthlyReportLock(dispatch);

  useEffect(() => {
    if (dispatch) {

    }
  }, [])

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      {
        title: "compinfo.month_situation",
        subTitle: "本月严重不合格品情况",
        dataIndex: "month_situation",
        width: 160,
        align: "center",
        render(text: any, record: any) {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record);
                setOpen(true);
              }}
              style={{ color: '#1890ff', cursor: 'pointer' }}
            >
              {text}
            </a>
          );
        }
      },
      "form_maker_name",
      "form_make_time_str",
    ])
      .setTableColumnToDatePicker([
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
      .needToExport([
        "month_situation",
        "form_maker_name",
        "form_make_time_str",
      ])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    if (monthlyReportLocked) {
      return [
        <Button
          key="export"
          type="primary"
          style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
          onClick={(e) => {
            if (actionRef.current) {
              actionRef.current.exportFile();
            }
          }}
        >导出</Button>
      ];
    }
    return [
      <Space>
        <Button
          style={{ display: hasPermission(authority, '新增') ? 'inline' : 'none' }}
          type="primary"
          onClick={() => {
            setAddVisible(true);
          }}
        >
          新增
        </Button>
        <Button
          type="primary"
          style={{ display: hasPermission(authority, '导入') ? 'inline' : 'none' }}
          onClick={(e) => {
            e.stopPropagation();
            setVisible(true);
          }}
        >导入</Button>
      </Space>,
      <a
        style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
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
    if (monthlyReportLocked) return [];
    return [
      <Button
        style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
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
      </Button>,
      <Button
        danger
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
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
                type: "qualitySeriousNonconformities/deleteQualitySeriousNonconformities",
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
      {monthlyReportLocked && (
        <Alert
          type="warning"
          showIcon
          message="当月月报已经生成，无法进行任何操作"
          style={{ marginBottom: 16 }}
        />
      )}
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        key={monthlyReportLocked}
        tableTitle='本月严重不合格品情况'
        type="qualitySeriousNonconformities/getQualitySeriousNonconformities"
        exportType="qualitySeriousNonconformities/getQualitySeriousNonconformities"
        tableColumns={getTableColumns()}
        funcCode={authority}
        tableSortOrder={{ sort: 'form_make_time', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={[
          {
            Key: 'dep_code',
            Val: localStorage.getItem('auth-default-cpecc-depCode') + '%',
            Operator: 'like',
          },
        ]}
      />
      {open && selectedRecord && (
        <QualitySeriousNonconformitiesDetail
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
        <QualitySeriousNonconformitiesAdd
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
        <QualitySeriousNonconformitiesEdit
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
export default connect()(QualitySeriousNonconformitiesPage);
