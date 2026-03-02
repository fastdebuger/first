import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { APPROVAL_FUNCODE, ErrorCode, WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import { configColumns } from "./columns";
import SEOnlineNotificationAdd from "./Add";
import SEOnlineNotificationDetail from "./Detail";
import SEOnlineNotificationEdit from "./Edit";
import SEOnlineNotificationFillingMeasures from "./FillingMeasures";
import ViewApproval from '@/components/Approval/ViewApproval';
import InitiateApproval from '@/components/Approval/InitiateApproval';
import ViewTheReport from '@/components/ViewTheReport';

/**
 * 特种设备每日质量安全检查记录
 * 1.压力容器制造(组焊、安装改造修理)
 * 2.压力管道
 * 3.锅炉
 * 4.起重机械
 * 5.压力管道元件
 * @constructor
 */
const QualitySafetyDailyCheckPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority }, title = '特种设备每日质量安全检查记录', special_equip_type = "1" } = props;
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [fillingMeasuresVisible, setFillingMeasuresVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);


  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      {
        title: 'QualitySafetyDailyCheck.wbs_code',
        subTitle: '项目部',
        dataIndex: 'wbs_name',
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
      "preventive_measures",
      "create_by_name",
      "report_date",
      "create_date_str",
      // "audit_status_name",
      
    ])
      .noNeedToFilterIcon([
        "RowNumber",
      ])
      .noNeedToSorterIcon([
        "RowNumber",
      ])
      // .needToFixed([
      //   {
      //     fixed: "right",
      //     value: "audit_status_name",
      //   }
      // ])
      .needToExport([
        "RowNumber",
        'wbs_name',
        "preventive_measures",
        "create_by_name",
        "create_date_str",
        // "audit_status_name",
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
        {/* <Button
          type="primary"
          style={{ display: hasPermission(authority, '导入') ? 'inline' : 'none' }}
          onClick={(e) => {
            e.stopPropagation();
            setVisible(true);
          }}
        >导入</Button> */}
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
    const selectedRecord = selectedRows[0];
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
        style={{ display: hasPermission(authority, '填报措施') ? 'inline' : 'none' }}
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
          setFillingMeasuresVisible(true)
        }}
      >
        填报措施
      </Button>,
      // // 发起审批
      // hasPermission(authority, '发起审批') && <InitiateApproval
      //   key={selectedRecord?.RowNumber || 'default'} // 添加key属性强制重新渲染
      //   recordMainId={selectedRecord?.main_id}
      //   // 是否允许发起审批audit_status
      //   // allowedApproval={}
      //   checkApprovalEligibility={() => {
      //     if (selectedRecord?.audit_status !== "0") {
      //       message.warning('当前数据以发起审批无需重新发起')
      //       return false
      //     }
      //     if (!selectedRecord.preventive_measures) {
      //       message.warning('采取的防范措施填写完成才能发起审批')
      //       return false
      //     }
      //     return true
      //   }}
      //   selectedRecord={selectedRecord}
      //   dispatch={dispatch}
      //   funcode={APPROVAL_FUNCODE.PressureVesselDailyCheckApproval}
      //   type='QualitySafetyDailyCheck/sendApproval'
      //   onSuccess={() => {
      //     if (actionRef.current) {
      //       actionRef.current.reloadTable();
      //     }
      //   }}
      // />,
      // // 查看审批
      // <ViewApproval
      //   key={`view-${selectedRecord?.RowNumber || 'default'}`} // 添加key属性强制重新渲染
      //   instanceId={selectedRecord?.audit_id}
      //   funcCode={APPROVAL_FUNCODE.PressureVesselDailyCheckApproval}
      //   selectedRecord={selectedRecord}
      //   onSuccess={() => {
      //     if (actionRef.current) {
      //       actionRef.current.reloadTable();
      //     }
      //   }}
      // />,
      <ViewTheReport
        query={`?viewlet=WeldSys2.0/Quality/Quality-inspection.cpt&special_equip_type=${selectedRecord?.special_equip_type}&main_id=${selectedRecord?.main_id}`}
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
                type: "QualitySafetyDailyCheck/delInfo",
                payload: {
                  main_id: selectedRows[0]['main_id'],
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
        rowKey="main_id"
        tableTitle={title}
        moduleCaption={title}
        type="QualitySafetyDailyCheck/getHead"
        exportType="QualitySafetyDailyCheck/getHead"
        tableColumns={getTableColumns()}
        funcCode={authority + title}
        tableSortOrder={{ sort: 'main_id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        rowSelection={{ type: "radio" }}
        tableDefaultField={{
          special_equip_type
        }}
        tableDefaultFilter={[
          { Key: 'special_equip_type', Val: special_equip_type, Operator: '=' },
          { Key: 'wbs_code', Val: WBS_CODE + "%", Operator: 'like' }
        ]}
      />
      {open && selectedRecord && (
        <SEOnlineNotificationDetail
          special_equip_type={special_equip_type}
          title={title}
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
          special_equip_type={special_equip_type}
          title={title}
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackAddSuccess={() => {
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
          special_equip_type={special_equip_type}
          title={title}
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackEditSuccess={() => {
            setEditVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {fillingMeasuresVisible && (
        <SEOnlineNotificationFillingMeasures
          special_equip_type={special_equip_type}
          title={title}
          visible={fillingMeasuresVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setFillingMeasuresVisible(false)}
          callbackEditSuccess={() => {
            setFillingMeasuresVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  )
}
export default connect()(QualitySafetyDailyCheckPage);
