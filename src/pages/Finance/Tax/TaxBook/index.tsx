import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, Empty, message, Modal, Row, Space, Tree} from "antd";
import {connect} from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BasicTableColumns, BaseImportModal} from 'yayang-ui';
import {ErrorCode} from "@/common/const";
import {hasPermission} from "@/utils/authority";

import {configColumns} from "./columns";
import TaxBookAdd from "./Add";
import TaxBookDetail from "./Detail";
import TaxBookEdit from "./Edit";
import moment from 'moment';

/**
 * 税金台账
 * @constructor
 */
const TaxBookPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const depCode = localStorage.getItem('auth-default-cpecc-depCode');
  const propKey = localStorage.getItem('auth-default-wbs-prop-key');
  // 获取去年的年份
  const lastYear = moment().subtract(1, 'years').year();
  const currYear = moment().year();
  const nextYear = moment().add(1, 'year').year()
  const currMonth = moment().format('YYYY-MM');

  const [treeData, setTreeData] = React.useState<any>([]);
  const [selectedKeys, setSelectedKeys] = React.useState<any>([]);

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const arr: any[] = [];
    [lastYear, currYear, nextYear].forEach(item => {
      const _children: any[] = [];
      ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].forEach(n => {
        _children.push({
          key: `${item}-${n}`,
          title: `${Number(n)}月份`
        })
      })
      arr.push({
        key: item,
        title: `${item}年`,
        children: _children,
      })
    })
    setSelectedKeys([currMonth])
    setTreeData(arr);
  }, [])

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      // "id",
      "month",
      propKey === 'dep' ? 'contract_no' : '',
      "accounting_subject",
      "accounting_subject_descripe",
      "funtional_scope",
      "funtional_scope_descripe",
      "beginning_month_amount",
      "debit_amount",
      "creditor_amount",
      "ending_month_amount",
      "profit_center_code",
      "voucher_no",
      "voucher_detail",
      "row_project",
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
        {value: 'create_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'modify_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      ])
      .needToExport([
        // "id",
        "month",
        propKey === 'dep' ? 'contract_no' : '',
        "accounting_subject",
        "accounting_subject_descripe",
        "funtional_scope",
        "funtional_scope_descripe",
        "beginning_month_amount",
        "debit_amount",
        "creditor_amount",
        "ending_month_amount",
        "profit_center_code",
        "voucher_no",
        "voucher_detail",
        "row_project",
        "create_ts",
        "create_tz",
        "create_user_code",
        "create_user_name",
        "modify_ts",
        "modify_tz",
        "modify_user_code",
        "modify_user_name",
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
          style={{display: hasPermission(authority, '新增') ? 'inline' : 'none'}}
          type="primary"
          onClick={() => {
            setAddVisible(true);
          }}
        >
          新增
        </Button>
        <Button
          type="primary"
          style={{display: hasPermission(authority, '导入') ? 'inline' : 'none'}}
          onClick={(e) => {
            e.stopPropagation();
            setVisible(true);
          }}
        >导入</Button>
      </Space>,
      <a
        style={{display: hasPermission(authority, '导出') ? 'inline' : 'none'}}
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
        style={{display: hasPermission(authority, '编辑') ? 'inline' : 'none'}}
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
                type: "taxBook/delTaxBook",
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

  const onSelect = (_selectedKeys, info) => {
    console.log(info.node);
    setSelectedKeys(_selectedKeys);
  };

  return (
    <div>
      <Row gutter={8}>
        <Col span={2}>
          <strong style={{fontSize: 18}}>税金台账</strong>
          {treeData.length > 0 ? (
            <Tree
              style={{marginTop: 8}}
              selectedKeys={selectedKeys}
              defaultExpandedKeys={[currYear]}
              onSelect={onSelect}
              treeData={treeData}
            />
          ) : (
            <Empty/>
          )}
        </Col>
        <Col span={22}>
          {selectedKeys.length > 0 && (
            <div key={selectedKeys[0]}>
              <BaseCurdSingleTable
                cRef={actionRef}
                rowKey="id"
                tableTitle={`${selectedKeys[0]}`}
                type="taxBook/queryTaxBook"
                importType="taxBook/importTaxBook"
                tableColumns={getTableColumns()}
                funcCode={'税金台账'}
                tableSortOrder={{ sort: 'month', order: 'desc' }}
                tableDefaultFilter={[
                  {Key: 'month', Val: selectedKeys[0], Operator: '='},
                  {Key: 'dep_code', Val: depCode, Operator: '='},
                ]}
                buttonToolbar={renderButtonToolbar}
                selectedRowsToolbar={renderSelectedRowsToolbar}
              />
            </div>
          )}
        </Col>
      </Row>
      {open && selectedRecord && (
        <TaxBookDetail
          open={open}
          selectedMonth={selectedKeys[0]}
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
        <TaxBookAdd
          selectedMonth={selectedKeys[0]}
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
              formData.append('month', selectedKeys[0]);
              formData.append('prop_key', propKey);
              const template = propKey === 'dep' ? 'taxbook_dep' : 'taxbook'
              return actionRef.current.importFile(file, template, () => {
                setVisible(false);
              }, formData);
            }
          }}
          downLoadTemplate={() => {
            if (actionRef.current) {
              const template = propKey === 'dep' ? 'taxbook_dep' : 'taxbook'
              actionRef.current.downloadImportFile(template);
            }
          }}
        />
      )}
      {editVisible && (
        <TaxBookEdit
          selectedMonth={selectedKeys[0]}
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
export default connect()(TaxBookPage);
