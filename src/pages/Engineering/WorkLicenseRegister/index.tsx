import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space, Spin, DatePicker } from "antd";
import { connect, useIntl } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { ErrorCode } from "@/common/const";
import { ApprovalStatusTag } from "@/common/common";
import { hasPermission } from "@/utils/authority";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import ViewApproval from "@/components/Approval/ViewApproval";
import { getDefaultFiltersEngine } from "@/utils/utils";
import { configColumns } from "./columns";
import Add from "./Add";
import Detail from "./Detail";
import Edit from "./Edit";
// import moment from "moment";
/**
 * 作业许可证登记表
 * @constructor
 */
const WorkLicenseRegister: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const { formatMessage } = useIntl();
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { RangePicker } = DatePicker;
  const [workTimeValue, setWorkTimeValue] = useState<any>(null);
  const [timeFilter, setTimeFilter] = useState<{ startTime?: number | string; endTime?: number | string }>({});
  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      {
        "title": "wrokLicenseRegister.work_permit_code",
        "subTitle": "作业许可证编号",
        "dataIndex": "work_permit_code",
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
      'branch_comp_name', // 分公司名称
      // 作业单位
      "wbs_name",
      // 作业内容名称
      "work_content_name",
      // 作业地点
      "work_location",
      // 作业开始时间
      "start_time_str",
      // 作业结束时间
      "end_time_str",
      // 作业批准人
      "approver",
      // 作业监护人
      "guardian",
      // 记录人
      'recorder',
      "remark",
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
      {
        title: "scheduleManagement.flow_status",
        subTitle: "审批状态",
        dataIndex: "flow_status",
        width: 160,
        align: "center",
        render: (text: any, _record: any) => {
          // 如果是字符串/数字 在显示状态
          if (typeof text === 'string' || typeof text === 'number') {
            return ApprovalStatusTag(text);
          }
          return '-';
        }
      },
    ])
      .needToFixed([
        { value: 'flow_status', fixed: 'right' }
      ])
      .needToExport([
        'work_permit_code',
        "wbs_name",
        "work_content_name",
        "work_location",
        "start_time_str",
        "end_time_str",
        "approver",
        "guardian",
        'recorder',
        "remark",
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
            e.stopPropagation();
            setVisible(true);
          }}
        >导入</Button>
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
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    // 选中的数据只在审批状态全部为 0 时显示编辑按钮； 0草稿 1待审批 2审批通过 3驳回
    const flowStatusFlag = selectedRows.every((row: any) => Number(row.flow_status) === 0);
    return [
      flowStatusFlag && <Button
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
      <Button type="primary"
        onClick={() => {
          if (selectedRows[0]?.approval_process_id) {
            message.warning('当前数据已发起审批无需重新发起');
            setIsLoading(false);
            return
          }
          setIsLoading(true);
          dispatch({
            type: 'workLicenseRegister/startApproval',
            payload: {
              func_code: 'S29',
              id: selectedRows[0]?.id
            },
            callback: (res: any) => {
              if (res.errCode === ErrorCode.ErrOk) {
                message.success('审批发起成功');
                if (actionRef.current) {
                  actionRef.current.reloadTable();
                }
              } else {
                message.error(res.errMsg || '审批发起失败');
              }
              setIsLoading(false);

            },
          });

        }}>
        发起审批
      </Button>,
      [
        selectedRows?.length === 1 && (
          <ViewApproval
            // style={{ display: hasPermission(authority, '查看审批') ? 'inline' : 'none' }}
            key={`view-${selectedRows[0]?.RowNumber || 'default'}`} // 添加key属性强制重新渲染
            instanceId={selectedRows[0]?.approval_process_id}
            funcCode={'S29'}
            id={selectedRows[0]?.id}
            selectedRecord={selectedRows[0]}
            onSuccess={() => {
              if (actionRef.current) {
                actionRef.current.reloadTable();
              }
            }}
          />
        )
      ],
      flowStatusFlag && (
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
                  type: "workLicenseRegister/deleteWorkPermit",
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
      )
    ]
  }

  /**
   * 处理时间范围变化
   */
  const handleTimeRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates && dates.length > 0) {
      const [start, end] = dates;
      const startSecond = Math.floor(Date.parse(start.format('YYYY-MM-DD HH:mm')) / 1000);
      const endTimer = Math.floor(Date.parse(end.format('YYYY-MM-DD HH:mm')) / 1000);

      setWorkTimeValue(dates);
      const currD = new Date();
      const az = currD.getTimezoneOffset() / 60;
      const faz = az < 0 ? Math.abs(az) : -az;
      setTimeFilter({
        startTime: startSecond - (faz * 3600),
        endTime: endTimer - (faz * 3600)
      });
    } else {
      setWorkTimeValue(null);
      setTimeFilter({});
    }

  };

  return (
    <Spin spinning={isLoading}>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle={formatMessage({ id: 'wrokLicenseRegister' })}
        type="workLicenseRegister/getWorkPermit"
        exportType="workLicenseRegister/getWorkPermit"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getWorkPermit'}
        tableDefaultFilter={workTimeValue ? [
          ...getDefaultFiltersEngine(),
          { "Key": "start_time", "Val": timeFilter.startTime, "Operator": ">=" },
          { "Key": "end_time", "Val": timeFilter.endTime, "Operator": "<=" }
        ] : [
          ...getDefaultFiltersEngine(),
        ]}
        tableSortOrder={{ sort: 'modify_ts_str', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        renderSelfToolbar={() => {
          return (
            <>
              <RangePicker
                style={{ width: '360px' }}
                value={workTimeValue}
                format="YYYY-MM-DD HH:mm"
                showTime
                placeholder={["请选择作业开始时间", '请选择作业结束时间']}
                onChange={handleTimeRangeChange}
              />
            </>
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
      {visible && (
        <BaseImportModal
          visible={visible}
          maxCount={1}
          onCancel={() => setVisible(false)}
          startUploadFile={(file: any) => {
            if (actionRef.current) {
              const formData = new FormData();
              formData.append('file', file);
              formData.append('funcCode', 'importWorkPermit');
              return (
                dispatch({
                  type: 'workLicenseRegister/importAttendance',
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
              actionRef.current.downloadImportFile('importWorkPermit');
            }
          }}
        />
      )}
      {isOpen && (
        <Detail
          visible={isOpen}
          selectedRecord={selectedRecord}
          onCancel={() => setIsOpen(false)}
          authority={authority}
          callbackSuccess={() => {
            setIsOpen(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </Spin>
  )
}
export default connect()(WorkLicenseRegister);
