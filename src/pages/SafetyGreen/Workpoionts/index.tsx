import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Space } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, PROP_KEY, WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { configColumns } from "./columns";
import WorkpoiontsAdd from "./Add";
import WorkpoiontsDetail from "./Detail";
import WorkpoiontsEdit from "./Edit";
import { getOrgLevelFieldKey } from '@/utils/utils';
import PersonnelInfo from './PersonnelInfo';
import InitiateApproval from '@/components/Approval/InitiateApproval';
import ViewApproval from '@/components/Approval/ViewApproval';

/**
 * 记分管理
 * @constructor
 */
const WorkpoiontsPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [personnelInfoVisible, setPersonnelInfoVisible] = useState(false);
  // 判断是否是项目部
  const isDep = getOrgLevelFieldKey(false, false, true);
  // 判断是否是分公司
  const isSub = getOrgLevelFieldKey(false, true, false);

  /**
   * table配置
   * @returns
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      // "safety_inspection_id",
      {
        title: 'compinfo.push_wbs_code',
        subTitle: '推送项目部',
        dataIndex: 'push_wbs_name',
        align: 'center',
        width: 160,
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
      'examine_wbs_name',
      'project_name',
      'report_date_str',
      'problem_description',
      'question_type_name',
      'hazard_level_name',
      "audit_status_name",
    ])
      .needToFixed([
        {
          value: "audit_status_name",
          fixed: "right"
        }
      ])
      .needToExport([
        'push_wbs_code',
        'examine_wbs_name',
        'project_name',
        'report_date_str',
        'problem_description',
        'question_type_name',
        'hazard_level_name',
        "audit_status_name",
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
          // style={{display: hasPermission(authority, '新增') ? 'inline' : 'none'}}
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
   * 检查当前记录是否符合进行审批操作的资格。
   * @param selectedRecord 当前选中的记录数据。
   * @param isSub 当前用户是否为分公司用户（假设isSub来自外部作用域）。
   * @returns boolean - 如果符合所有审批条件则返回 true，否则返回 false。
   */
  const checkApprovalEligibility = (selectedRecord: any, isDep: boolean): boolean => {
    // 1. 定义所有不满足条件时的错误信息
    let errorMessage = '';
    // 1. 检查审批状态 (audit_status 必须是 "0" - 待审批,3是驳回)
    if (
      String(selectedRecord?.audit_status) === "1" ||
      String(selectedRecord?.audit_status) === "2"
    ) {
      errorMessage = "审批已进行或正在进行中..."; // 将“审批中”改为更明确的提示
    }
    // 2. 检查当前用户权限 (是否是项目部 isDep)
    else if (!isDep) {
      errorMessage = "请项目部进行审批...";
    }
    // 3. 检查是否有维护人员 (detailCount > 0)
    else if (selectedRecord?.detailCount < 1) {
      errorMessage = "请项目部维护管理人员...";
    }

    if (errorMessage) {
      // 如果存在错误信息，则进行提示并返回
      message.info(errorMessage);
      return false;
    }
    // 所有检查都通过
    return true;
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    const selectedRecord = selectedRows[0]
    return [
      <Button
        style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => {
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
        style={{ display: hasPermission(authority, '人员信息维护') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warn('每次只能操作一条数据');
            return;
          }
          // 处理开始到结束审批流程后 人员信息不允许维护
          // 处理驳回可以开始维护人员信息
          if (selectedRecord?.audit_status_name === '审批中' || selectedRecord?.audit_status_name === '已通过') {
            message.warn('开始审批的单子不允许维护人员信息');
            return
          }
          setSelectedRecord(selectedRows[0]);
          setPersonnelInfoVisible(true)
        }}
      >
        人员信息维护
      </Button>,
      // 发起审批
      <InitiateApproval
        key={selectedRecord?.RowNumber || 'default'} // 添加key属性强制重新渲染
        recordMainId={selectedRecord?.main_id}
        selectedRecord={selectedRecord}
        checkApprovalEligibility={() => checkApprovalEligibility(selectedRecord, isDep)}
        allowedApproval={true}
        dispatch={dispatch}
        funcode={'S28'}
        type='workpoionts/sendApproval'
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
        funcCode={'S28'}
        number={selectedRecord?.number}
        selectedRecord={selectedRecord}
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }}
      />,
      // 人员信息
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
                type: "workpoionts/delInfo",
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
        tableTitle='记分管理'
        type="workpoionts/getInfo"
        exportType="workpoionts/getInfo"
        tableColumns={getTableColumns()}
        funcCode={authority}
        tableSortOrder={{ sort: 'main_id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        rowSelection={{ type: "radio" }}
        tableDefaultFilter={
          [
            // 项目部查看
            isDep ? { Key: 'push_wbs_code', Val: WBS_CODE + "%", Operator: 'like' } : "",
            // 分公司查看
            isSub ? { Key: 'branch_comp_code', Val: WBS_CODE + "%", Operator: 'like' } : "",
          ]
            .filter(Boolean)
        }
      />
      {/* 详情 */}
      {open && selectedRecord && (
        <WorkpoiontsDetail
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
      {/* 新增 */}
      {addVisible && (
        <WorkpoiontsAdd
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
      {/* 导入 */}
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
      {/* 编辑 */}
      {editVisible && (
        <WorkpoiontsEdit
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
      {/* 维护人员组件 */}
      {personnelInfoVisible && (
        <PersonnelInfo
          visible={personnelInfoVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setPersonnelInfoVisible(false)}
          callbackSuccess={() => {
            setPersonnelInfoVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  )
}
export default connect()(WorkpoiontsPage);
