import React, { useRef, useState } from 'react';
import { Button, Space, message, Image } from "antd";
import { connect, useIntl } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { CURR_USER_CODE } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import { getDisplayHierarchy } from "@/utils/utils";
import IframeModal from "@/components/IframeComponent";

import { configColumns } from "./columns";
import Edit from "./Edit";
import Detail from "./Detail";
import AnnualAuditModal from "./AnnualAuditModal";
import ApprovalRecord from "./ApprovalRecord";
/**
 * 质量检查员办证台账
 * @constructor
 */
const InspectorCerateLedger: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const { formatMessage } = useIntl();
  // 控制编辑的状态
  const [editVisible, setEditVisible] = useState<boolean>(false);
  // 控制详情的状态
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // 存储当前选中记录数据的状态
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  // 控制年审的状态
  const [isAuditVisible, setIsAuditVisible] = useState<boolean>(false);
  // 年审记录状态
  const [isApprovalVisible, setIsApprovalVisible] = useState<boolean>(false);
  const isProduction = process.env.BUILD_ENV === 'pro';
  // 用于控制管理查看报表功能的状态变量
  const [iframeVisible, setIframeVisible] = useState<boolean>(false);
  const [printUrl, setPrintUrl] = useState<string | null>(null);
  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      ...getDisplayHierarchy(),
      {
        "title": "InspectorSeniorityApply.name",
        "subTitle": "姓名",
        "dataIndex": "name",
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
      'gender', // 性别
      'birth_date', // 出生日期
      'work_date', // 参加工作时间
      'education', // 文化程度
      'major', // 所学专业
      'job_title', // 职称
      'apply_major', // 申请检查专业
      'certificate_number', // 证号
      'issue_date', // 取证时间
      'annual_audit_date', // 年审时间
      'job_nature_str', // 专职/兼职
      'is_on_duty', // 是否在岗
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
      {
        title: "图片",
        subTitle: "图片",
        dataIndex: "picture_url",
        width: 160,
        align: "center",
        render: (text: any, _record: any) => {
          if(!text) return '/'
          return (
            <Image style={{ width: 30, height: 30 }} src={text} />
          )
        }
      },
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      'modify_user_name',
      {
        title: "操作",
        subTitle: "操作",
        dataIndex: "action",
        width: 310,
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
                  setEditVisible(true);
                }}
              >
                补充证书信息
              </Button>
              {/* is_annual_audit等于1的时候证明可以开始年审了，则显示年审按钮 */}
              <Button
                type="link"
                disabled={record.is_annual_audit === 0}
                onClick={() => {
                  // 只有申请人（只能修改自己数据）和公司批准人可修改数据
                  if (![record.applicant, record.assignee].includes(CURR_USER_CODE)) {
                    message.error('您不是当前申请人或审批人无操作权限！');
                    return;
                  }
                  setSelectedRecord(record);
                  setIsAuditVisible(true);
                }}
              >
                年审
              </Button>
              <Button
                type="link"
                onClick={() => {
                  setSelectedRecord(record);
                  setIsApprovalVisible(true);
                }}
              >
                年审记录
              </Button>
            </Space>
          )
        }
      }
    ])
      .needToFixed([{ value: 'action', fixed: 'right' }])
      .noNeedToFilterIcon(['action'])
      .noNeedToSorterIcon(['action'])
      .setTableColumnToDatePicker([
        { value: 'birth_date', valueType: 'dateTs' },
        { value: 'work_date', valueType: 'dateTs' },
        { value: 'related_work_date', valueType: 'dateTs' },
        { value: 'approval_date', valueType: 'dateTs' },
      ])
      .needToExport([
        ...getDisplayHierarchy(),
        'name',
        'gender',
        'birth_date',
        'job',
        'job_title',
        'work_date',
        'education',
        'graduation_school',
        'major',
        'related_work_date',
        'apply_major',
        'certificate_number',
        'issue_date',
        'annual_audit_date',
        'job_nature_str',
        'is_on_duty_str',
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
          // style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
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
    return [
      <Button
        type={"primary"}
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warn('每次只能操作一条数据');
            return;
          }
          let baseUrl: any;
          if (isProduction) {
            // 正式环境
            baseUrl = `http://123.6.232.59:8080/webroot/decision/view/report?viewlet=WeldSys2.0/TQID/Quality-certificate.cpt&id=${selectedRows[0].id}`;
          } else {
            // 测试/本地环境
            baseUrl = `http://49.4.11.48:8080/webroot/decision/view/report?viewlet=WeldSys2.0/TQID/Quality-certificate.cpt&id=${selectedRows[0].id}`;
          }
          setPrintUrl(baseUrl);
          setIframeVisible(true);
        }}
      >
        质量检查员资格证
      </Button>
    ]
  }

  return (
    <>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle={formatMessage({ id: 'InspectorCerateLedger' })}
        type="workLicenseRegister/getInspector"
        exportType="workLicenseRegister/getInspector"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getInspector2'}
        tableSortOrder={{ sort: 'modify_ts', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
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
          onCancel={() => setIsOpen(false)}
          callbackSuccess={() => {
            setIsOpen(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {
        isAuditVisible && (
          <AnnualAuditModal
            visible={isAuditVisible}
            selectedRecord={selectedRecord}
            onCancel={() => setIsAuditVisible(false)}
            callbackSuccess={() => {
              setIsAuditVisible(false);
              if (actionRef.current) {
                actionRef.current.reloadTable();
              }
            }}
          />
        )
      }
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
      {iframeVisible && printUrl && (
        <IframeModal
          visible={iframeVisible}
          cancel={() => {
            setIframeVisible(false);
            setPrintUrl('');
          }}
          title={'质量检查员资格证'}
          url={printUrl}
        />
      )}
    </>
  )
}
export default connect()(InspectorCerateLedger);
