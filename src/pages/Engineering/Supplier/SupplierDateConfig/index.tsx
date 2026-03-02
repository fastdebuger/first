import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, Dropdown, message, Modal, Space} from "antd";
import {connect} from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BasicTableColumns, BaseImportModal} from 'yayang-ui';
import {ErrorCode} from "@/common/const";
import {hasPermission} from "@/utils/authority";

import {configColumns} from "./columns";
import SupplierDateConfigAdd from "./Add";
import SupplierDateConfigDetail from "./Detail";
import SupplierDateConfigEdit from "./Edit";

/**
 * 供应商打分日期配置
 * @constructor
 */
const SupplierDateConfigPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

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
      // "id",
      "year",
      "upload_date_start",
      "upload_date_end",
      "score_date_start",
      "score_date_end",
      "create_ts",
      // "create_tz",
      // "create_user_code",
      "create_user_name",
      "modify_ts",
      // "modify_tz",
      // "modify_user_code",
      "modify_user_name",
    ])
      .setTableColumnToDatePicker([
        {value: 'upload_date_start', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'upload_date_end', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'score_date_start', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'score_date_end', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'create_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'modify_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      ])
      .needToExport([
        "year",
        "upload_date",
        "score_date_start",
        "score_date_end",
      ])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   */
  const renderButtonToolbar = (tableRef, selectedRows) => {
    return [
      <Space>
        <Dropdown menu={{ items: [
            {
              key: '1',
              label: (
                <a rel="noopener noreferrer" onClick={(e) => {
                  e.stopPropagation();
                  setAddVisible(true);
                }}>
                  配置合同上传时间段
                </a>
              ),
            },
            {
              key: '2',
              label: (
                <a rel="noopener noreferrer" onClick={(e) => {
                  e.stopPropagation();
                  const selectedRows = tableRef.current.getSelectedRows();
                  if (selectedRows.length !== 1) {
                    message.warn('每次只能配置一条数据');
                    return;
                  }
                  console.log('------selectedRows', selectedRows);
                  setSelectedRecord(selectedRows[0]);
                  setEditVisible(true);
                }}>
                  配置合同打分时间段
                </a>
              ),
            },
          ] }} placement="bottomLeft" arrow>
          <Button
            style={{display: hasPermission(authority, '配置') ? 'inline' : 'none'}}
            type="primary"
          >
            配置
          </Button>
        </Dropdown>
      </Space>
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      // <Button
      //   style={{display: hasPermission(authority, '编辑') ? 'inline' : 'none'}}
      //   type={"primary"}
      //   onClick={() => {
      //     if (selectedRows.length === 0) {
      //       message.warn('请选择一条数据');
      //       return;
      //     }
      //     if (selectedRows.length !== 1){
      //       message.warn('每次只能操作一条数据');
      //       return;
      //     }
      //     setSelectedRecord(selectedRows[0]);
      //     setEditVisible(true)
      //   }}
      // >
      //   编辑
      // </Button>,
      <Button
        style={{display: hasPermission(authority, '配置合同打分时间段') ? 'inline' : 'none'}}
        onClick={() => {
        if (selectedRows.length !== 1) {
          message.warn('每次只能配置一条数据');
          return;
        }
        console.log('------selectedRows', selectedRows);
        setSelectedRecord(selectedRows[0]);
        setEditVisible(true);
      }}>
        配置合同打分时间段
      </Button>,
      // <Button
      //   danger
      //   ghost
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
      //           type: "supplierDateConfig/deleteSupplierDateConfig",
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
  const getMessage = () => {
    return (
      <div>
        首先：配置一个合同上传的时间段，通知各二级单位后，他们在这个时间段把合同上传上来，
        <br/>
        然后配置打分时间段，打分时间段一旦配置完毕二级单位就不能上传合同了，他们在打分时间段内进行打分
      </div>
    )
  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='供应商打分日期配置'
        type="supplierDateConfig/getSupplierDateConfig"
        exportType="supplierDateConfig/getSupplierDateConfig"
        importType="supplierDateConfig/importSupplierDateConfig"
        tableColumns={getTableColumns()}
        renderSelfToolbar={() => {
          return (
            <Alert type={'info'} message={getMessage()}/>
          )
        }}
        funcCode={authority}
        tableSortOrder={{ sort: 'year', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {open && selectedRecord && (
        <SupplierDateConfigDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
          callbackSuccess={() => {
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {addVisible && (
        <SupplierDateConfigAdd
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
        <SupplierDateConfigEdit
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
export default connect()(SupplierDateConfigPage);
