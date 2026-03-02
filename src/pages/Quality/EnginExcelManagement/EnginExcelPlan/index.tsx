import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Space } from "antd";
import { connect, useIntl, history } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, PROP_KEY, CURR_USER_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { getDisplayHierarchy, getDefaultFiltersInspector } from "@/utils/utils";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import InitiateApprovalButton from "@/components/InitiateApprovalButton";

import { configColumns } from "./columns";
import MonitoringMeasuringAdd from "./Add";
import MonitoringMeasuringDetail from "./Detail";
import MonitoringMeasuringEdit from "./Edit";
import DateSelfToolbar from "@/components/DateSelfToolbar";

/**
 * 质量回访计划
 * @constructor
 */
const VisitFollowPlan: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  /**
   * 可以引用表格的.current属性可以在不触发重新渲染的情况下被更新
   */
  const actionRef: any = useRef();
  // 用于格式化国际化消息的函数
  const { formatMessage } = useIntl();
  // 用于控制导入的状态
  const [visible, setVisible] = useState(false);
  // 用于新增的状态
  const [addVisible, setAddVisible] = useState(false);
  // 控制某个面板或菜单展开状态的状态变量
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // 用于编辑的状态
  const [editVisible, setEditVisible] = useState(false);
  // 用于控制的详情状态
  const [open, setOpen] = useState(false);
  // 用于存贮当前的详情记录数据
  const [selectedRecord, setSelectedRecord] = useState(null);
  /**
   * 初始化年份和月份状态
   * 使用当前年份和月份作为初始值，月份需要加1因为月份从0开始
   */
  const [defaultYear, setDefaultYear] = useState<any>(new Date().getFullYear());
  const [defaultMonth, setDefaultMonth] = useState<any>(new Date().getMonth() + 1);

  
  // 获取当前年份下是否已经发起审批了
  const fetchCurrentPublish = async (year: any) => {
    if (!year) return false;

    return new Promise((resolve) => {
      dispatch({
        type: 'workLicenseRegister/meritPlangetCurrApprovalStatus',
        payload: {
          year: year,
        },
        callback: (res: any) => {
          if (res.errCode === ErrorCode.ErrOk) {
            resolve(res?.result?.isStart === true);
          } else {
            resolve(false);
          }
        },
      });
    });
  };
  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      ...getDisplayHierarchy(),
      '国家安装之星',
      '国家级优秀焊接工程',
      '国家级优质工程',
      '局级优质工程',
      '局级安装工程优质奖',
      '省部级优质工程',
      '省部级石油安装工程',
      {
        title: "compinfo.dev_code",
        subTitle: "装置",
        dataIndex: "dev_code",
        width: 160,
        align: "center",
        render: (text: any, record: any) => {
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
          )
        }
      },
      "year",
      "merit_types_str",
      "application_date",
      "charge_person",
      'charge_person_phone',
      "contact_person",
      'contact_person_phone',
      "application_unit",
      "start_date",
      "end_date",
      "contract_amount",
      "budget_amount",
      "final_account_amount",
      "construction_unit",
      "survey_unit",
      "design_unit",
      "construction_contractor",
      "supervision_unit",
      // "design_award",
      // "tech_progress_award",
      // "other_award",
      'design_award_str', // 设计获奖情况
      'tech_progress_award_str', // 科技进步获奖情况
      'other_award_str', // 其他获奖情况
      "construction_unit_opinion_str",
      "quality_accident_proof_str",
      "no_wage_arrears_proof_str",
      "embassy_proof_str",
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
      'remark',
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      'modify_user_name',
    ])
      .setTableColumnToDatePicker([
        { value: 'application_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'start_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'end_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
      .needToHide([
        '国家安装之星',
        '国家级优秀焊接工程',
        '国家级优质工程',
        '局级优质工程',
        '局级安装工程优质奖',
        '省部级优质工程',
        '省部级石油安装工程',
        'design_award_str', // 设计获奖情况
        'tech_progress_award_str', // 科技进步获奖情况
        'other_award_str', // 其他获奖情况
      ])
      .needToExport([
        ...getDisplayHierarchy(),
        'dev_code',
        '国家安装之星',
        '国家级优秀焊接工程',
        '国家级优质工程',
        '局级优质工程',
        '局级安装工程优质奖',
        '省部级优质工程',
        '省部级石油安装工程',

        // "merit_types",
        "application_date", // 计划申报时间
        "charge_person", // 负责人
        "contact_person", // 联络人
        "application_unit", // 主申报单位
        "start_date", // 工程开工时间
        "end_date", // 工程竣工时间
        "contract_amount", // 合同额
        "budget_amount", // 概算额
        "final_account_amount", // 决算额
        "construction_unit", // 建设单位
        "survey_unit", // 勘察单位
        "design_unit", // 设计单位
        "construction_contractor", // 施工单位
        "supervision_unit", // 监理单位
        'design_award_str', // 设计获奖情况
        'tech_progress_award_str', // 科技进步获奖情况
        'other_award_str', // 其他获奖情况
        "construction_unit_opinion_str", // 建设单位意见
        
        "quality_accident_proof_str",
        "no_wage_arrears_proof_str", // 无拖欠农民工工资证明
        "embassy_proof_str", // 大使馆商务参赞证明
        'remark',
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
        {PROP_KEY === 'dep' && (
          <Button
            type="primary"
            onClick={() => {
              setAddVisible(true);
            }}
          >
            新增
          </Button>
        )}
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
    return PROP_KEY === 'dep' && [
      <Button
        type={"primary"}
        onClick={ async() => {
          if (selectedRows.length !== 1) {
            message.warn('每次只能操作一条数据');
            return;
          }
          const isPubilc = await fetchCurrentPublish(selectedRows[0]?.year);
          if (isPubilc) {
            message.warn('您当前年份已发起审批，请勿重复操作');
            return;
          }
          setSelectedRecord(selectedRows[0]);
          setEditVisible(true);
        }}
      >
        编辑
      </Button>,
      <Button
        danger
        type={"primary"}
        onClick={ async () => {
          if (selectedRows.length !== 1) {
            message.warning("每次只能删除一条数据");
            return;
          }
          const isPubilc = await fetchCurrentPublish(selectedRows[0]?.year);
          if (isPubilc) {
            message.warn('您当前年份已发起审批，请勿重复操作');
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
                type: "workLicenseRegister/deleteMeritPlan",
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
        tableTitle={'创优情况计划'}
        type="workLicenseRegister/getMeritPlan"
        exportType="workLicenseRegister/getMeritPlan"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getMeritP1lan'}
        tableSortOrder={{ sort: 'modify_ts', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={[
          { "Key": "year", "Val": defaultYear || new Date().getFullYear(), "Operator": "=" },
          ...getDefaultFiltersInspector(),
        ]}
        renderSelfToolbar={(_reloadTable: any) => {
          return (
            <Space>
              <DateSelfToolbar
                showMonth={false}
                defaultYear={defaultYear}
                defaultMonth={defaultMonth}
                setDefaultYear={setDefaultYear}
                setDefaultMonth={setDefaultMonth}
              />

              {/* 发起审批按钮组件可根据查询审批条件跳转路由页面 */}
              <InitiateApprovalButton
                actionRef={actionRef}
                startType={'workLicenseRegister/meritPlangetCurrApprovalStatus'}
                approvalType={'workLicenseRegister/addMeritPlanApproval'}
                defaultYear={defaultYear}
                defaultMonth={undefined}
                pathName={'/dep/quality/enginExcelManagement/enginExcelPlanApproval'}
              />
            </Space>

          )
        }}
      />
      {isOpen && selectedRecord && (
        <MonitoringMeasuringDetail
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
        <MonitoringMeasuringAdd
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
        <MonitoringMeasuringEdit
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
export default connect()(VisitFollowPlan);
