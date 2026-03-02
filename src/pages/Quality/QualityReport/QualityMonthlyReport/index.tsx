import React, { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Button, message, Modal, Space, Tag } from 'antd';
import { connect } from 'umi';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns } from 'yayang-ui';
import { ErrorCode } from '@/common/const';
import moment from 'moment';
import QualityMonthlyReportDetail from './Detail';
import InitiateApproval from '@/components/Approval/InitiateApproval';
import ViewApproval from '@/components/Approval/ViewApproval';
import { useQualityMonthlyReportLock } from "@/pages/Quality/QualityReport/hooks/useQualityMonthlyReportLock";
import { hasPermission } from '@/utils/authority';


/**
 * 质量月报主页面
 * 功能：展示质量月报列表，支持生成、查看详情、编辑、删除、发起审批
 */
const QualityMonthlyReportPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  // 控制详情弹窗显隐
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  // 存储当前选中的记录
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const { monthlyReportLocked, refreshLockStatus } = useQualityMonthlyReportLock(dispatch);

  /**
   * 生成表格列配置
   * @returns 配置好的列数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns([]);
    cols.initTableColumns([
      {
        title: '月份',
        subTitle: '月份',
        dataIndex: 'month_str',
        width: 120,
        align: 'center',
      } as any,
      {
        title: '状态',
        subTitle: '状态',
        dataIndex: 'status_str',
        width: 120,
        align: 'center',
        render(text: ReactNode) {
          if (text === '审批完成') {
            return <Tag color={'success'}>{text}</Tag>
          } else if (text === '驳回') {
            return <Tag color={'error'}>{text}</Tag>
          } else if (text === '未审批') {
            return <Tag color={'warning'}>{text}</Tag>
          } else if (text === '审批中') {
            return <Tag color={'processing'}>{text}</Tag>
          } else {
            return <Tag color={'default'}>{'暂无审批'}</Tag>
          }
        }
      } as any,
      {
        title: '审批时间',
        subTitle: '审批时间',
        dataIndex: 'approval_date_str',
        width: 180,
        align: 'center',
      } as any,
      {
        title: '质量月报生成人',
        subTitle: '质量月报生成人',
        dataIndex: 'form_maker_name',
        width: 120,
        align: 'center',
      } as any,
      {
        title: '质量月报生成时间',
        subTitle: '质量月报生成时间',
        dataIndex: 'form_make_time_str',
        width: 180,
        align: 'center',
      } as any,
      {
        title: '查看',
        subTitle: '查看',
        dataIndex: 'view',
        width: 200,
        align: 'center',
        fixed: 'right',
        render: (_: any, record: any) => {
          return (
            <Space>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setSelectedRecord(record);
                  setDetailVisible(true);
                }}
              >
                查看质量月报填报情况
              </Button>
            </Space>
          );
        },
      } as any,
    ])
    .noNeedToFilterIcon(['view'])
    .noNeedToSorterIcon(['view'])
    .needToFixed([{ value: 'view', fixed: 'right' }])
    .needToExport([
      'month_str',
      'status_str',
      'approval_date_str',
      'form_maker_name',
      'form_make_time_str',
    ]);
    return cols.getNeedColumns();
  };

  /**
   * 生成质量月报
   * 根据当前月份生成新的质量月报
   */
  const handleGenerateReport = () => {
    if(monthlyReportLocked){
      message.warning('当月月报已经生成，无法进行任何操作');
      return;
    }
    const currentMonth = moment().format('YYYY-MM');
    const startTime = moment().startOf('month').unix(); // 秒级时间戳
    const endTime = moment().endOf('month').unix();     // 秒级时间戳
    Modal.confirm({
      title: '确认生成质量月报',
      content: `确定要生成 ${currentMonth} 的质量月报吗？`,
      onOk: async () => {
        if (dispatch) {
          await dispatch({
            type: 'qualityMonthlyReport/addQualityMonthlyReport',
            payload: {
              start_time: startTime,
              end_time: endTime,
            },
            callback: (res: any) => {
              if (res?.errCode === ErrorCode.ErrOk) {
                message.success('生成质量月报成功');
                if (actionRef.current) {
                  actionRef.current.reloadTable();
                }
                // 重新获取锁定状态
                if (refreshLockStatus) {
                  refreshLockStatus();
                }
              } else {
                message.error(res?.errMsg || '生成质量月报失败');
              }
            },
          });
        }
      },
    });
  };

  /**
   * 功能按钮组
   * @param reloadTable 重新加载表格的函数
   */
  const renderButtonToolbar = () => {
    return [
      <Button
        key="generate"
        type="primary"
        onClick={handleGenerateReport}
      >
        生成质量月报
      </Button>,
    ];
  };

  /**
   * 选中行操作按钮组
   * @param selectedRows 选中的行数据
   * @param reloadTable 重新加载表格的函数
   */
  const renderSelectedRowsToolbar = (selectedRows: any[]) => {
    if (!selectedRows || selectedRows.length !== 1) {
      return [];
    }
    let allowedApproval = true
    // 判断如果审批流程号存在那么无法重新发起审批
    if (selectedRows[0]?.status === 0 || selectedRows[0]?.status === -1) {
      allowedApproval = true
    } else {
      allowedApproval = false
    }
    const selected = selectedRows[0];

    return [
      <InitiateApproval
        style={{ display: hasPermission(authority, '发起审批') ? 'inline' : 'none' }}
        key={selected?.id || 'default-initiate'}
        dispatch={dispatch}
        recordId={selected?.id}
        selectedRecord={selected}
        funcode={'S61'}
        allowedApproval={allowedApproval}
        type="qualityMonthlyReport/startApproval"
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }}
      />,
      <ViewApproval
        style={{ display: hasPermission(authority, '查看审批') ? 'inline' : 'none' }}
        key={`view-${selected?.id || 'default'}`}
        instanceId={selected?.approval_process_id}
        funcCode={'S61'}
        number={selected?.approval_times}
        selectedRecord={selected}
        onSuccess={() => {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }}
      />,
      <Button
        key={authority + 'delete'}
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        danger
        type={'primary'}
        onClick={() => {
          Modal.confirm({
            title: '确认删除',
            content: '确定要删除这条质量月报吗？',
            onOk: async () => {
              if (dispatch) {
                await dispatch({
                  type: 'qualityMonthlyReport/deleteQualityMonthlyReport',
                  payload: {
                    id: selected.id,
                  },
                  callback: (res: any) => {
                    if (res?.errCode === ErrorCode.ErrOk) {
                      message.success('删除成功');
                      if (actionRef.current) {
                        actionRef.current.reloadTable();
                      }
                      // 重新获取锁定状态
                      if (refreshLockStatus) {
                        refreshLockStatus();
                      }
                    } else {
                      message.error(res?.errMsg || '删除失败');
                    }
                  },
                });
              }
            },
          });
        }}
      >
        删除
      </Button>,
    ];
  };

  return (
    <div>
      {/* 主表格组件 */}
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        key={monthlyReportLocked}
        tableTitle="质量月报汇总表"
        moduleCaption="质量月报汇总表"
        type="qualityMonthlyReport/getQualityMonthlyReport"
        exportType="qualityMonthlyReport/getQualityMonthlyReport"
        tableColumns={getTableColumns()}
        funcCode={authority}
        tableSortOrder={{ sort: 'month_str', order: 'desc' }}
        tableDefaultFilter={[
          {
            Key: 'dep_code',
            Val: localStorage.getItem('auth-default-cpecc-depCode') + '%',
            Operator: 'like',
          },
        ]}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        rowSelection={{ type: 'radio' }}
      />

      {/* 详情弹窗：展示七个模块的详细内容 */}
      {detailVisible && selectedRecord && (
        <QualityMonthlyReportDetail
          visible={detailVisible}
          selectedRecord={selectedRecord}
          onClose={() => {
            setDetailVisible(false);
            setSelectedRecord(null);
          }}
          onRefresh={() => {
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  );
};

export default connect()(QualityMonthlyReportPage);
