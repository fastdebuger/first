import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Space, Radio } from "antd";
import { connect, history } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { ErrorCode, PROP_KEY, CURR_USER_CODE, WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { getDisplayHierarchy, getDefaultFiltersInspector } from "@/utils/utils";

import { configColumns } from "./columns";
import DateSelfToolbar from "@/components/DateSelfToolbar";
import Add from "./Add";
import Edit from "./Edit";
/**
 * 月度重大质量风险
 * @constructor
 */
const MonthMajorQualityRisks: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  // 用于控制编辑的状态
  const [editVisible, setEditVisible] = useState(false);
  // 存储当前选中记录数据的状态
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  /**
   * 初始化年份和月份状态
   * 使用当前年份和月份作为初始值，月份需要加1因为月份从0开始
   */
  const [defaultYear, setDefaultYear] = useState<any>(new Date().getFullYear());
  const [defaultMonth, setDefaultMonth] = useState<any>(new Date().getMonth() + 1);
  // 用于新增状态
  const [addVisible, setAddVisible] = useState<boolean>(false);
  // 用于控制批量修改风险层级的状态
  const [batchEditVisible, setBatchEditVisible] = useState<boolean>(false);
  // 用于显示风险等级状态
  const [isShowRiskLevel, setIsShowRiskLevel] = useState<number>(1);
  // 判断是否为分公司层级
  const isLeval = PROP_KEY === 'subComp';
  // 用于储存显示发布时间
  const [publishTime, setPublishTime] = useState<any>(null);

  // 查询当前年份和月份是否已经发布（发布了的话会返回发布时间） 
  const fetchCurrentPublish = () => {
    const basePayload: any = {
      year: defaultYear,
      month: Number(defaultMonth),
    }
    if (PROP_KEY === 'dep') {
      basePayload.dep_code = localStorage.getItem('auth-default-cpecc-depCode')
    }
    if (PROP_KEY === 'subComp') {
      basePayload.sub_comp_code = WBS_CODE;
      basePayload.dep_code = undefined;
      basePayload.depCode = undefined;
    }
    dispatch({
      type: 'workLicenseRegister/getRiskSubmitRecordTime',
      payload: basePayload,
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          if (res?.result?.submit_str) {
            setPublishTime(res?.result?.submit_str);
          } else {
            setPublishTime(false);
          }
        }
      }
    })
  }
  useEffect(() => {
    // 查询当前年份和月份是否已经发布（发布了的话会返回发布时间）
    fetchCurrentPublish();
  }, [defaultYear, defaultMonth]);
  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      ...getDisplayHierarchy(),
      'year',
      'month',
      'project', // 工程名称
      'construction_specialty', // 施工专业/过程
      'job_activity', // 作业活动/作业部位
      'risk', // 风险
      'risk_description', // 风险描述
      'leader', // 公司片区督导领导
      "create_ts_str",
      "create_user_name",
      'is_comp_risk_str', // 公司级风险(0否1是)
      'is_sub_risk_str', // 分公司级风险(0否1是)
      'is_project_risk_str', // 项目级风险(0否1是)
    ])
      .setTableColumnToDatePicker([
        { value: 'verification_date', valueType: 'dateTs' },
        { value: 'valid_date', valueType: 'dateTs' },
      ])
      .needToFixed([
        { value: 'is_comp_risk_str', fixed: 'right' },
        { value: 'is_sub_risk_str', fixed: 'right' },
        { value: 'is_project_risk_str', fixed: 'right' },
      ])
      .needToExport([
        ...getDisplayHierarchy(),
        'year',
        'month',
        'project', // 工程名称
        'construction_specialty', // 施工专业/过程
        'job_activity', // 作业活动/作业部位
        'risk', // 风险
        'risk_description', // 风险描述
        'leader', // 公司片区督导领导
        'is_comp_risk_str', // 公司级风险(0否1是)
        'is_sub_risk_str', // 分公司级风险(0否1是)
        'is_project_risk_str', // 项目级风险(0否1是)
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
        {/* 功能按钮组新增 只会在页面加载的时候执行一次，所以我们需要在点击新增按钮后查询一下发布接口如果有值得话 则不能新增了 */}
        <Button
          type="primary"
          onClick={() => {
            const basePayload: any = {
              year: defaultYear,
              month: Number(defaultMonth),
            }
            if (PROP_KEY === 'dep') {
              basePayload.dep_code = localStorage.getItem('auth-default-cpecc-depCode')
            }
            if (PROP_KEY === 'subComp') {
              basePayload.sub_comp_code = WBS_CODE;
              basePayload.dep_code = undefined;
              basePayload.depCode = undefined;
            }
            dispatch({
              type: 'workLicenseRegister/getRiskSubmitRecordTime',
              payload: basePayload,
              callback: (res: any) => {
                if (res.errCode === ErrorCode.ErrOk) {
                  if (res?.result?.submit_str) {
                    message.error('您当前月份已经发布，不能新增了！');
                  } else {
                    setAddVisible(true);
                  }
                }
              }
            })

          }}
        >
          新增
        </Button>
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
    return !publishTime && [
      PROP_KEY === 'dep' && (
        <Button
          type={"primary"}
          onClick={() => {
            if (selectedRows.length !== 1) {
              message.warn('每次只能操作一条数据');
              return;
            }
            setSelectedRecord(selectedRows[0]);
            setEditVisible(true);
          }}
        >
          编辑
        </Button>
      ),
      PROP_KEY !== 'dep' && (
        <Button
          type={"primary"}
          onClick={() => {
            setSelectedRecord(selectedRows);
            setBatchEditVisible(true);
          }}
        >
          {isLeval ? '批量修改分公司风险层级' : '批量修改公司风险层级'}
        </Button>
      ),
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
                type: "workLicenseRegister/deleteRiskMonthly",
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
        tableTitle={'月度重大质量风险'}
        type="workLicenseRegister/getRiskMonthly"
        exportType="workLicenseRegister/getRiskMonthly"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getRis1kMonth1ly'}
        tableSortOrder={{ sort: 'month', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={PROP_KEY === 'subComp' ? [ // 分公司层级的执行下面的过滤条件
          { "Key": "year", "Val": Number(defaultYear) || new Date().getFullYear(), "Operator": "=" },
          { "Key": "month", "Val": Number(defaultMonth) || new Date().getMonth() + 1, "Operator": "=" },
          ...getDefaultFiltersInspector(),
          { "Key": "is_submit", "Val": 1, "Operator": "=" }
        ] : PROP_KEY === 'branchComp' ? [  // 公司层级的执行下面的过滤条件
          { "Key": "year", "Val": Number(defaultYear) || new Date().getFullYear(), "Operator": "=" },
          { "Key": "month", "Val": Number(defaultMonth) || new Date().getMonth() + 1, "Operator": "=" },
          ...getDefaultFiltersInspector(),
          { "Key": "sub_is_submit", "Val": 1, "Operator": "=" }
        ] : [
          { "Key": "year", "Val": Number(defaultYear) || new Date().getFullYear(), "Operator": "=" },
          { "Key": "month", "Val": Number(defaultMonth) || new Date().getMonth() + 1, "Operator": "=" },
          ...getDefaultFiltersInspector(),
        ]}
        tableDefaultField={{
          year: Number(defaultYear),
          month: Number(defaultMonth)
        }}
        renderSelfToolbar={(_reloadTable: any) => {
          return (
            <Space>
              <DateSelfToolbar
                defaultYear={defaultYear}
                defaultMonth={defaultMonth}
                setDefaultYear={setDefaultYear}
                setDefaultMonth={setDefaultMonth}
              />
              {
                PROP_KEY !== 'branchComp' && (
                  <>
                    <Button
                      type={"primary"}
                      disabled={publishTime}
                      onClick={() => {
                        let basePayload: any = {
                          year: defaultYear,
                          month: Number(defaultMonth),
                        }
                        if (PROP_KEY === 'dep') {
                          basePayload.dep_code = localStorage.getItem('auth-default-cpecc-depCode')
                        }
                        if (PROP_KEY === 'subComp') {
                          basePayload.sub_comp_code = WBS_CODE;
                          basePayload.dep_code = undefined;
                          basePayload.depCode = undefined;
                        }
                        dispatch({
                          type: 'workLicenseRegister/submitRisk',
                          payload: basePayload,
                          callback: (res: any) => {
                            if (res.errCode === ErrorCode.ErrOk) {
                              message.success('发布成功');
                              fetchCurrentPublish();
                              if (actionRef.current) {
                                actionRef.current.reloadTable();
                              }
                            }
                          }
                        })
                      }}
                    >
                      {publishTime ? '已发布' : '发布'}
                    </Button>
                    发布时间：{publishTime || '未发布'}
                  </>
                )
              }
            </Space>
          )
        }}
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
      {editVisible && selectedRecord && (
        <Edit
          visible={editVisible}
          selectedRecord={selectedRecord}
          isDetail={open}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      <Modal
        title={isLeval ? '批量修改分公司级风险层级' : '批量修改公司级风险层级'}
        visible={batchEditVisible}
        onOk={() => {
          // 判断选中的数据中分公司风险状态是否为1，如果不是的话则不让用户向下执行了；
          const isSubState = selectedRecord?.every((item: any) => item['is_sub_risk'] === 1);
          if(!isLeval && !isSubState) {
            message.error('您需要先确认分公司风险层级！');
            return;
          }
          const arrIds = selectedRecord?.map((item: any) => item['id']);
          dispatch({
            type: 'workLicenseRegister/updateRiskStatus',
            payload: {
              ids: JSON.stringify(arrIds),
              risk_col: isLeval ? 'is_sub_risk' : 'is_comp_risk',
              risk_value: isShowRiskLevel,
            },
            callback: (res: any) => {
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("修改成功");
                if (actionRef.current) {
                  actionRef.current.reloadTable();
                }
              }
              setBatchEditVisible(false);
            }
          })
        }}
        onCancel={() => setBatchEditVisible(false)}
      >
        <Radio.Group onChange={(e) => setIsShowRiskLevel(e.target.value)} value={isShowRiskLevel}>
          <Radio value={0}>否</Radio>
          <Radio value={1}>是</Radio>
        </Radio.Group>

      </Modal>
    </div>
  )
}
export default connect()(MonthMajorQualityRisks);
