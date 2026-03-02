import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { ErrorCode, WBS_CODE } from "@/common/const";
import { configColumns } from "./columns";
import EngineeringAdd from "./Add";
import EngineeringEdit from "./Edit";

/**
 * 工程占比配置
 * @constructor
 */
const EngineeringPage: React.FC<any> = (props) => {
  const { dispatch, authority, title, config_type, tableTotalAddAbleCheck = false } = props;
  const actionRef: any = useRef();

  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const tableTotal = useRef<number>(0)

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      "engineering_name",
      "engineering_value",
    ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToExport([
        "RowNumber",
        "engineering_name",
        "engineering_value",
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
          // style={{ display: hasPermission(authority, '新增') ? 'inline' : 'none' }}
          type="primary"
          onClick={() => {
            if (typeof tableTotalAddAbleCheck === "number") {
              if (tableTotal.current >= tableTotalAddAbleCheck) {
                message.warning(`当前已配置 ${tableTotal.current} 条数据，已达到最大限制 ${tableTotalAddAbleCheck} 条，请编辑现有数据`);
                return;
              }
            }
            setAddVisible(true);
          }}
        >
          新增
        </Button>
      </Space >
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    if (selectedRows.length !== 1) {
      return []
    }
    return [
      <Button
        // style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
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
        // style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
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
                type: "engineering/delInfo",
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
      </Button>,
    ]
  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle={title}
        type="engineering/getInfo"
        exportType="engineering/getInfo"
        tableColumns={getTableColumns()}
        funcCode={authority + title}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        tableDefaultField={{ wbs_code: WBS_CODE }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        rowSelection={{ type: "radio" }}
        tableDefaultFilter={[
          { Key: 'config_type', Val: config_type, Operator: '=' }
        ]}
        handleResponse={(data: any) => {
          tableTotal.current = data.total
        }}
      />
      {addVisible && (
        <EngineeringAdd
          title={title}
          config_type={config_type}
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
      {editVisible && (
        <EngineeringEdit
          title={title}
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
export default connect()(EngineeringPage);
