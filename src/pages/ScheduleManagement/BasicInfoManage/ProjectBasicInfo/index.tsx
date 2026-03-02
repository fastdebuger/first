import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space, Select, Alert, DatePicker } from "antd";
import { connect, useIntl } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode, PROP_KEY } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import InitiateApproval from "@/components/Approval/InitiateApproval";
import ViewApproval from "@/components/Approval/ViewApproval";
import { getDefaultFilters } from "@/utils/utils";
import { ApprovalStatusTag } from "@/common/common";

import { configColumns } from "./columns";
import Add from "./Add";
import Edit from "./Edit";
import Detail from "./Detail";

/**
 * 项目基础信息
 * @constructor
 */
const ProjectBasicInfo: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const { formatMessage } = useIntl();
  const { RangePicker } = DatePicker;
  /**
 * React组件中的状态管理Hook声明
 * 用于控制页面中各种弹窗的显示状态和数据存储
 */
  // 控制主弹窗显示状态的状态Hook
  const [visible, setVisible] = useState(false);
  // 控制添加弹窗显示状态的状态Hook
  const [addVisible, setAddVisible] = useState(false);
  // 控制编辑弹窗显示状态的状态Hook
  const [editVisible, setEditVisible] = useState(false);
  // 控制详情弹窗显示状态的状态Hook
  const [detailVisible, setDetailVisible] = useState(false);
  // 存储当前选中记录数据的状态Hook
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  // 存储区域分类信息的状态Hook
  const [regionCategory, setRegionCategory] = useState<string | number | null>(null);
  /**
 * 初始化项目列表的查询参数状态
 * 该状态包含分页、排序、筛选等所有必要的查询条件
 */
  const [currentParams, setCurrentParams] = useState<any>({
    start_date: undefined,
    end_date: undefined,
    query_by_project_status: undefined
  });

  /**
   * 表格列配置
   * @returns 返回数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      {
        "title": "scheduleManagement.project_name",
        "subTitle": "项目名称",
        "dataIndex": "project_name",
        "width": 160,
        "align": "center",
        render(text: any, record: any) {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record);
                setDetailVisible(true);
              }}
            >
              {text}
            </a>
          );
        }
      },
      'contract_start_date_format', //合同开工日期
      'contract_end_date_format', // 合同完工日期
      'contract_mode_name', // 合同类型
      // 项目等级
      // 'contract_say_price', //合同金额（含税）
      {
        "title": "scheduleManagement.contract_say_price",
        "subTitle": "合同金额（含税）",
        "dataIndex": "contract_say_price",
        "width": 160,
        "align": "center",
        render(text: any, _record: any) {
          const numText = Number(text);
          if (numText) {
            return (
              <span>{(numText / 10000)}</span>
            )
          }
          return (
            <span>'-'</span>
          )
        }
        
      },
      "construction_dep", // 建设单位
      "report_project_status_name", // 项目状态（按新开工、按在执行、按完工、按累计执行、按计划完工）
      //  审批状态
      
      // 录入人
      'create_user_name',
      // 	录入日期
      'create_ts_format',
      'modify_user_name',
      // 修改时间
      'modify_ts_format',
      {
        "title": "scheduleManagement.flow_status",
        "subTitle": "审批状态",
        "dataIndex": "flow_status",
        "width": 160,
        "align": "center",
        render: (text: any, _record: any) => {
          if (typeof text === 'string' || typeof text === 'number') {
            return ApprovalStatusTag(text);
          }
          return '-';
        }
      },
    ])
      .needToFixed([{ value: 'flow_status', fixed: "right" }])
      .needToExport([
        "project_name",
        'contract_start_date', //合同开工日期
        'contract_end_date', // 合同完工日期
        'contract_mode_name', // 合同类型
        // 项目等级
        'contract_say_price', //合同金额（含税）
        "construction_dep", // 建设单位
        "report_project_status_name", // 项目状态（按新开工、按在执行、按完工、按累计执行、按计划完工）
        //  审批状态
        'flow_status',
        // 	录入日期
        'create_user_name',
        // 	录入日期
        'create_ts_format',
        'modify_user_name',
        // 修改时间
        'modify_ts_format',
      ])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   * @param reloadTable 重新加载表格
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Space>
        {
          PROP_KEY === 'dep' && (
            <>
              <Button
                style={{ display: hasPermission(authority, '新增') ? 'inline' : 'none' }}
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
            </>
          )
        }
        <Button
          style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
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
    // 选中的数据只在审批状态全部为 0 时显示编辑
    const flowStatusFlag = selectedRows.every((row: any) => Number(row.flow_status) === 0);
    // 修改发起审批功能，如果flow_status等于0或者3则可以发起审批
    const canInitiateApprovalAllRows = selectedRows.every((row: any) => [0,3].includes(Number(row.flow_status)));
    return [
      PROP_KEY === 'dep' && flowStatusFlag && (
        <Button
          type={"primary"}
          style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
          onClick={() => {
            // 检查是否选择了数据行，如果没有选择则显示警告信息并终止执行
            if (selectedRows.length === 0) {
              message.warn('请选择一条数据');
              return;
            }
            // 检查选中行数是否为1，如果不是则提示用户并终止操作
            // 该代码块用于确保每次只对一条数据进行操作，避免批量操作带来的逻辑复杂性
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
      PROP_KEY === 'dep' && selectedRows.length === 1 && (
        <InitiateApproval
          // style={{ display: hasPermission(authority, '发起审批') ? 'inline' : 'none' }}
          key={selectedRows?.RowNumber || 'default'} // 添加key属性强制重新渲染
          recordId={selectedRows[0]?.project_id}
          selectedRecord={{
            ...selectedRows[0],
            approval_schedule: !canInitiateApprovalAllRows
          }}
          dispatch={dispatch}
          funcode={'S27'}
          type='basicInfo/startApproval'
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
          funcCode={'S27'}
          id={selectedRows[0]?.project_id}
          selectedRecord={selectedRows[0]}
          onSuccess={() => {
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )
      ],
      <Button
        danger
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => {
          // 检查选中行数是否为1，如果不是则提示用户并返回
          // 该逻辑用于限制删除操作只能针对单条数据进行
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
                type: "basicInfo/deleteProjectBaseInfo",
                payload: {
                  project_id: selectedRows[0].project_id,
                },
                callback: (res: any) => {
                  if (res.errCode === ErrorCode.ErrOk) {
                    message.success("删除成功");
                    // 检查actionRef的current属性是否存在，如果存在则调用其reloadTable方法来重新加载表格数据
                    if (actionRef.current) {
                      actionRef.current.reloadTable();
                    }
                  }
                },
              });
            },
            onCancel() {
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
        rowKey="project_id"
        tableTitle={formatMessage({ id: 'scheduleManagement.basicInfoMent' })}
        type="basicInfo/getProjectBaseInfoList"
        exportType="basicInfo/getProjectBaseInfoList"
        tableColumns={getTableColumns()}
        funcCode={authority + 'scheduleManagemen1t_basicInfoMent'}
        tableDefaultFilter={getDefaultFilters()}
        renderSelfToolbar={() => {
          /**
           * 处理搜索条件验证
           * @returns {boolean} 返回搜索条件是否完整有效的布尔值
           * 如果开始时间、结束时间、项目状态都存在的话为true
           * true: 所有必需的搜索参数都已设置
           * false: 缺少必要的搜索参数
           */
          const handleSearch = () => {
            return !!(
              currentParams.start_date &&
              currentParams.end_date &&
              currentParams.query_by_project_status
            );
          }
          return (
            <Space>
              <RangePicker
                onChange={(dates: any) => {
                  if (!dates?.[0] || !dates?.[1]) {
                    setCurrentParams(prev => ({ ...prev, start_date: '', end_date: '' }));
                    return;
                  }
                  const start_date = Math.floor(dates[0].startOf('day').valueOf() / 1000);
                  const end_date = Math.floor(dates[1].endOf('day').valueOf() / 1000);
                  setCurrentParams(prev => ({
                    ...prev,
                    start_date: String(start_date),
                    end_date: String(end_date)
                  }));
                }}
                placeholder={['开始日期', '结束日期']}
                format="YYYY-MM-DD"
              />
              项目状态：
              <Select
                style={{ width: 240 }}
                value={currentParams.query_by_project_status}
                placeholder="请选择项目状态"
                options={[
                  { value: '1', label: '按新开工' },
                  { value: '2', label: '按在执行' },
                  { value: '3', label: '按完工' },
                  { value: '4', label: '按累计执行' },
                  { value: '5', label: '按计划完工' },
                ]}
                onChange={(e) => { setCurrentParams((prev: any) => ({ ...prev, query_by_project_status: e })) }}
              />
              <Button
                disabled={!handleSearch()}
                onClick={() => {
                  if(actionRef.current) actionRef.current.reloadTable();

                }}>搜索</Button>
              <Button
                onClick={() => {
                  setCurrentParams({
                    start_date: undefined,
                    end_date: undefined,
                    query_by_project_status: undefined
                  });
                  if(actionRef.current) actionRef.current.reloadTable();
                }}>重置</Button>
            </Space>
          )
        }}
        tableSortOrder={{ sort: 'modify_ts_format', order: 'desc' }}
        tableDefaultField={{
          ...currentParams
        }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
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
      {
        editVisible && (
          <Edit
            visible={editVisible}
            onCancel={() => setEditVisible(false)}
            selectedRecord={selectedRecord}
            callbackSuccess={() => {
              setEditVisible(false);
              if (actionRef.current) {
                actionRef.current.reloadTable();
              }
            }}
          />
        )
      }
      {
        detailVisible && (
          <Detail
            visible={detailVisible}
            onCancel={() => setDetailVisible(false)}
            selectedRecord={selectedRecord}
          />
        )
      }
      {visible && (
        <BaseImportModal
          maxCount={1}
          visible={visible}
          onCancel={() => setVisible(false)}
          renderHeaderBar={() => {
            const handleSelected = (e: any) => {
              setRegionCategory(e);
            }
            return (
              <div style={{ padding: '16px 0' }}>
                <Alert
                  message="请您先选则区域后，再下载模板！"
                  type="warning"
                  closable
                />
                <div style={{ padding: '16px 0' }}>
                  区域：<Select
                    value={regionCategory}
                    style={{ width: 260 }}
                    onChange={handleSelected}
                    options={[{ value: '0', label: '国内' }, { value: '1', label: '国外' }]}
                  />
                </div>
              </div>
            )
          }}
          startUploadFile={(file: any) => {
            if (actionRef.current) {
              const formData = new FormData();
              formData.append('file', file);
              return (
                dispatch({
                  type: 'basicInfo/importProjectBaseInfo',
                  payload: formData,
                  callback: (res: any) => {
                    actionRef.current.reloadTable();
                    setVisible(false);
                  }
                })
              )

            }

          }}
          downLoadTemplate={() => {
            if (!regionCategory) {
              message.warn('请先选择区域！');
              return
            }
            dispatch({
              type: 'basicInfo/getTemplateDownloadUrl',
              payload: {
                op: 'xlsx',
                exType: 0,
                region_category: regionCategory
              },
              callback: (response: any) => {
                if (response && response.result && response.result.fileUrl) {
                  window.open(response.result.fileUrl, '_self');
                } else if (response && response.result) {
                  window.open(response.result, '_self');
                }
              },
            });

          }}
        />
      )}
    </div>
  )
}
export default connect()(ProjectBasicInfo);
