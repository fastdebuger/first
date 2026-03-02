import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { APPROVAL_FUNCODE, ErrorCode, WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import { configColumns } from "./columns";
import DispatchMeetingAdd from "./Add";
import DispatchMeetingDetail from "./Detail";
import DispatchMeetingEdit from "./Edit";
import InitiateApproval from '@/components/Approval/InitiateApproval';
import ViewApproval from '@/components/Approval/ViewApproval';
import ViewTheReport from '@/components/ViewTheReport';

/**
 * 特种设备每月质量安全调度会议纪要信息
 * @constructor
 */
const DispatchMeetingPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority }, title, special_equip_type } = props;
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
      "wbs_name",
      "meeting_date",
      {
        title: 'DispatchMeeting.meeting_place',
        subTitle: '会议地点',
        dataIndex: 'meeting_place',
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
      "meeting_moderator",
      'meeting_recorder',
      "conferee",
      "meeting_content1",
      "meeting_content2",
      "meeting_content3",
      "meeting_content4",
      "meeting_content5",
      "meeting_content6",
      "remark",
      "create_date_str",
      "audit_status_name"
    ])
      .setTableColumnToDatePicker([
        { value: 'meeting_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
      .noNeedToFilterIcon(["RowNumber",])
      .noNeedToSorterIcon(["RowNumber",])
      .needToFixed([
        {
          value: "audit_status_name",
          fixed: 'right'
        }
      ])
      .needToExport([
        "RowNumber",
        "wbs_name",
        "meeting_date",
        'meeting_place',
        "meeting_moderator",
        'meeting_recorder',
        "conferee",
        "meeting_content1",
        "meeting_content2",
        "meeting_content3",
        "meeting_content4",
        "meeting_content5",
        "meeting_content6",
        "remark",
        "create_date_str",
        "audit_status_name"
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
      // 发起审批
      hasPermission(authority, '发起审批') && <InitiateApproval
        key={selectedRecord?.RowNumber || 'default'} // 添加key属性强制重新渲染
        recordId={selectedRecord?.id}
        // 是否允许发起审批audit_status
        allowedApproval={selectedRecord?.audit_status === "0"}
        selectedRecord={selectedRecord}
        dispatch={dispatch}
        funcode={APPROVAL_FUNCODE.PressureVesselMonthlyMeetingApproval}
        type='dispatchMeeting/sendApproval'
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
        funcCode={APPROVAL_FUNCODE.PressureVesselMonthlyMeetingApproval}
        selectedRecord={selectedRecord}
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }}
      />,
      <ViewTheReport
        query={`?viewlet=WeldSys2.0/Quality/Quality-Meeting.cpt&special_equip_type=${selectedRecord?.special_equip_type}&id=${selectedRecord?.id}`}
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
                type: "dispatchMeeting/delInfo",
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
        tableTitle={title}
        type="dispatchMeeting/getInfo"
        exportType="dispatchMeeting/getInfo"
        tableColumns={getTableColumns()}
        funcCode={authority + title}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
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
        <DispatchMeetingDetail
          title={title}
          special_equip_type={special_equip_type}
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
        <DispatchMeetingAdd
          title={title}
          special_equip_type={special_equip_type}
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
        <DispatchMeetingEdit
          title={title}
          special_equip_type={special_equip_type}
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
export default connect()(DispatchMeetingPage);
