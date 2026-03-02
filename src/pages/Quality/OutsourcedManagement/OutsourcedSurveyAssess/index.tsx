import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Space } from "antd";
import { connect, useIntl } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, PROP_KEY, CURR_USER_CODE } from "@/common/const";
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
 * 外委实验室调查评价
 * @constructor
 */
const OutsourcedSurveyAssess: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const { formatMessage } = useIntl();
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      ...getDisplayHierarchy(),
      {
        "title": "wrokLicenseRegister.lab_full_name",
        "subTitle": "姓名",
        "dataIndex": "lab_full_name",
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
      "lab_nature",
      "qualification_scope",
      "business_license_no",
      "lab_responsible_person",
      "province_name",
      "city_name",
      "address",
      "lab_phone",
      "geo_traffic",
      "entrusted_projects",
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
        "lab_full_name",
        "lab_nature",
        "qualifications",
        "qualification_scope",
        "business_license_no",
        "lab_responsible_person",
        "province_name",
        "city_name",
        "address",
        "lab_phone",
        "geo_traffic",
        "entrusted_projects",
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
            if (selectedRows.length !== 1) {
              message.warn('每次只能操作一条数据');
              return;
            }
            // CURR_USER_CODE 当前用户编码
            if (selectedRows[0].create_user_code !== CURR_USER_CODE) {
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
      PROP_KEY === 'dep' && selectedRows.length === 1 && (
        <InitiateApproval
          // style={{ display: hasPermission(authority, '发起审批') ? 'inline' : 'none' }}
          key={selectedRows?.id || 'default'} // 添加key属性强制重新渲染
          recordId={selectedRows[0]?.id}
          selectedRecord={{
            ...selectedRows[0],
            approval_schedule: !canInitiateApprovalAllRows
          }}
          dispatch={dispatch}
          funcode={'A05'}
          type='workLicenseRegister/startApprovalEvaluation'
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
            funcCode={'A05'}
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
            // CURR_USER_CODE 当前用户编码
            if (selectedRows[0].create_user_code !== CURR_USER_CODE) {
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
                  type: "workLicenseRegister/deleteExternalLaboratoryEvaluation",
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
        tableTitle='外委实验室调查评价'
        type="workLicenseRegister/getExternalLaboratoryEvaluation"
        exportType="workLicenseRegister/getExternalLaboratoryEvaluation"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getExternalLabora1toryEv2aluation'}
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
export default connect()(OutsourcedSurveyAssess);
