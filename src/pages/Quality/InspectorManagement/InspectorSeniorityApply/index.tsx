import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space, Popover, Tag } from "antd";
import { connect, useIntl } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { ErrorCode, PROP_KEY, CURR_USER_CODE } from "@/common/const";
import { inspectorApprovalStatusTag } from "@/common/common";
import { hasPermission } from "@/utils/authority";
import InitiateApproval from "@/components/Approval/InitiateApproval";
import ViewApproval from "@/components/Approval/ViewApproval";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import { getDefaultFiltersInspector, getUserInfoAndParams, getDisplayHierarchy } from "@/utils/utils";

import { configColumns } from "./columns";
import Add from "./Add";
import Detail from "./Detail";
import Edit from "./Edit";

/**
 * 质量检查员资格申请表
 * @constructor
 */
const InspectorSeniorityApply: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const { formatMessage } = useIntl();
  // 控制添加弹窗显示状态的状态变量
  const [addVisible, setAddVisible] = useState<boolean>(false);
  // 控制编辑弹窗显示状态的状态变量
  const [editVisible, setEditVisible] = useState<boolean>(false);
  // 控制某个面板或菜单展开状态的状态变量
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // 存储当前选中记录数据的状态变量
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      ...getDisplayHierarchy(),
      {
        "title": "InspectorSeniorityApply.name",
        "subTitle": "姓名",
        "dataIndex": "name",
        "width": 160,
        "align": "center",
        render(text: any, record: any) {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record);
                setIsOpen(true);
              }}
              style={{ color: '#1890ff', cursor: 'pointer' }}
            >
              {text}
            </a>
          );
        }
      },
      'gender',
      'birth_date',
      'job',
      'job_title',
      'work_date',
      'education',
      'graduation_school',
      'major',
      'related_work_date',
      'apply_major',
      // 'job_resume',

      'approval_date',
      {
        title: "contract.file_url",
        subTitle: "附件",
        dataIndex: "url",
        width: 160,
        align: "center",
        render: (text: any, _record: any) => {
          if (text) {
            return (
              <Button
                onClick={() => window.open(getUrlCrypto(text))}
                size='small'
                type='link'
              >{formatMessage({ id: 'wrokLicenseRegister.download' })}</Button>
            )
          }
          return '/'
        }
      },
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      'modify_user_name',
      {
        "title": "common.status",
        "subTitle": "审批状态",
        "dataIndex": "approval_status",
        "width": 160,
        "align": "center",
        render: (text: any, _record: any) => {
          return inspectorApprovalStatusTag(text);
        }
      },
    ])
      .needToFixed([{ value: 'approval_status', fixed: 'right' }])
      .setTableColumnToDatePicker([
        { value: 'birth_date', valueType: 'dateTs' },
        { value: 'work_date', valueType: 'dateTs' },
        { value: 'related_work_date', valueType: 'dateTs' },
        { value: 'approval_date', valueType: 'dateTs' },
      ])
      .needToExport([
        'sub_comp_name',
        'dep_name',
        'name',
        'gender',
        'birth_date',
        'job',
        'job_title',
        'work_date',
        'education',
        'graduation_school',
        'major',
        'related_work_date',
        'apply_major',
        'approval_date',
        "create_ts_str",
        "create_user_name",
        "modify_ts_str",
        'modify_user_name'
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
        {
          PROP_KEY !== 'branchComp' && <Button
            // style={{ display: hasPermission(authority, '新增') ? 'inline' : 'none' }}
            type="primary"
            onClick={() => {
              setAddVisible(true);
            }}
          >
            新增
          </Button>
        }
        <Button
          // style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
          onClick={(e) => {
            if (actionRef.current) {
              actionRef.current.exportFile();
            }
          }}
        >导出</Button>
      </Space>

    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any, reloadTable: (filters?: [], noFilters?: []) => void) => {
    // 修改发起审批功能，如果flow_status等于0或者3则可以发起审批
    const canInitiateApprovalAllRows = selectedRows.every((row: any) => [0, -1].includes(Number(row.approval_status)));
    const userInfo = getUserInfoAndParams();
    return [
      PROP_KEY !== 'branchComp' && canInitiateApprovalAllRows && (
        <Button
          // style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
          type={"primary"}
          onClick={() => {
            if (selectedRows.length !== 1) {
              message.warn('每次只能操作一条数据');
              return;
            }
            // CURR_USER_CODE 当前用户编码
            if(selectedRows[0].create_user_code !== CURR_USER_CODE){
              message.error('您不是申请人无操作权限！');
              return;
            }
            setSelectedRecord(selectedRows[0]);
            setEditVisible(true)
          }}
        >
          编辑
        </Button>
      ),
      PROP_KEY !== 'branchComp' && selectedRows.length === 1 && (
        <InitiateApproval
          // style={{ display: hasPermission(authority, '发起审批') ? 'inline' : 'none' }}
          key={selectedRows?.RowNumber || 'default'} // 添加key属性强制重新渲染
          recordId={selectedRows[0]?.id}
          selectedRecord={{
            ...selectedRows[0],
            approval_schedule: !canInitiateApprovalAllRows
          }}
          dispatch={dispatch}
          funcode={'A01'}
          type='workLicenseRegister/inspectorStartApproval'
          onSuccess={() => {
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      ),
      [
        selectedRows?.length === 1 && (
          <ViewApproval
            // style={{ display: hasPermission(authority, '查看审批') ? 'inline' : 'none' }}
            key={`view-${selectedRows[0]?.RowNumber || 'default'}`} // 添加key属性强制重新渲染
            instanceId={selectedRows[0]?.approval_process_id}
            funcCode={'A01'}
            id={selectedRows[0]?.id}
            selectedRecord={{
              ...selectedRows[0],
              ...userInfo
            }}
            onSuccess={() => {
              if (actionRef.current) {
                actionRef.current.reloadTable();
              }
            }}
          />
        )
      ],
      PROP_KEY !== 'branchComp' && canInitiateApprovalAllRows && (
        <Button
          danger
          // style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
          type={"primary"}
          onClick={() => {
            if (selectedRows.length !== 1) {
              message.warning("每次只能删除一条数据");
              return;
            }
            // CURR_USER_CODE 当前用户编码
            if(selectedRows[0].create_user_code !== CURR_USER_CODE){
              message.error('您不是申请人无操作权限！');
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
                  type: "workLicenseRegister/deleteInspectorApplication",
                  payload: {
                    id: selectedRows[0].id,
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
      )
    ]
  }

  return (
    <>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle={formatMessage({ id: 'InspectorSeniorityApply' })}
        type="workLicenseRegister/getInspectorApplication"
        exportType="workLicenseRegister/getInspectorApplication"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getInspectorApplication2'}
        tableSortOrder={{ sort: 'modify_ts', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={getDefaultFiltersInspector()}
      />
      {addVisible && (
        <Add
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
        <Edit
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
      {isOpen && (
        <Detail
          visible={isOpen}
          selectedRecord={selectedRecord}
          onCancel={() => setIsOpen(false)}
          callbackSuccess={() => {
            setIsOpen(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </>
  )
}
export default connect()(InspectorSeniorityApply);
