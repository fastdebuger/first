import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Space } from "antd";
import { connect, useIntl } from 'umi';
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
import "./index.less";

/**
 * 监视和测量设备登记表
 * @constructor
 */
const MonitoringMeasuring: React.FC<any> = (props) => {
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
  const [open, setOpen] = useState(false);
  // 控制操作按钮是否显示权限（根据发起审批来控制）
  const [isShowOperateButton, setIsShowOperateButton] = useState<boolean>(false);
  // 用于存贮当前的详情记录数据
  const [selectedRecord, setSelectedRecord] = useState(null);
  /**
   * 初始化年份和月份状态
   * 使用当前年份和月份作为初始值，月份需要加1因为月份从0开始
   */
  const [defaultYear, setDefaultYear] = useState<any>(new Date().getFullYear());
  const [defaultMonth, setDefaultMonth] = useState<any>(new Date().getMonth() + 1);
  // 颜色方块得统一样式
  const stylesCube = {
    display: 'inline-block',
    width: '12px',
    height: '12px',
    marginRight: '8px'
  }

  useEffect(() => {
    dispatch({
      type: 'workLicenseRegister/devicegetCurrApprovalStatus',
      payload: {
        year: defaultYear,
        month: defaultMonth,
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          if (res.result.isStart) {
            setIsShowOperateButton(res.result.isStart);
          } else {
            setIsShowOperateButton(false);
          }
        }
      }
    })
  }, [defaultYear, defaultMonth]);
  // 
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
      {
        "title": "monitoringMeasuring.name",
        "subTitle": "名称",
        "dataIndex": "name",
        "width": 160,
        "align": "center",
        render(text: any, record: any) {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record);
                setOpen(true);
              }}
              style={{ color: '#1890ff', cursor: 'pointer' }}
            >
              {text}
            </a>
          );
        }
      },
      'spec_model',
      'factory_no',
      'manufacturer',
      'accuracy_grade',
      'measurement_range',
      'is_disposable_str',
      'verification_cycle',
      'verification_date',
      'valid_date',
      'verification_result_str',
      'verification_unit',
      'use_unit',
      'keeper',
      'professional_class_str',
      'category_str',
      'status_str',
      'transfer_to',
      'affiliated_unit_str', // 所属单位
      'safety_protection_str',
      'remark',
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
    ])
      .setTableColumnToDatePicker([
        { value: 'verification_date', valueType: 'dateTs' },
        { value: 'valid_date', valueType: 'dateTs' },
      ])
      .needToExport([
        ...getDisplayHierarchy(),
        'year',
        'month',
        'name',
        'spec_model',
        'factory_no',
        'manufacturer',
        'accuracy_grade',
        'measurement_range',
        'is_disposable',
        'verification_cycle',
        'verification_date',
        'valid_date',
        'verification_result',
        'verification_unit',
        'use_unit',
        'keeper',
        'professional_class',
        'category',
        'status_str',
        'transfer_to',
        'affiliated_unit',
        'safety_protection',
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
        {
          PROP_KEY === 'dep' && (
            <Button
              type="primary"
              // style={{ display: hasPermission(authority, '导入') ? 'inline' : 'none' }}
              onClick={(e) => {
                e.stopPropagation();
                setVisible(true);
              }}
            >导入</Button>
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
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return !isShowOperateButton && [
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
      </Button>,
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
                type: "workLicenseRegister/deleteMeasureDevice",
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
        tableTitle={formatMessage({ id: 'monitoringMeasuring' })}
        type="workLicenseRegister/getMeasureDevice"
        exportType="workLicenseRegister/getMeasureDevice"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getMeasureDevice'}
        tableSortOrder={{ sort: 'modify_ts', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        rowClassName={(record: any) => {
          if (record.warning_color === 'red') {
            return 'table-color-monitor-red';
          }
          if (record.warning_color === 'green') {
            return 'table-color-monitor-green';
          }
          if (record.warning_color === 'blue') {
            return 'table-color-monitor-blue';
          }
          if (record.warning_color === 'yellow') {
            return 'table-color-monitor-yellow';
          }
          return null;
        }}
        tableDefaultFilter={[
          { "Key": "year", "Val": defaultYear || new Date().getFullYear(), "Operator": "=" },
          { "Key": "month", "Val": defaultMonth || new Date().getMonth() + 1, "Operator": "=" },
          // 根据层级传递默认的过滤条件
          ...getDefaultFiltersInspector(),
        ]}
        renderSelfToolbar={(_reloadTable: any) => {
          return (
            <Space>
              {/* 自定义年月组件 */}
              <DateSelfToolbar
                defaultYear={defaultYear}
                defaultMonth={defaultMonth}
                setDefaultYear={setDefaultYear}
                setDefaultMonth={setDefaultMonth}
              />
              {/* 发起审批按钮组件可根据查询审批条件跳转路由页面 */}
              <InitiateApprovalButton
                actionRef={actionRef}
                startType={'workLicenseRegister/devicegetCurrApprovalStatus'}
                approvalType={'workLicenseRegister/addMeasureDeviceApproval'}
                defaultYear={defaultYear}
                defaultMonth={defaultMonth}
                pathName={'/dep/quality/measuringManagement/monitoringMeasuringApproval'}
              />
              <span>
                到期前两个月为：<span style={{ ...stylesCube, background: 'green' }}></span>
                一个月为：<span style={{ ...stylesCube, background: '#5050d3bf' }}></span>
                半个月为：<span style={{ ...stylesCube, background: 'yellow' }}></span>
                过期为：<span style={{ ...stylesCube, background: '#ff4e4e' }}></span>
              </span>
            </Space>

          )
        }}
      />
      {open && selectedRecord && (
        <MonitoringMeasuringDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
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
              const formData = new FormData();
              formData.append('file', file);
              formData.append('funcCode', 'measureDevice');
              formData.append('year', defaultYear);
              formData.append('month', defaultMonth);
              // formData.append('sub_comp_code', WBS_CODE);
              return (
                dispatch({
                  type: 'workLicenseRegister/importMeasureDevice',
                  payload: formData,
                  callback: (res: any) => {
                    if (res.errCode === ErrorCode.ErrOk) {
                      message.success('导入成功');
                      actionRef.current.reloadTable();
                      setVisible(false);
                    }
                  }
                })
              )
            }
          }}
          downLoadTemplate={() => {
            if (actionRef.current) {
              actionRef.current.downloadImportFile('measureDevice');
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
export default connect()(MonitoringMeasuring);
