import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space, DatePicker } from "antd";
import { connect, useIntl } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { ErrorCode, PROP_KEY } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import moment from "moment";
import { getTimeZoneParam } from "@/utils/utils-date";
import IframeModal from "@/components/IframeComponent";

import { configColumns } from "./columns";
import Add from "./Add";
import Detail from "./Detail";
import Edit from "./Edit";

/**
 * 年度生产计划
 * @constructor
 */
const WorkLicenseRegister: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const { formatMessage } = useIntl();
  // 控制添加弹窗显示状态的状态变量
  const [addVisible, setAddVisible] = useState<boolean>(false);
  // 控制编辑弹窗显示状态的状态变量
  const [editVisible, setEditVisible] = useState<boolean>(false);
  // 控制某个面板或菜单展开状态的状态变量
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // 存储当前选中记录数据的状态变量
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  // 获取表格默认当前参数
  const [defaultCurrent, setDefaultCurrent] = useState<any>(new Date().getFullYear());
  const isProduction = process.env.BUILD_ENV === 'pro';
  const [iframeVisible, setIframeVisible] = useState<boolean>(false);
  const [printUrl, setPrintUrl] = useState<string | null>(null);
  const [iframeTitle, setIframeTitle] = useState<string | null>(null);

  // 判断模块公司层级以及分公司层级和项目部层级
  const getDefaultFiltersEngine = () => {
    // PROP_KEY 取得 auth-default-wbs-prop-key的值判断当前层级
    switch (PROP_KEY) {
      // 公司级
      case 'branchComp':
        return [];
      // 分公司
      case 'subComp':
        return [
          { Key: 'branch_comp_code', Val: localStorage.getItem('auth-default-wbsCode'), Operator: '=' }
        ];
        // 项目部
      case 'dep':
        return [
          { Key: 'dep_code', Val: localStorage.getItem('auth-default-cpecc-depCode'), Operator: '=' }
        ];
      default:
        return [];
    }
  };
  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'belong_year', // 所属年份
      {
        "title": "yearProductPlan.project_name",
        "subTitle": "项目名称",
        "dataIndex": "project_name",
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
      'contract_start_date_format', // 合同开工工期
      'contract_end_date_format', // 合同完工工期
      'actual_start_date_format', // 实际开工日期
      'plan_end_date_format', // 预计完工日期
      'plan_output_value', // 年计划产值（万元）
      'progress_description', // 形象进度描述
      'remark', // 备注
      "create_ts_format",
      "create_user_name",
      "modify_ts_format",
      'modify_user_name'
    ])
    .noNeedToSorterIcon([
      'belong_year',
    ])
      .needToExport([
        'belong_year', // 所属年份
        'project_name', // 项目名称,
        'contract_start_date_format', // 合同开工工期
        'contract_end_date_format', // 合同完工工期
        'actual_start_date_format', // 实际开工日期
        'plan_end_date_format', // 预计完工日期
        'plan_output_value', // 年计划产值（万元）
        'progress_description', // 形象进度描述
        'remark', // 备注
        "create_ts_format",
        "create_user_name",
        "modify_ts_format",
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
          style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
          onClick={(e) => {
            if (actionRef.current) {
              actionRef.current.exportFile();
            }
          }}
        >导出</Button>
        <Button
          type="primary"
          onClick={() => {
            // const tz = getTimeZoneParam();
            const belongMonth = defaultCurrent || moment().format('YYYY-MM');
            // 构建报表URL，添加tz和belong_month参数
            let baseUrl;
            if (isProduction) {
              // 正式环境
              baseUrl = `http://123.6.232.59:8080/webroot/decision/view/report?viewlet=WeldSys2.0/anquan/Year-CZplan.cpt&belong_year=${belongMonth}`;
            } else {
              // 测试/本地环境
              baseUrl = `http://49.4.11.48:8080/webroot/decision/view/report?viewlet=WeldSys2.0/anquan/Year-CZplan.cpt&belong_year=${belongMonth}`;
            }

            setIframeVisible(true);
            setIframeTitle('施工年度产值统计报表');
            setPrintUrl(baseUrl);
          }}
        >
          施工年度产值统计报表
        </Button>
        <Button
          type="primary"
          onClick={() => {
            // const tz = getTimeZoneParam();
            const belongMonth = defaultCurrent || moment().format('YYYY-MM');
            // 构建报表URL，添加tz和belong_month参数
            let baseUrl;
            if (isProduction) {
              // 正式环境
              baseUrl = `http://123.6.232.59:8080/webroot/decision/view/report?viewlet=WeldSys2.0/anquan/Year-SCplan.cpt&belong_year=${belongMonth}`;
            } else {
              // 测试/本地环境
              baseUrl = `http://49.4.11.48:8080/webroot/decision/view/report?viewlet=WeldSys2.0/anquan/Year-SCplan.cpt&belong_year=${belongMonth}`;
            }

            setIframeVisible(true);
            setIframeTitle('施工年度生产计划统计报表');
            setPrintUrl(baseUrl);
          }}
        >
          施工年度生产计划统计报表
        </Button>
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
        style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
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
      </Button>,
      <Button
        danger
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
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
                type: "workLicenseRegister/deleteProjectAnnualPlan",
                payload: {
                  id: selectedRows[0].id,
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
    <>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle={formatMessage({ id: 'yearProductPlan' })}
        type="workLicenseRegister/getProjectAnnualPlan"
        exportType="workLicenseRegister/getProjectAnnualPlan"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getProjectAnnualPlan'}
        tableSortOrder={{ sort: 'modify_ts_format', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={[
          { Key: 'belong_year', Val: defaultCurrent || undefined, Operator: '=' },
          ...getDefaultFiltersEngine(),

        ]}
        renderSelfToolbar={() => {
          const onChange = (_date: any, dateString: any) => {
            setDefaultCurrent(dateString);
            // if (actionRef.current) {
            //   actionRef.current.reloadTable();
            // }
          };
          return (
            <Space>
              <DatePicker
                defaultValue={moment()}
                style={{ width: 200 }}
                onChange={onChange}
                picker="year"
                format="YYYY"
              />
            </Space>
          )
        }}
      />
      {addVisible && (
        <Add
          visible={addVisible}
          yearParams={String(defaultCurrent)}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            setAddVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {editVisible && (
        <Edit
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
      {isOpen && (
        <Detail
          visible={isOpen}
          selectedRecord={selectedRecord}
          authority={authority}
          onCancel={() => setIsOpen(false)}
          callbackSuccess={() => {
            setIsOpen(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {iframeVisible && printUrl && (
        <IframeModal
          visible={iframeVisible}
          cancel={() => {
            setIframeVisible(false);
            setPrintUrl('');
          }}
          title={iframeTitle || ''}
          url={printUrl}
        />
      )}
    </>
  )
}
export default connect()(WorkLicenseRegister);
