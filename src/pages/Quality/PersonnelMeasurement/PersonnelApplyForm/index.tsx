import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Space } from "antd";
import { connect, useIntl } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, PROP_KEY } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import InitiateApproval from "@/components/Approval/InitiateApproval";
import ViewApproval from "@/components/Approval/ViewApproval";
import { getDisplayHierarchy, getDefaultFiltersInspector, getUserInfoAndParams } from "@/utils/utils";
import { inspectorApprovalStatusTag } from "@/common/common";

import { configColumns } from "./columns";
import PersonnelApplyFormAdd from "./Add";
import PersonnelApplyFormDetail from "./Detail";
import PersonnelApplyFormEdit from "./Edit";

/**
 * 计量人员资格申请表
 * @constructor
 */
const PersonnelApplyFormPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const { formatMessage } = useIntl();
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

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
      "gender",
      "birth_date",
      "education",
      "employee_no",
      "job_title",
      "graduation_school",
      "major",
      "department",
      "post",
      "train_date",
      "train_grade",
      "phone",
      {
        "title": "PersonnelApplyForm.application_project",
        "subTitle": "申请操作项目",
        "dataIndex": "application_project",
        "width": 160,
        "align": "center",
        render: (text: any, _record: any) => {
          if (!text) return '/'
          const textString = JSON.parse(text).join(',');
          return (
            <>
              {textString || '/'}
            </>
          );
        }
      },

      "approval_date",
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
      .needToFixed([
        { value: 'approval_status', fixed: 'right' }
      ])
      .setTableColumnToDatePicker([
        { value: 'birth_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'train_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'approval_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
      .needToExport([
        ...getDisplayHierarchy(),
        'name',
        "gender",
        "birth_date",
        "education",
        "employee_no",
        "job_title",
        "graduation_school",
        "major",
        "department",
        "post",
        "train_date",
        "train_grade",
        "phone",
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
          PROP_KEY === 'dep' && (
            <Button
              type="primary"
              onClick={() => {
                setAddVisible(true);
              }}
            >
              新增
            </Button>
          )
        }
        <Button
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
      PROP_KEY === 'dep' && canInitiateApprovalAllRows && (
        <Button
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
        </Button>
      ),
      PROP_KEY !== 'branchComp' && selectedRows.length === 1 && (
        <InitiateApproval
          // style={{ display: hasPermission(authority, '发起审批') ? 'inline' : 'none' }}
          key={selectedRows?.id || 'default'} // 添加key属性强制重新渲染
          recordId={selectedRows[0]?.id}
          selectedRecord={{
            ...selectedRows[0],
            approval_schedule: !canInitiateApprovalAllRows
          }}
          dispatch={dispatch}
          funcode={'A03'}
          type='workLicenseRegister/personnelStartApproval'
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
            funcCode={'A03'}
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
      PROP_KEY === 'dep' && canInitiateApprovalAllRows && (
        <Button
          danger
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
                  type: "workLicenseRegister/deleteMeasurePersonnelApplication",
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
      )
    ]
  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='计量人员资格申请表'
        type="workLicenseRegister/getMeasurePersonnelApplication"
        exportType="workLicenseRegister/getMeasurePersonnelApplication"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getMeasurePersonne1lApplication'}
        tableSortOrder={{ sort: 'modify_ts', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={getDefaultFiltersInspector()}

      />
      {isOpen && selectedRecord && (
        <PersonnelApplyFormDetail
          open={isOpen}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setIsOpen(false)}
          callbackSuccess={() => {
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {addVisible && (
        <PersonnelApplyFormAdd
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
        <PersonnelApplyFormEdit
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
export default connect()(PersonnelApplyFormPage);
