import React, { useEffect, useRef, useState } from 'react';
import { Select, Space, Button, message, Modal, Spin, Form } from "antd";
import { connect, useIntl, useLocation } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { hasPermission } from "@/utils/authority";
import { getDisplayHierarchy, getDefaultFiltersInspector, getUserInfoAndParams } from "@/utils/utils";
import { inspectorApprovalStatusTag } from "@/common/common";
import { PROP_KEY, WELDER_EQUIPMENT_TYPE_OPTIONS, ErrorCode } from "@/common/const";
import ViewApproval from "@/components/Approval/ViewApproval";
import ApprovalTaskSegmented from "@/components/ApprovalTaskSegmented";
import CommonPaginationSelect from '@/components/CommonList/CommonPaginationSelect';

import { configColumns } from "./columns";
import DateSelfToolbar from "@/components/DateSelfToolbar";

/**
 * 监视和测量设备审批记录
 * @constructor
 */
const MonitoringMeasuringApproval: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const { formatMessage } = useIntl();
  // 筛选审批任务值
  const [approvalTask, setApprovalTask] = useState<any>('all');
  const location: any = useLocation();
  const query = location.query || {};

  // 初始化默认年份
  const [defaultYear, setDefaultYear] = useState<any>(query?.year || new Date().getFullYear());
  // 月份状态，用于日期选择器的默认值
  const [defaultMonth, setDefaultMonth] = useState<any>(query?.month || new Date().getMonth() + 1);
  const [halfYear, setHalfYear] = useState<any>(query?.year_stage);
  // 特种设备类别状态
  const [equipmentType, setEquipmentType] = useState<any>(query?.equipment_type);
  // 加载状态
  const [loading, setLoading] = useState<any>(false);
  // 用于控制发起审批弹窗状态
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // 获取用户信息
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  // 用于存贮当前的详情记录数据
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  // 是否需要随便选择审批人
  const [isNextApprover, setIsNextApprover] = useState<boolean>(false);
  // 审批人列表
  const [approverOptions, setApproverOptions] = useState<any>([]);

  // 查询下一个审批人（焊工业绩模块需要指定人审批）
  const fetchNextApprover = (selectedRows: any) => {
    dispatch({
      type: 'workLicenseRegister/getNextApprover',
      payload: {
        year: selectedRows[0].year,
        year_stage: selectedRows[0].year,
        equipment_type_str: selectedRows[0].equipment_type_str,
        isStart: true,
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          if (res.result?.isOptional) {
            setIsNextApprover(true);
          } else {
            setIsNextApprover(false);
            dispatch({
              type: 'user/queryUserInfoInclude',
              payload: {
                sort: 'user_code',
                order: 'desc',
                filter: JSON.stringify([
                  { "Key": "user_code", "Val": res.result?.user_code, "Operator": "=" },
                ])
              },
              callback: (res: any) => {
                if (res.errCode === ErrorCode.ErrOk) {
                  setApproverOptions(res.rows || []);
                  setSelectedUserId(res.rows[0].user_code);
                }
              }
            })
          }
        }
      }
    })
  }


  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      ...getDisplayHierarchy(),
      'year',
      'year_stage',
      'equipment_type_str', // 特种设备类别
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
      "create_ts_str",
      "create_user_name",
    ])
      .needToExport([
        ...getDisplayHierarchy(),
        'year',
        'year_stage',
        "create_ts_str",
        "create_user_name",
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

      </Space>

    ]
  }

  /**
   * 确认选择：发起审批并显示loading状态。
   */
  const handleOk = async () => {
    if (!selectedUserId) return;
    setLoading(true);

    dispatch({
      type: 'workLicenseRegister/welderStartApproval',
      payload: {
        funcCode: 'A10',
        func_code: 'A10',
        id: selectedRecord[0]?.id,
        user_id: selectedUserId,
      },
      callback: (res: any) => {
        // 结束loading
        setLoading(false);
        if (res.errCode === ErrorCode.ErrOk) {
          message.success('审批发起成功');
          setSelectedUserId(undefined);
          setIsModalOpen(false);
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        } else {
          message.error(res.errMsg || '审批发起失败');
        }
      },
    });
  };


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
      PROP_KEY === 'dep' && selectedRows.length === 1 && (
        // <InitiateApproval
        //   // style={{ display: hasPermission(authority, '发起审批') ? 'inline' : 'none' }}
        //   key={selectedRows?.id || 'default'} // 添加key属性强制重新渲染
        //   recordId={selectedRows[0]?.id}
        //   selectedRecord={{
        //     ...selectedRows[0],
        //     approval_schedule: !canInitiateApprovalAllRows
        //   }}
        //   dispatch={dispatch}
        //   funcode={'A10'}
        //   type='workLicenseRegister/welderStartApproval'
        //   onSuccess={() => {
        //     if (actionRef.current) {
        //       actionRef.current.reloadTable();
        //     }
        //   }}
        // />
        <Button
          type="primary"
          onClick={() => {
            if (!canInitiateApprovalAllRows) {
              message.warning('当前数据以发起审批无需重新发起')
              return
            }
            fetchNextApprover(selectedRows);

            setSelectedRecord(selectedRows);
            setIsModalOpen(true);

          }}
        >
          发起审批
        </Button>
      ),
      [
        selectedRows?.length === 1 && (
          <ViewApproval
            // style={{ display: hasPermission(authority, '查看审批') ? 'inline' : 'none' }}
            key={`view-${selectedRows[0]?.RowNumber || 'default'}`} // 添加key属性强制重新渲染
            instanceId={selectedRows[0]?.approval_process_id}
            funcCode={'A10'}
            id={selectedRows[0]?.id}
            selectedRecord={{
              ...selectedRows[0],
              ...userInfo
            }}
            paramsData={{
              dep_code: selectedRows[0]?.dep_code,
              year: selectedRows[0]?.year,
              year_stage: selectedRows[0]?.year_stage,
              equipment_type: selectedRows[0]?.equipment_type,
              equipment_type_str: selectedRows[0]?.equipment_type_str,
              isStart: false,
            }}
            onSuccess={() => {
              if (actionRef.current) {
                actionRef.current.reloadTable();
              }
            }}
          />
        )
      ],
    ]
  }

  // 将 tableDefaultFilter 过滤条件提取为函数
  const getTableDefaultFilter = (params: any) => {
    const {
      halfYear,
      defaultYear = new Date().getFullYear(),
      equipmentType,
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
      baseFilters.push({ "Key": "equipment_type", "Val": equipmentType, "Operator": "=" });
    }
    return baseFilters;
  };

  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle={'焊工业绩审批'}
        type="workLicenseRegister/getWelderPerformanceApproval"
        exportType="workLicenseRegister/getWelderPerformanceApproval"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getWelderPerformanceApproval'}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={getTableDefaultFilter({ halfYear, defaultYear, equipmentType })}
        tableDefaultField={{ my_approval_task: approvalTask }}
        renderSelfToolbar={() => {
          return (
            <Space>
              <DateSelfToolbar
                showMonth={false}
                defaultYear={defaultYear}
                defaultMonth={defaultMonth}
                setDefaultYear={setDefaultYear}
                setDefaultMonth={setDefaultMonth}
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
                options={WELDER_EQUIPMENT_TYPE_OPTIONS || []}
                onChange={(value: any) => {
                  setDefaultMonth(null);
                  setEquipmentType(value);
                }}
              />
              <ApprovalTaskSegmented
                value={approvalTask}
                onChange={(value: any) => {
                  setApprovalTask(value);
                  if (actionRef.current) {
                    actionRef.current.reloadTable();
                  }
                }}
              />
            </Space>

          )
        }}
      />

      <Modal
        title={'发起审批'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedUserId(undefined);
          setLoading(false);
        }}
        okButtonProps={{
          disabled: !selectedUserId || loading
        }}
      >
        <Spin spinning={loading} tip="发起中...">
          <Form layout="vertical">
            {
              isNextApprover ? (
                <Form.Item label="选择审批人">
                  <CommonPaginationSelect
                    dispatch={dispatch}
                    fieldNames={{ label: 'user_name', value: 'user_code' }}
                    optionFilterProp={'user_name'}
                    fetchType={'user/queryUserInfoInclude'}
                    payload={{
                      sort: 'user_code',
                      order: 'desc',
                    }}
                    value={selectedUserId}
                    onChange={setSelectedUserId}
                    placeholder="请选择审批人"
                    disabled={loading}
                  />
                </Form.Item>
              ) : (
                <Form.Item label="指定审批人">
                  <Select
                    value={selectedUserId}
                    onChange={setSelectedUserId}
                    placeholder="审批人"
                    fieldNames={{ label: 'user_name', value: 'user_code' }}
                    options={approverOptions || []}
                  />
                </Form.Item>
              )
            }
            
          </Form>
        </Spin>
      </Modal>
    </div>
  )
}
export default connect()(MonitoringMeasuringApproval);
