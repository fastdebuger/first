import React, { useRef, useState, useEffect } from 'react';
import { Button, message, Modal, Space, Radio } from "antd";
import { connect, history } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { ErrorCode, PROP_KEY, WBS_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { getDisplayHierarchy, getDefaultFiltersInspector } from "@/utils/utils";

import { configColumns } from "./columns";
import DateSelfToolbar from "@/components/DateSelfToolbar";
import Edit from "./Edit";
/**
 * 年度重大质量风险
 * @constructor
 */
const YearMajorQualityRisks: React.FC<any> = (props) => {
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
  // 用于储存显示发布时间
  const [publishTime, setPublishTime] = useState<any>(null);
  // 用于控制批量修改风险层级的状态
  const [batchEditVisible, setBatchEditVisible] = useState<boolean>(false);
  // 判断是否为分公司层级
  const isLeval = PROP_KEY === 'subComp';
  // 用于显示风险等级状态
  const [isShowRiskLevel, setIsShowRiskLevel] = useState<number>(1);
  
  // 查询当前年份和月份是否已经发布（发布了的话会返回发布时间） 
  const fetchCurrentPublish = () => {
    const basePayload: any = {
      year: defaultYear,
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
      'project',
      'first_risk_type', // 一级风险类别
      'first_process', // 一级流程/专业
      'second_process', // 二级流程/作业活动
      'work_step', // 作业步骤/工序
      'risk_name', // 风险类别/风险名称
      'risk_position', // 风险部位
      'risk_cause', // 风险可能产生之因
      'risk_consequence', // 风险可能导致之果
      'preventive_measures', // 预防措施/控制方案
      'responsible_dep', // 责任部门
      'responsible_person', // 责任人
      "create_ts_str",
      "create_user_name",
      'is_comp_risk_str', // 公司级风险(0否1是)
      'is_sub_risk_str', // 分公司级风险(0否1是)
      'is_project_risk_str', // 项目级风险(0否1是)
    ])
      .needToFixed([
        { value: 'is_comp_risk_str', fixed: 'right' },
        { value: 'is_sub_risk_str', fixed: 'right' },
        { value: 'is_project_risk_str', fixed: 'right' },
      ])
      .needToExport([
        ...getDisplayHierarchy(),
        'year',
        'project',
        'first_risk_type', // 一级风险类别
        'first_process', // 一级流程/专业
        'second_process', // 二级流程/作业活动
        'work_step', // 作业步骤/工序
        'risk_name', // 风险类别/风险名称
        'risk_position', // 风险部位
        'risk_cause', // 风险可能产生之因
        'risk_consequence', // 风险可能导致之果
        'preventive_measures', // 预防措施/控制方案
        'responsible_dep', // 责任部门
        'responsible_person', // 责任人
        "create_ts_str",
        "create_user_name",
        'is_comp_risk_str', // 公司级风险(0否1是)
        'is_sub_risk_str', // 分公司级风险(0否1是)
        'is_project_risk_str', // 项目级风险(0否1是)
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
              dispatch({
                type: 'workLicenseRegister/getRiskSubmitRecordTime',
                payload: {
                  year: defaultYear,
                  dep_code: localStorage.getItem('auth-default-cpecc-depCode')
                },
                callback: (res: any) => {
                  if (!res.result.submit_str) {
                    dispatch({
                      type: 'workLicenseRegister/generateMajorRiskAnnual',
                      payload: {
                        year: defaultYear,
                      },
                      callback: (res: any) => {
                        if (res.errCode === ErrorCode.ErrOk) {
                          message.success('生成成功！');
                          if (actionRef.current) {
                            actionRef.current.reloadTable();
                          }
                        }
                      }
                    })
                  } else {
                    message.warning('您当前年份已经发布，不能生成重大质量风险了！');
                  }
                }
              });
              
            }}
          >
            生成年度重大质量风险
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
  const renderSelectedRowsToolbar = (selectedRows: any, reloadTable: (filters?: [], noFilters?: []) => void) => {
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
    ]
  }

  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle={'年度重大质量风险'}
        type="workLicenseRegister/queryMajorRiskAnnual"
        exportType="workLicenseRegister/queryMajorRiskAnnual"
        tableColumns={getTableColumns()}
        funcCode={authority + 'queryMajorR1iskAnnual'}
        tableSortOrder={{ sort: 'year', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={PROP_KEY === 'subComp' ? [ // 分公司层级的执行下面的过滤条件
          { "Key": "year", "Val": Number(defaultYear) || new Date().getFullYear(), "Operator": "=" },
          ...getDefaultFiltersInspector(),
          { "Key": "is_submit", "Val": 1, "Operator": "=" }
        ] : PROP_KEY === 'branchComp' ? [  // 公司层级的执行下面的过滤条件
          { "Key": "year", "Val": Number(defaultYear) || new Date().getFullYear(), "Operator": "=" },
          ...getDefaultFiltersInspector(),
          { "Key": "sub_is_submit", "Val": 1, "Operator": "=" }
        ] : [
          { "Key": "year", "Val": Number(defaultYear) || new Date().getFullYear(), "Operator": "=" },
          ...getDefaultFiltersInspector(),
        ]}
        tableDefaultField={{
          year: Number(defaultYear),
        }}
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
              {
                PROP_KEY !== 'branchComp' && (
                  <>
                    <Button
                      type={"primary"}
                      disabled={publishTime}
                      onClick={() => {
                        let basePayload: any = {
                          year: defaultYear,
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
            type: 'workLicenseRegister/updateRiskAnnualRiskStatus',
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
export default connect()(YearMajorQualityRisks);
