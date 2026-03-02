import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Space, Radio } from "antd";
import { connect, history, useLocation } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, PROP_KEY, CURR_USER_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { getDisplayHierarchy, getDefaultFiltersInspector } from "@/utils/utils";

import { configColumns } from "./columns";
import ApprovalRecord from './ApprovalRecord';
import Edit from "./Edit";

/**
 * 计量人员资格申请表
 * @constructor
 */
const PersonnelApplyFormPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  // 用于控制导入的显示状态
  const [visible, setVisible] = useState(false);
  // 用于控制编辑的显示状态
  const [editVisible, setEditVisible] = useState(false);
  // 用于存贮选中记录状态
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  // 年审记录状态
  const [isApprovalVisible, setIsApprovalVisible] = useState<boolean>(false);
  // 用于控制是否在岗的显示状态
  const [isOnDutyVisible, setIsOnDutyVisible] = useState<boolean>(false);
  // 用于存贮是否在岗的状态
  const [isOnDuty, setIsOnDuty] = useState<any>(null);
  // 根据用户选择的按钮放开更新有效期的权限
  const [isVailty, setIsVailty] = useState<boolean>(false);
  // 用于维护当前路由的状态
  const [currentRoute,setCurrentRoute] = useState<any>('');
  // 获取当前页面的位置信息
  const location: any = useLocation();

  useEffect(() => {
    if (location?.pathname) {
      const fullPath = location?.pathname;
      // 获取 /dep/quality/inspectorManagement/ 这部分路由去掉最后的路径
      const parentPath = fullPath.split('/').slice(0, -1).join('/') + '/';
      setCurrentRoute(parentPath || '');
    }
  }, [location?.pathname])

  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      // ...getDisplayHierarchy(),
      'sub_comp_name',
      'dep_name',
      'employee_no',
      'name',
      'gender',
      'education',
      'job_title', // 职称
      'metrologist_certificate',
      'laboratory_certificate',
      'verification_certificate',
      'calibration_certificate',
      'qualified_project_1',
      'validity_date_1',
      'qualified_project_2',
      'validity_date_2',
      'qualified_project_3',
      'validity_date_3',
      'qualified_project_4',
      'validity_date_4',
      'qualified_project_5',
      'validity_date_5',
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      'modify_user_name',
      'remark',
      {
        title: "PersonnelApplyForm.on_duty",
        subTitle: "在岗状态",
        dataIndex: "on_duty",
        width: 160,
        align: "center",
        render: (text: any, _record: any) => {
          return (
            <div>
              {text === 1 ? "在岗" : "不在岗"}
            </div>
          )
        }
      },
      'on_duty_str', 
      {
        title: "操作",
        subTitle: "操作",
        dataIndex: "action",
        width: 290,
        align: "center",
        render: (_text: any, record: any) => {
          return (
            <Space>
              <Button
                type="link"
                onClick={() => {
                  // 只有申请人（只能修改自己数据）和公司批准人可修改数据
                  if (![record.applicant, record.assignee].includes(CURR_USER_CODE)) {
                    message.error('您不是当前申请人或审批人无操作权限！');
                    return;
                  }
                  setSelectedRecord(record);
                  setIsOnDutyVisible(true);
                }}
              >
                确认在岗状态
              </Button>
              <Button
                type="link"
                disabled={record?.is_audit === 1}
                onClick={() => {
                  // 只有申请人（只能修改自己数据）和公司批准人可修改数据
                  if (![record.applicant, record.assignee].includes(CURR_USER_CODE)) {
                    message.error('您不是当前申请人或审批人无操作权限！');
                    return;
                  }
                  dispatch({
                    type: 'workLicenseRegister/addMeasurePersonnelAudit',
                    payload: {
                      personnel_id: record?.id,
                    },
                    callback: (res: any) => {
                      if (res.errCode === ErrorCode.ErrOk) {
                        if (actionRef.current) {
                          actionRef.current.reloadTable();
                          Modal.success({
                            title: '成功',
                            content: '复审发起成功，是否跳转到审批页面？',
                            okText: '确定',
                            onOk: () => {
                              // 用户点击确定后跳转到审批页面
                              history.push({
                                pathname: `${currentRoute}personnelLedgerAudit`,
                              });
                            },
                          });
                        }
                      }
                    }
                  })
                }}
              >
                复审
              </Button>
              <Button
                type="link"
                onClick={() => {
                  setSelectedRecord(record);
                  setIsApprovalVisible(true);
                }}
              >
                复审记录
              </Button>
            </Space>
          )
        }
      }
    ])
      .needToFixed([
        { value: 'on_duty', fixed: 'right' },
        { value: 'action', fixed: 'right' },
      ])
      .noNeedToFilterIcon(['action'])
      .noNeedToSorterIcon(['action'])
      .setTableColumnToDatePicker([
        { value: 'birth_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'train_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'approval_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
      .needToHide(['on_duty_str'])
      .needToExport([
        // ...getDisplayHierarchy(),
        'sub_comp_name',
        'dep_name',
        'employee_no',
        'name',
        'gender',
        'education',
        'job_title', // 职称
        'metrologist_certificate',
        'laboratory_certificate',
        'verification_certificate',
        'calibration_certificate',
        'qualified_project_1',
        'validity_date_1',
        'qualified_project_2',
        'validity_date_2',
        'qualified_project_3',
        'validity_date_3',
        'qualified_project_4',
        'validity_date_4',
        'qualified_project_5',
        'validity_date_5',
        'on_duty_str',
        'remark',
        
        // "create_ts_str",
        // "create_user_name",
        // "modify_ts_str",
        // 'modify_user_name',
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
          type="primary"
          // style={{ display: hasPermission(authority, '导入') ? 'inline' : 'none' }}
          onClick={(e) => {
            e.stopPropagation();
            setVisible(true);
          }}
        >导入</Button>
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
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Button
        type={"primary"}
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warn('每次只能操作一条数据');
            return;
          }
          // 只有申请人（只能修改自己数据）和公司批准人可修改数据
          if (![selectedRows[0].applicant, selectedRows[0].assignee].includes(CURR_USER_CODE)) {
            message.error('您不是当前申请人或审批人无操作权限！');
            return;
          }
          setIsVailty(false);
          setSelectedRecord(selectedRows[0]);
          setEditVisible(true)
        }}
      >
        编辑
      </Button>,
      PROP_KEY === 'branchComp' && (
        <Button
          type={"primary"}
          onClick={() => {
            if (selectedRows.length !== 1) {
              message.warn('每次只能操作一条数据');
              return;
            }
            // 只有申请人（只能修改自己数据）和公司批准人可修改数据
            if (![selectedRows[0].applicant, selectedRows[0].assignee].includes(CURR_USER_CODE)) {
              message.error('您不是当前申请人或审批人无操作权限！');
              return;
            }
            setIsVailty(true);
            setSelectedRecord(selectedRows[0]);
            setEditVisible(true);
          }}
        >
          更新项目资质
        </Button>
      )
    ]
  }

  /**
  * 处理模态框确认按钮点击
  * 该函数会在用户点击模态框的确认按钮时触发
  */
  const handleModalOk = () => {
    if (!isOnDuty) {
      return;
    }
    // 确认在岗状态接口成功后显示成功消息并重新加载表格
    dispatch({
      type: 'workLicenseRegister/confirmOnDuty',
      payload: {
        id: selectedRecord?.id,
        on_duty: isOnDuty
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success('确认成功');
          if (actionRef?.current) {
            actionRef?.current?.reloadTable();
          }
        }
        setIsOnDutyVisible(false);
      }
    })
  }

  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='计量人员台账'
        type="workLicenseRegister/getMeasurePersonnel"
        exportType="workLicenseRegister/getMeasurePersonnel"
        importType='workLicenseRegister/importMeasurePersonnel'
        tableColumns={getTableColumns()}
        funcCode={authority + 'getMeasurePersonne1l'}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={getDefaultFiltersInspector()}
      />

      {visible && (
        <BaseImportModal
          visible={visible}
          onCancel={() => setVisible(false)}
          startUploadFile={(file: any) => {
            if (actionRef.current) {
              return actionRef.current.importFile(file, 'measurePersonnel', () => {
                setVisible(false);
              });
            }
          }}
        />
      )}
      {editVisible && (
        <Edit
          visible={editVisible}
          selectedRecord={selectedRecord}
          isVailty={isVailty}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {
        isApprovalVisible && (
          <ApprovalRecord
            visible={isApprovalVisible}
            selectedRecord={selectedRecord}
            onCancel={() => setIsApprovalVisible(false)}
            callbackSuccess={() => {
              setIsApprovalVisible(false);
              if (actionRef.current) {
                actionRef.current.reloadTable();
              }
            }}
          />
        )
      }

      <Modal
        title={`确认(${selectedRecord?.name || null})在岗状态`}
        open={isOnDutyVisible}
        onOk={handleModalOk}
        onCancel={() => setIsOnDutyVisible(false)}
      >
        <Radio.Group onChange={(e) => setIsOnDuty(e.target.value)} value={isOnDuty}>
          <Radio value={'0'}>不在岗</Radio>
          <Radio value={'1'}>在岗</Radio>
        </Radio.Group>
      </Modal>
    </div>
  )
}
export default connect()(PersonnelApplyFormPage);
