import type React from 'react';
import type { ColumnsType } from 'antd/es/table';

export interface DataType {
  key: string;
  [key: string]: any;
}

// 格式化金额：千分位，保留两位小数
const formatAmount = (value: any): string => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  const num = Number(value);
  if (isNaN(num)) {
    return '-';
  }
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const getConfigColumns = (year: string, renderEditableCell?: (record: DataType, dataIndex: string, value: any) => React.ReactNode): ColumnsType<DataType> => [
  {
    title: '项目',
    dataIndex: 'dep_name',
    key: 'dep_name',
    width: 240,
    fixed: 'left',
    align: 'center',
    className: 'blue-header',
    onHeaderCell: () => ({
      className: 'blue-header-cell',
    }),
  },
  {
    title: '资金存量',
    dataIndex: 'amount_of_funds_deposited',
    key: 'amount_of_funds_deposited',
    width: 120,
    align: 'center',
    className: 'blue-header',
    onHeaderCell: () => ({
      className: 'blue-header-cell',
    }),
    render: (value: any, record: DataType) => {
      if (renderEditableCell) {
        return renderEditableCell(record, 'amount_of_funds_deposited', value);
      }
      return formatAmount(value);
    },
  },
  {
    title: '债权(客户)',
    children: [
      {
        title: '应收款项净额',
        dataIndex: 'net_receivable_amount',
        key: 'net_receivable_amount',
        width: 150,
        align: 'center',
        className: 'yellow-header',
        onHeaderCell: () => ({
          className: 'yellow-header-cell',
        }),
        render: (value: any) => formatAmount(value),
      },
      {
        title: `${year}年内可回收`,
        dataIndex: 'net_receivable_recover_in_year',
        key: 'net_receivable_recover_in_year',
        width: 150,
        align: 'center',
        className: 'yellow-header',
        onHeaderCell: () => ({
          className: 'yellow-header-cell',
        }),
        render: (value: any) => formatAmount(value),
      },
      {
        title: `${year}年后可回收`,
        dataIndex: 'net_receivable_recover_after_year',
        key: 'net_receivable_recover_after_year',
        width: 150,
        align: 'center',
        className: 'yellow-header',
        onHeaderCell: () => ({
          className: 'yellow-header-cell',
        }),
        render: (value: any) => formatAmount(value),
      },
      {
        title: '已计提坏账及难以回收部分',
        dataIndex: 'net_receivable_bad_debt',
        key: 'net_receivable_bad_debt',
        width: 200,
        align: 'center',
        className: 'yellow-header',
        onHeaderCell: () => ({
          className: 'yellow-header-cell',
        }),
        render: (value: any) => formatAmount(value),
      },

    ],
    className: 'yellow-header',
    onHeaderCell: () => ({
      className: 'yellow-header-cell',
    }),
  },
  {
    title: '预计应收款项',
    dataIndex: 'expected_receivable_amount',
    key: 'expected_receivable_amount',
    width: 150,
    align: 'center',
    className: 'yellow-header',
    onHeaderCell: () => ({
      className: 'yellow-header-cell',
    }),
    render: (value: any) => formatAmount(value),
  },
  {
    title: '债务(供应商)',
    children: [
      {
        title: '应付款项净额 (不包括需核销部分)',
        dataIndex: 'net_payable_amount',
        key: 'net_payable_amount',
        width: 200,
        align: 'center',
        className: 'orange-header',
        onHeaderCell: () => ({
          className: 'orange-header-cell',
        }),
        render: (value: any) => formatAmount(value),
      },
      {
        title: '本年具备支付条件金额 (根据结算方式和工程进度情况已挂账部分应付的金额) (含已到期质保金押金等)',
        dataIndex: 'net_payable_current_year_available',
        key: 'net_payable_current_year_available',
        width: 350,
        align: 'center',
        className: 'orange-header',
        onHeaderCell: () => ({
          className: 'orange-header-cell',
        }),
        render: (value: any) => formatAmount(value),
      },
      {
        title: '质保金、结算资料押金 (尚未到期,本年不支付)',
        dataIndex: 'net_payable_quality_and_deposit',
        key: 'net_payable_quality_and_deposit',
        width: 250,
        align: 'center',
        className: 'orange-header',
        onHeaderCell: () => ({
          className: 'orange-header-cell',
        }),
        render: (value: any) => formatAmount(value),
      },
      {
        title: `${year}年后付款金额 (如结算后支付等)`,
        dataIndex: 'net_payable_after_year',
        key: 'net_payable_after_year',
        width: 200,
        align: 'center',
        className: 'orange-header',
        onHeaderCell: () => ({
          className: 'orange-header-cell',
        }),
        render: (value: any) => formatAmount(value),
      },

    ],
    className: 'orange-header',
    onHeaderCell: () => ({
      className: 'orange-header-cell',
    }),
  },
  {
    title: '预计应付款项',
    dataIndex: 'expected_remaining_payable',
    key: 'expected_remaining_payable',
    width: 150,
    align: 'center',
    className: 'orange-header',
    onHeaderCell: () => ({
      className: 'orange-header-cell',
    }),
    render: (value: any) => formatAmount(value),
  },
  {
    title: '净债权',
    children: [
      {
        title: '应收应付款项净额差',
        dataIndex: 'net_receivable_payable_diff',
        key: 'net_receivable_payable_diff',
        width: 180,
        align: 'center',
        className: 'green-header',
        onHeaderCell: () => ({
          className: 'green-header-cell',
        }),
        render: (value: any) => formatAmount(value),
      },
      {
        title: `${year}年年内具备回收条件金额-具备支付条件金额`,
        dataIndex: 'year_in_recoverable_minus_payable',
        key: 'year_in_recoverable_minus_payable',
        width: 300,
        align: 'center',
        className: 'green-header',
        onHeaderCell: () => ({
          className: 'green-header-cell',
        }),
        render: (value: any) => formatAmount(value),
      },
      {
        title: `${year}年后具备回收条件金额-支付条件金额`,
        dataIndex: 'year_after_recoverable_minus_payable',
        key: 'year_after_recoverable_minus_payable',
        width: 300,
        align: 'center',
        className: 'green-header',
        onHeaderCell: () => ({
          className: 'green-header-cell',
        }),
        render: (value: any) => formatAmount(value),
      },
      {
        title: '已计提坏账及难以回收部分债权',
        dataIndex: 'copy_net_receivable_bad_debt',
        key: 'copy_net_receivable_bad_debt',
        width: 250,
        align: 'center',
        className: 'green-header',
        onHeaderCell: () => ({
          className: 'green-header-cell',
        }),
        render: (value: any) => formatAmount(value),
      },

    ],
    className: 'green-header',
    onHeaderCell: () => ({
      className: 'green-header-cell',
    }),
  },
  {
    title: '预计净应收款项',
    dataIndex: 'expected_net_receivable',
    key: 'expected_net_receivable',
    width: 180,
    align: 'center',
    className: 'green-header',
    onHeaderCell: () => ({
      className: 'green-header-cell',
    }),
    render: (value: any) => formatAmount(value),
  },
  {
    title: '内部贷款及上级拨入资金',
    dataIndex: 'internal_loan_and_upper_fund',
    key: 'internal_loan_and_upper_fund',
    width: 200,
    align: 'center',
    className: 'light-blue-header',
    onHeaderCell: () => ({
      className: 'light-blue-header-cell',
    }),
    render: (value: any, record: DataType) => {
      if (renderEditableCell) {
        return renderEditableCell(record, 'internal_loan_and_upper_fund', value);
      }
      return formatAmount(value);
    },
  },
  {
    title: '基础资金动态余额 (本年收支)',
    dataIndex: 'base_fund_dynamic_balance',
    key: 'base_fund_dynamic_balance',
    width: 200,
    align: 'center',
    className: 'beige-header',
    onHeaderCell: () => ({
      className: 'beige-header-cell',
    }),
    render: (value: any) => formatAmount(value),
  },
  {
    title: '远期资金动态余额',
    dataIndex: 'forward_fund_dynamic_balance',
    key: 'forward_fund_dynamic_balance',
    width: 180,
    align: 'center',
    className: 'red-header',
    onHeaderCell: () => ({
      className: 'red-header-cell',
    }),
    render: (value: any) => formatAmount(value),
  },
  {
    title: '利润中心编码',
    dataIndex: 'profit_center_code',
    key: 'profit_center_code',
    width: 150,
    align: 'center',
    className: 'light-blue-header',
    onHeaderCell: () => ({
      className: 'light-blue-header-cell',
    }),
  },
];

