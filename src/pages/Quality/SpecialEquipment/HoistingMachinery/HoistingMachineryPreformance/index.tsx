import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { APPROVAL_FUNCODE, ErrorCode, PROP_KEY, WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import { configColumns } from "./columns";
import HoistingMachineryPreformanceAdd from "./Add";
import HoistingMachineryPreformanceDetail from "./Detail";
import HoistingMachineryPreformanceEdit from "./Edit";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import InitiateApproval from '@/components/Approval/InitiateApproval';
import ViewApproval from '@/components/Approval/ViewApproval';

/**
 * 起重机械施工业绩表
 * @constructor
 */
const HoistingMachineryPreformancePage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);


  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      'branch_comp_name', // 分公司名称
      'wbs_name', // 项目部名称
      // 'project_name', // 工程项目名称
      {
        title: 'pressureVesselPreformance.project_name',
        subTitle: '工程项目名称',
        dataIndex: 'project_name',
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
      'completion_date_str', // 竣工日期
      "equipment_type",// 设备级别
      "hoisting_machinery_variety", // 品种(型式)-
      "hoisting_machinery_model", // 型号(参数)-
      'equipment_name', // 设备名称
      "height",// 起升高度(m)-
      "rated_load_weight",// 额定起重量(m)-
      "span",// 跨度(m)-
      'quantity', // 数量
      'user_unit_name', // 使用单位名称
      'inspection_unit_name', // 监检单位名称
      // 'inspection_report_file', // 上传监检报告
      {
        title: 'pressureVesselPreformance.inspection_report_file',
        dataIndex: 'inspection_report_file',
        subTitle: '上传监检报告',
        align: 'center',
        width: 160,
        render: (text: any) => {
          if (text) {
            return (
              <Button
                onClick={() => window.open(getUrlCrypto(text))}
                size='small'
                type='link'
              >下载文件</Button>
            )
          }
          return '-'
        }
      },
      'audit_status_name',//审批状态
    ])
      .noNeedToFilterIcon([
        "RowNumber",
      ])
      .noNeedToSorterIcon([
        "RowNumber",
      ])
      .needToFixed([
        {
          value: 'audit_status_name',
          fixed: "right"
        }
      ])
      .needToExport([
        "RowNumber",
        'branch_comp_name', // 分公司名称
        'wbs_name', // 项目部名称
        'project_name', // 工程项目名称
        'completion_date_str', // 竣工日期
        "equipment_type",// 设备级别
        "hoisting_machinery_variety", // 品种(型式)-
        "hoisting_machinery_model", // 型号(参数)-
        'equipment_name', // 设备名称
        "height",// 起升高度(m)-
        "rated_load_weight",// 额定起重量(m)-
        "span",// 跨度(m)-
        'quantity', // 数量
        'user_unit_name', // 使用单位名称
        'inspection_unit_name', // 监检单位名称
        'inspection_report_file', // 上传监检报告
        'audit_status_name',//审批状态
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
    const selectedRecord = selectedRows.length ? selectedRows[0] : {}
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
      // 发起审批
      hasPermission(authority, '发起审批') && <InitiateApproval
        key={selectedRecord?.RowNumber || 'default'} // 添加key属性强制重新渲染
        recordId={selectedRecord?.id}
        // 是否允许发起审批audit_status
        allowedApproval={selectedRecord?.audit_status === "0"}
        selectedRecord={selectedRecord}
        dispatch={dispatch}
        funcode={APPROVAL_FUNCODE.HoistingMachineryConstructionPerformanceApproval}
        type='hoistingMachineryPreformance/sendApproval'
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }}
      />,
      // 查看审批
      <ViewApproval
        key={`view-${selectedRecord?.RowNumber || 'default'}`} // 添加key属性强制重新渲染
        instanceId={selectedRecord?.audit_id}
        funcCode={APPROVAL_FUNCODE.HoistingMachineryConstructionPerformanceApproval}
        selectedRecord={selectedRecord}
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }}
      />,
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
                type: "hoistingMachineryPreformance/delInfo",
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
        tableTitle='起重机械施工业绩表'
        moduleCaption='起重机械施工业绩表'
        type="hoistingMachineryPreformance/getInfo"
        exportType="hoistingMachineryPreformance/getInfo"
        tableColumns={getTableColumns()}
        funcCode={authority + "起重机械施工业绩表"}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        tableDefaultField={{ prop_key: PROP_KEY }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        rowSelection={{ type: "radio" }}
        tableDefaultFilter={[
          { Key: 'wbs_code', Val: WBS_CODE + "%", Operator: 'like' }
        ]}
      />
      {open && selectedRecord && (
        <HoistingMachineryPreformanceDetail
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
        <HoistingMachineryPreformanceAdd
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
        <HoistingMachineryPreformanceEdit
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
export default connect()(HoistingMachineryPreformancePage);
