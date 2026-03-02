import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Space, Select } from "antd";
import { connect, useIntl, history } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, PROP_KEY, WELDER_EQUIPMENT_TYPE_OPTIONS } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { getDisplayHierarchy, getDefaultFiltersInspector } from "@/utils/utils";
import InitiateApprovalButton from "@/components/InitiateApprovalButton";
import { ConnectState } from '@/models/connect';

import { configColumns } from "./columns";
import MonitoringMeasuringAdd from "./Add";
import ApprovalRecord from "./ApprovalRecord";
import MonitoringMeasuringEdit from "./Edit";
import DateSelfToolbar from "@/components/DateSelfToolbar";

/**
 * 质量回访计划
 * @constructor
 */
const VisitFollowPlan: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  // 可以引用表格的.current属性可以在不触发重新渲染的情况下被更新
  const actionRef: any = useRef();
  // 用于格式化国际化消息的函数
  const { formatMessage } = useIntl();
  // 用于控制导入的状态
  const [visible, setVisible] = useState(false);
  // 用于新增的状态
  const [addVisible, setAddVisible] = useState(false);
  // 用于编辑的状态
  const [editVisible, setEditVisible] = useState(false);
  // 用于控制的详情状态
  const [isOpen, setIsOpen] = useState(false);
  // 用于存贮当前的详情记录数据
  const [selectedRecord, setSelectedRecord] = useState(null);
  /**
   * 初始化年份和月份状态
   * 使用当前年份和月份作为初始值，月份需要加1因为月份从0开始
   */
  const [defaultYear, setDefaultYear] = useState<any>(new Date().getFullYear());
  const [defaultMonth, setDefaultMonth] = useState<any>(new Date().getMonth() + 1);
  // 存贮当前年份阶段如上半年、下半年
  const [halfYear, setHalfYear] = useState<any>(null);
  // 特种设备类别状态
  const [equipmentType, setEquipmentType] = useState<any>(null);

  // 获取当前年份下是否已经发起审批了
  const fetchCurrentPublish = async (year: any, year_stage: any, equipment_type: any) => {
    if (!year || !year_stage || !equipment_type) {
      return false;
    }

    return new Promise((resolve) => {
      dispatch({
        type: 'workLicenseRegister/weldergetCurrApprovalStatus',
        payload: {
          year: year,
          year_stage: year_stage,
          equipment_type: equipment_type,
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
      'year',
      "month",
      "year_stage_str",
      {
        "title": "compinfo.employee_code",
        "subTitle": "员工编号",
        "dataIndex": "employee_code",
        "width": 160,
        "align": "center",
        render(text: any, record: any) {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record);
                setIsOpen(true);
              }}
            >
              {text}
            </a>
          );
        }
      },
      "team_code",
      "welder_name",
      "employment_type",
      "project_name",
      "certificate_no",
      "equipment_type_str",
      "welding_method_code_str",
      "welding_quantity",
      "unit",
      "ndt_num",
      "qualified_num",
      "pass_percent",
      "repair_num",
      "material_category_str",
      "quality_accident_str",
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      'modify_user_name',
    ])
      .needToExport([
        ...getDisplayHierarchy(),
        'year',
        "month",
        "year_stage_str",
        "team_code",
        "welder_name",
        "employment_type",
        "employee_code",
        "project_name",
        "certificate_no",
        "equipment_type_str",
        "welding_method_code_str",
        "welding_quantity",
        "unit",
        "ndt_num",
        "qualified_num",
        "pass_percent",
        "repair_num",
        "material_category_str",
        "quality_accident_str",
        "create_ts_str",
        "create_user_name",
        "modify_ts_str",
        'modify_user_name',
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
    return [
      <Button
        type={"primary"}
        onClick={async () => {
          if (selectedRows.length !== 1) {
            message.warn('每次只能操作一条数据');
            return;
          }
          const isPubilc = await fetchCurrentPublish(selectedRows[0].year, selectedRows[0].year_stage, selectedRows[0].equipment_type);
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
        onClick={async () => {
          if (selectedRows.length !== 1) {
            message.warning("每次只能删除一条数据");
            return;
          }
          const isPubilc = await fetchCurrentPublish(selectedRows[0].year, selectedRows[0].year_stage, selectedRows[0].equipment_type);
          if (isPubilc) {
            message.warn('您当前年份已发起审批，无法删除该数据');
            return;
          }
          // 根据默认的月份或者选择月份的话 判断出年份阶段
          let defaultPhase: any;
          if (!halfYear) {
            defaultPhase = defaultMonth < 7 ? '1' : '2';
          }

          Modal.confirm({
            title: "删除",
            content: "确定删除所选的内容？",
            okText: "确定删除",
            okType: "danger",
            cancelText: "我再想想",
            onOk() {
              dispatch({
                type: "workLicenseRegister/deleteWelderPerformance",
                payload: {
                  id: selectedRows[0]['id'],
                  year: defaultYear,
                  month: defaultMonth,
                  year_stage: halfYear ?? defaultPhase,
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

  const defaultMonthAndClearHalfYear = (month: any) => {
    setHalfYear(null); // 清空阶段选择
    setDefaultMonth(month);
  }

  // 将 tableDefaultFilter 过滤条件提取为函数
  const getTableDefaultFilter = (params: any) => {
    const {
      halfYear,
      defaultYear = new Date().getFullYear(),
      equipmentType,
      getDefaultFiltersInspector = () => []
    } = params;

    // 构建基础过滤器
    const baseFilters = [
      { "Key": "year", "Val": defaultYear, "Operator": "=" },
      ...getDefaultFiltersInspector()
    ];

    // 处理 halfYear
    if (halfYear) {
      baseFilters.push({ "Key": "year_stage", "Val": halfYear, "Operator": "=" });
    }

    // 处理 equipmentType
    if (equipmentType) {
      console.log('equipmentType type:', typeof equipmentType, 'value:', equipmentType);
      baseFilters.push({ "Key": "equipment_type", "Val": equipmentType, "Operator": "=" });
    }

    return baseFilters;
  };

  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle={'焊工业绩'}
        type="workLicenseRegister/getWelderPerformance"
        exportType="workLicenseRegister/getWelderPerformance"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getWelderPerformance'}
        tableSortOrder={{ sort: 'employee_code,month', order: 'asc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={getTableDefaultFilter({ halfYear, defaultYear, equipmentType })}
        renderSelfToolbar={(_reloadTable: any) => {
          return (
            <Space>
              <DateSelfToolbar
                defaultYear={defaultYear}
                showMonth={false}
                setDefaultYear={setDefaultYear}
                setDefaultMonth={defaultMonthAndClearHalfYear}
              />
              <Select
                style={{ width: '160px' }}
                placeholder="请选择阶段"
                value={halfYear}
                options={[
                  { value: '1', label: '上半年' },
                  { value: '2', label: '下半年' },
                ]}
                onChange={(value: any) => {
                  setDefaultMonth(null);
                  setHalfYear(value);
                }}
              />
              <Select
                value={equipmentType}
                style={{ width: '180px' }}
                placeholder="请选择特种设备类别"
                allowClear
                options={WELDER_EQUIPMENT_TYPE_OPTIONS || []}
                onChange={(value: any) => {
                  setDefaultMonth(null);
                  setEquipmentType(value);
                }}
              />
              {/* 发起审批按钮组件可根据查询审批条件跳转路由页面 */}
              {
                halfYear && equipmentType && (
                  <InitiateApprovalButton
                    actionRef={actionRef}
                    startType={'workLicenseRegister/weldergetCurrApprovalStatus'}
                    approvalType={'workLicenseRegister/addWelderPerformanceApproval'}
                    defaultYear={defaultYear}
                    halfYear={halfYear}
                    equipmentType={equipmentType}
                    pathName={'/dep/quality/welderManagement/weldPerformanceApproval'}
                  />
                )
              }
              <span style={{ fontSize: "12px" }}>
                <span style={{ color: "#FF0000", padding: 4 }}>*</span>
                您需要选择<b>阶段</b>和<b>特种设备类别</b>后才能发起审批
              </span>
            </Space>
          )
        }}
      />
      {isOpen && selectedRecord && (
        <ApprovalRecord
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
export default connect(({ workLicenseRegister }: ConnectState) => ({
  userList: workLicenseRegister.userList,
}))(VisitFollowPlan);
