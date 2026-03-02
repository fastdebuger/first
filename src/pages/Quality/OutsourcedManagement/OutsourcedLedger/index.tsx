import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Space, Alert, Segmented } from "antd";
import { connect, useIntl } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { PROP_KEY, CURR_USER_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import { getDisplayHierarchy, getDefaultFiltersInspector } from "@/utils/utils";

import { configColumns } from "./columns";
import PersonnelApplyFormDetail from "./Detail";
import PersonnelApplyFormEdit from "./Edit";

/**
 * 外委实验室资质台账
 * @constructor
 */
const OutsourcedLedger: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const { formatMessage } = useIntl();
  // 用于控制编辑的显示状态
  const [editVisible, setEditVisible] = useState(false);
  // 用于控制详情的显示状态
  const [isOpen, setIsOpen] = useState(false);
  // 用于存贮选中记录状态
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  // 用于控制年审的显示状态
  const [approvalVisable, setApprovalVisable] = useState<boolean>(false);
  // 监控状态 
  const [monitoringValue, setMonitoringValue] = useState<string>('0');

  // 检查当前时间是否在12月1日到12月31日之间
  const isDecemberPeriod = () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth()返回0-11，0代表1月
    const currentDay = today.getDate();

    return currentMonth === 12 && currentDay >= 1 && currentDay <= 31;
  };

  /**
    * 表格列配置引用columns文件
    * @returns 返回一个数组
  */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      ...getDisplayHierarchy(),
      PROP_KEY === 'branchComp' ?
      {
        "title": "compinfo.full_name_ledger",
        "subTitle": "试验室名称",
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
            >
              {text}
            </a>
          );
        }
      } : 'lab_full_name',
      'qualification', // 资质名称
      'evaluation_date', // 评价日期
      'qualification_date', // 资质到期时间
      "province_name",
      "city_name",
      "address",
      "lab_nature", // 外委实验室的性质
      'qualification_scope', // 资质范围
      'entrusted_projects', // 拟委托实验项目
      'monitor_name', // 监控人
      'maintainer_names', // 维护人
      'monitoring_status_str', // 监控状态
      'remark', // 备注
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
      // {
      //   title: "操作",
      //   subTitle: "操作",
      //   dataIndex: "action",
      //   width: 160,
      //   align: "center",
      //   render: (_text: any, record: any) => {
      //     const canAdd = isDecemberPeriod(); // 检查是否在12月期间
      //     return (
      //       <Space>
      //         {/* canAdd等于1的时候证明可以开始年审了，则打开年审按钮 */}
      //         <Button
      //           type="link"
      //           disabled={!canAdd}
      //           onClick={() => {
      //             // 只有申请人（只能修改自己数据）和公司批准人可修改数据
      //             if (![record.applicant, record.assignee].includes(CURR_USER_CODE)) {
      //               message.error('您不是当前申请人或审批人无操作权限！');
      //               return;
      //             }
      //             setSelectedRecord(record);
      //             setApprovalVisable(true);
      //           }}
      //         >
      //           年审
      //         </Button>
      //       </Space>
      //     )
      //   }
      // }
    ])
      .needToFixed([{ value: 'action', fixed: 'right' }])
      .noNeedToFilterIcon(['action'])
      .noNeedToSorterIcon(['action'])
      .setTableColumnToDatePicker([
        { value: 'birth_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'train_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'approval_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
      .needToExport([
        ...getDisplayHierarchy(),
        "lab_full_name", // 试验室名称
        'qualification', // 资质名称
        'evaluation_date', // 评价日期
        'qualification_date', // 资质到期时间
        "province_name",
        "city_name",
        "address",
        "lab_nature", // 外委实验室的性质
        'qualification_scope', // 资质范围
        'entrusted_projects', // 拟委托实验项目
        'monitor_name', // 监控人
        'maintainer_names',
        'monitoring_status_str', // 监控状态
        'remark', // 备注
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
    return PROP_KEY === 'branchComp' && [
      <Button
        type={"primary"}
        onClick={() => {
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

    ]
  }
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='外委实验室台账'
        type="workLicenseRegister/getExternalLaboratory"
        exportType="workLicenseRegister/getExternalLaboratory"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getExternalLaboratory'}
        tableSortOrder={{ sort: 'modify_ts', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultFilter={monitoringValue !== '0' ? [
          ...getDefaultFiltersInspector(),
          { Key: 'monitoring_status',Val: monitoringValue, Operator: '=' }
        ]: [
          ...getDefaultFiltersInspector(),
        ]}
        renderSelfToolbar={() => {
          return (
            <Space>
              {/* <Alert type='warning' message="您每年的12-1到12-31号内才可以年审" /> */}
              <Segmented
                value={monitoringValue}
                options={[
                  {value: '0', label: '全部'},
                  {value: '1', label: '在用'},
                  {value: '2', label: '新增'},
                  {value: '3', label: '闲置'},
                ]}
                onChange={(e: any) => {setMonitoringValue(e)}}
                onResize={undefined}
                onResizeCapture={undefined}
              />
            </Space>
          )
        }}
        
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
export default connect()(OutsourcedLedger);
