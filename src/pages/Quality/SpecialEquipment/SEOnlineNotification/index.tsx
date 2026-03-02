import React, { useMemo, useRef, useState } from 'react';
import { Button, message, Modal, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { configColumns } from "./columns";
import SEOnlineNotificationAdd from "./Add";
import SEOnlineNotificationDetail from "./Detail";
import SEOnlineNotificationEdit from "./Edit";

/**
 * 特种设备网上告知相关信息统计表
 * @constructor
 */
const SEOnlineNotificationPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  /**
   * 初始化过滤条件
   */
  const tableDefaultFilter = useMemo(() => {
    const baseFilter: any[] = [{ Key: 'wbs_code', Val: WBS_CODE + "%", Operator: 'like' }];
    // 如果有查看权限，则查看所有的数据
    return hasPermission(authority, "查看") ? [] : baseFilter
  }, [authority]);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      "wbs_name",
      "province_name",
      "city_name",
      "account",
      "account_password",
      {
        title: 'SEOnlineNotification.equipment_category',
        subTitle: '特种设备种类',
        dataIndex: 'equipment_category',
        align: 'center',
        width: 200,
        render: (text: any, record: any) => {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record)
                setOpen(true)
              }}
            >
              {text}
            </a>
          );
        },
      },
      "platform_name",
      "platform_url",
      "applicant_contact",
      "remark",
      "create_date_str"
    ])
      .noNeedToFilterIcon([
        "RowNumber",
      ])
      .noNeedToSorterIcon([
        "RowNumber",
      ])
      .needToExport([
        "RowNumber",
        "wbs_name",
        "province_name",
        "city_name",
        "account",
        "account_password",
        "equipment_category",
        "platform_name",
        "platform_url",
        "applicant_contact",
        "remark",
        "create_date_str"
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
                type: "SEOnlineNotification/delInfo",
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
        tableTitle='特种设备网上告知相关信息统计表'
        moduleCaption="特种设备网上告知相关信息统计表"
        type="SEOnlineNotification/getInfo"
        exportType="SEOnlineNotification/getInfo"
        tableColumns={getTableColumns()}
        funcCode={authority + "特种设备网上告知相关信息统计表"}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={tableDefaultFilter}
      />
      {open && selectedRecord && (
        <SEOnlineNotificationDetail
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
        <SEOnlineNotificationAdd
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
        <SEOnlineNotificationEdit
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
export default connect()(SEOnlineNotificationPage);
