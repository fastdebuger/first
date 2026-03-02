import React from 'react';
import { Button, Table, Tag } from 'antd';
import { configColumns } from '../columns';
import { BasicTableColumns, SingleTable } from 'yayang-ui';
import { connect } from 'umi';
import { getDepTitle } from '@/utils/utils';
import { numberToChinese } from '@/utils/utils';
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';

const { CrudQueryDetailDrawer } = SingleTable;

const SubcontractorProgressDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord } = props;

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "branch_comp_name",
      "dep_name",
      'contract_name',
      "contract_no",
      "contract_out_name",
      "contract_sign_date_str",
      "contract_start_date_str",
      "contract_end_date_str",
      // "income_info_wbs_name",
      "contract_say_price",
    ]);
    return cols.getNeedColumns();
  };

  /**
   * 生成进度款数据
   * @param record 当前记录
   * @returns 进度款数据数组
   */
  const generateProgressData = (record: any) => {
    if (!record) return [];

    const progressData = [];
    let index = 1;

    // 循环检查每一笔进度款，直到找不到 approval_amount{x} 字段
    while (record[`approval_amount${index}`] !== undefined) {
      const approvalAmount = record[`approval_amount${index}`];

      // 如果审核金额不为空字符串（后台已改为空字符串替代null），则添加这笔进度款
      if (approvalAmount !== '' && approvalAmount !== undefined) {
        progressData.push({
          key: index,
          progressPayment: `第${numberToChinese(index.toString())}笔进度款`,
          approvalAmount: approvalAmount,
          approvalDate: record[`approval_date_str${index}`] || '-',
          isArrival: record[`is_arrival_str${index}`] || '-',
          ratio: record[`ratio${index}`] || '-',
          approvalSchedule: record[`approval_schedule_str${index}`] || '-',
          fileUrl: record[`file_url${index}`] || '',
        });
      }

      index++;
    }

    return progressData;
  };

  /**
   * 进度款表格列配置
   * @returns
   */
  const getProgressTableColumns = () => {
    return [
      {
        title: '进度款',
        dataIndex: 'progressPayment',
        key: 'progressPayment',
        width: 150,
        align: 'center' as const,
      },
      {
        title: '审核金额',
        dataIndex: 'approvalAmount',
        key: 'approvalAmount',
        width: 150,
        align: 'center' as const,
        render: (text: any) => text || '-',
      },
      {
        title: '审批日期',
        dataIndex: 'approvalDate',
        key: 'approvalDate',
        width: 150,
        align: 'center' as const,
        render: (text: any) => text || '-',
      },
      {
        title: '是否到账',
        dataIndex: 'isArrival',
        key: 'isArrival',
        width: 150,
        align: 'center' as const,
        render: (text: any) => text || '-',
      },
      {
        title: '累计占合同额比',
        dataIndex: 'ratio',
        key: 'ratio',
        width: 150,
        align: 'center' as const,
        render: (text: any) => text || '-',
      },
      {
        title: '审批进度',
        dataIndex: 'approvalSchedule',
        key: 'approvalSchedule',
        width: 150,
        align: 'center' as const,
        render: (text: any) => {
          if (text === '审批完成') {
            return <Tag color={'success'}>{text}</Tag>
          } else if (text === '驳回') {
            return <Tag color={'error'}>{text}</Tag>
          } else if (text === '未审批') {
            return <Tag color={'warning'}>{text}</Tag>
          } else if (text === '审批中') {
            return <Tag color={'processing'}>{text}</Tag>
          } else {
            return <Tag color={'default'}>{text || '暂无进度款'}</Tag>
          }
        },
      },
      {
        title: '附件',
        dataIndex: 'fileUrl',
        key: 'fileUrl',
        width: 150,
        align: 'center' as const,
        render: (text: string) => {
          return text ? <Button onClick={() => window.open(getUrlCrypto(text))} size='small' type='link'>下载文件</Button> : <span>暂无附件</span>
        },
      },
    ];
  };

  // 生成进度款数据
  const progressData = generateProgressData(selectedRecord);

  const renderButtonToolbar = () => {
    return [

    ];
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="contract_no"
        title="分包合同进度款详情"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <div style={{ marginTop: 16 }}>
          <h3 style={{ marginBottom: 16 }}>分包合同进度款内容</h3>
          <Table
            columns={getProgressTableColumns()}
            dataSource={progressData}
            pagination={false}
            size="small"
            bordered
            scroll={{y: 'calc(100vh - 520px)'}}
          />
        </div>
      </CrudQueryDetailDrawer>
    </>
  );
};

export default connect()(SubcontractorProgressDetail);
