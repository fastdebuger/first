import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { APPROVAL_FUNCODE, ErrorCode, WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import { configColumns } from "./columns";
import HMQAStaffNominationAdd from "./Add";
import HMQAStaffNominationDetail from "./Detail";
import HMQAStaffNominationEdit from "./Edit";
import ViewApproval from '@/components/Approval/ViewApproval';
import InitiateApproval from '@/components/Approval/InitiateApproval';
import ViewTheReport from '@/components/ViewTheReport';

/**
 * 起重机械安装修理质量保证体系责任人员推荐表
 * @constructor
 */
const HMQAStaffNominationPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // 根据项目部填报判断是否可以新增
  const isHMQAStaffNomination = useRef(false)

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      'wbs_name',
      'unit_name',
      {
        title: 'HMQAStaffNomination.construction_category',
        subTitle: '施工类别',
        dataIndex: 'construction_category',
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
      'description',
      "audit_status_name",
    ])
      .noNeedToFilterIcon([
        "RowNumber",
      ])
      .noNeedToSorterIcon([
        "RowNumber",
      ])
      .needToFixed([
        {
          fixed: "right",
          value: "audit_status_name",
        }
      ])
      .needToExport([
        "RowNumber",
        'wbs_name',
        'unit_name',
        'construction_category',
        'description',
      ])
    return cols.getNeedColumns();
  }


  /**
   * 查询用户是否填写特种设备网上告知相关信息统计表
   * 业务逻辑是 
   * 用户填写了特种设备网上告知相关信息统计表才能新增推荐人
   */
  useEffect(() => {
    dispatch({
      type: "SEOnlineNotification/getInfo",
      payload: {
        sort: 'id',
        order: 'desc',
        filter: JSON.stringify([
          { Key: 'wbs_code', Val: WBS_CODE, Operator: '=' }
        ])
      },
      callback: (res: any) => {
        isHMQAStaffNomination.current = res?.rows?.length > 0;
      },
    });
  }, [])

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
            if (isHMQAStaffNomination.current) {
              setAddVisible(true);
            } else {
              message.error("先维护【特种设备网上告知相关信息】才能填写【推荐表】")
            }
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
        recordMainId={selectedRecord?.main_id}
        // 是否允许发起审批audit_status
        allowedApproval={selectedRecord?.audit_status === "0"}
        selectedRecord={selectedRecord}
        dispatch={dispatch}
        funcode={APPROVAL_FUNCODE.HoistingMachineryQAStaffRecommendationApproval}
        type='hmQAStaffNomination/sendApproval'
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
        funcCode={APPROVAL_FUNCODE.HoistingMachineryQAStaffRecommendationApproval}
        selectedRecord={selectedRecord}
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }}
      />,
      <ViewTheReport
        query={`?viewlet=WeldSys2.0/Quality/Crane-Warranty.cpt&special_equip_type=${selectedRecord?.special_equip_type}&main_id=${selectedRecord?.main_id}`}
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
                type: "hmQAStaffNomination/delInfo",
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
        tableTitle='起重机械安装修理质量保证体系责任人员推荐表'
        moduleCaption="起重机械安装修理质量保证体系责任人员推荐表"
        type="hmQAStaffNomination/getHead"
        exportType="hmQAStaffNomination/getHead"
        tableColumns={getTableColumns()}
        funcCode={authority + "起重机械安装修理质量保证体系责任人员推荐表"}
        tableSortOrder={{ sort: 'main_id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        rowSelection={{ type: "radio" }}
        tableDefaultFilter={[
          { Key: 'wbs_code', Val: WBS_CODE + "%", Operator: 'like' }
        ]}
      />
      {open && selectedRecord && (
        <HMQAStaffNominationDetail
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
        <HMQAStaffNominationAdd
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
        <HMQAStaffNominationEdit
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
    </div>
  )
}
export default connect()(HMQAStaffNominationPage);
