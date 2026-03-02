import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, Col, Empty, message, Modal, Row, Space, Tree} from "antd";
import {connect} from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BaseImportModal, BasicTableColumns} from 'yayang-ui';
import {ErrorCode} from "@/common/const";

import {configColumns} from "./columns";
import SupplierContractAdd from "./Add";
import SupplierContractDetail from "./Detail";
import SupplierContractEdit from "./Edit";
import moment from 'moment';
import {getSupplierDateConfig} from "@/services/engineering/supplierDateConfig";
import {hasPermission} from "@/utils/authority";

/**
 * 供应商合同
 * @constructor
 */
const SupplierContractPage: React.FC<any> = (props) => {
  const { dispatch } = props;
  const actionRef: any = useRef();

  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [treeData, setTreeData] = React.useState<any>([{
    title: '年份',
    key: '0-0',
    children: []
  }]);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<any>({});

  /**
   * 包含两个接口，控制 current
   */
  const fetchList = async () => {
    // 请求公司级的配置接口
    const res: any = await getSupplierDateConfig({
      sort: 'year',
      order: 'desc',
    })
    if (res.rows.length > 0) {
      const arr: any[] = [];
      if (res.rows.length > 0) {
        res.rows.forEach((r: any) => {
          arr.push({ title: r.year, key: r.year, ...r });
        })
        setSelectedNodeInfo(arr[0]);
        setTreeData([{ title: '年份', key: '0-0', children: arr}]);
      }
    }
  }

  useEffect(() => {
    fetchList()
  }, []);

  /**
   * 是否在🉑上传合同的时间周期内
   */
  const hasOperateFunc = () => {
    const currDate = moment().format("YYYY-MM-DD");
    console.log('-----selectedNodeInfo', selectedNodeInfo)
    if (currDate >= selectedNodeInfo.upload_date_start && currDate <= selectedNodeInfo.upload_date_end) {
      return true;
    }
    return false;
  }

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      // "id",
      "year",
      "contract_no",
      "procurement_content",
      // "wbs_code",
      "buyer",
      "supplier_name",
      "supplier_code",
      "supplier_type",
      "contract_amount",
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
        "contract_no",
        "procurement_content",
        "wbs_code",
        "buyer",
        "supplier_name",
        "supplier_code",
        "supplier_type",
        "contract_amount",
        "year",
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
          style={{display: hasOperateFunc() ? 'inline' : 'none'}}
          type="primary"
          onClick={() => {
            setAddVisible(true);
          }}
        >
          新增
        </Button>
        <Button
          type="primary"
          style={{display: hasOperateFunc() ? 'inline' : 'none'}}
          onClick={(e) => {
            e.stopPropagation();
            setVisible(true);
          }}
        >导入</Button>
      </Space>,
      // <a
      //   // style={{display: hasPermission(authority, '导出') ? 'inline' : 'none'}}
      //   onClick={(e) => {
      //     if (actionRef.current) {
      //       actionRef.current.exportFile();
      //     }
      //   }}
      // >导出</a>
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
        style={{display: hasOperateFunc() ? 'inline' : 'none'}}
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
        style={{ display: hasOperateFunc() ? 'inline' : 'none' }}
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
                type: "supplierContract/deleteSupplierContract",
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

  const onSelect = (selectedKeys, info) => {
    setSelectedNodeInfo(info.node || null);
  };

  return (
    <div>
      {treeData[0].children.length > 0 ? (
        <Row gutter={8}>
          <Col span={4}>
            <strong style={{fontSize: 18}}>供应商合同</strong>
            <Tree
              style={{marginTop: 8}}
              selectedKeys={[selectedNodeInfo.key]}
              defaultExpandedKeys={['0-0']}
              onSelect={onSelect}
              treeData={treeData}
            />
          </Col>
          <Col span={20}>
            <div>
              <BaseCurdSingleTable
                cRef={actionRef}
                rowKey="id"
                tableTitle='供应商合同'
                type="supplierContract/getSupplierContract"
                exportType="supplierContract/getSupplierContract"
                tableColumns={getTableColumns()}
                funcCode={'供应商合同'}
                renderSelfToolbar={() => {
                  return (
                    <Alert type={'warning'} message={<span>请在规定时间段 <strong>{selectedNodeInfo.upload_date_start} ~ {selectedNodeInfo.upload_date_end}</strong> 内上传需要打分的合同, 过期将无法上传</span>}/>
                  )
                }}
                tableSortOrder={{ sort: 'create_ts', order: 'desc' }}
                tableDefaultFilter={[
                  {Key: 'year', Val: selectedNodeInfo.year, Operator: '='}
                ]}
                buttonToolbar={renderButtonToolbar}
                selectedRowsToolbar={renderSelectedRowsToolbar}
              />
            </div>
          </Col>
        </Row>
      ) : (
        <Empty description={'需要公司级发起开始本年度开始评分的时间段,才能上传'}/>
      )}
      {open && selectedRecord && (
        <SupplierContractDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={'供应商合同'}
          onClose={() => setOpen(false)}
          callbackSuccess={() => {
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {addVisible && (
        <SupplierContractAdd
          visible={addVisible}
          year={selectedNodeInfo.year}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            setAddVisible(false);
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {editVisible && (
        <SupplierContractEdit
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
      {visible && (
        <BaseImportModal
          visible={visible}
          onCancel={() => setVisible(false)}
          startUploadFile={(file: any) => {
            if(actionRef.current) {
              return actionRef.current.importFile(file, 'supplierContract', () => {
                setVisible(false);
              });
            }
          }}
          downLoadTemplate={() => {
            if (actionRef.current) {
              actionRef.current.downloadImportFile('supplierContract');
            }
          }}
        />
      )}
    </div>
  )
}
export default connect()(SupplierContractPage);
