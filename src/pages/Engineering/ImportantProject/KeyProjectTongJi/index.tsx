import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'umi';
import {getKeyProjectStatistic} from "@/services/engineering/weeklyReport";
import { Table } from 'antd';

/**
 * 重点项目台账
 * @constructor
 */
const KeyProjectListPage: React.FC<any> = (props) => {

  const [dataSource, setDataSource] = useState<any[]>([]);

  const fetchList = async () => {
    const res = await getKeyProjectStatistic({

    })
    boundData(res.result)
  }

  useEffect(() => {
    fetchList();
  }, [])

  const boundData = (rawData) => {
    // 数据源：所有数值均从 rawData 提取，合并规则固定
    const data = [
      // 第1行：顶部状态（数据完全来自 rawData["按状态"]）
      {
        key: 'row1',
        col0: '全部',
        col1: `${rawData["按状态"]["累计执行"]} 累计执行`,
        col2: `累计新开工${rawData["按状态"]["累计新开工"]}`,
        col3: `累计完工${rawData["按状态"]["累计完工"]}`,
        col4: `在执行${rawData["按状态"]["在执行"]}`,
        spans: {
          col0: { rowSpan: 1, colSpan: 1 },
          col1: { rowSpan: 1, colSpan: 1 },
          col2: { rowSpan: 1, colSpan: 1 },
          col3: { rowSpan: 1, colSpan: 1 },
          col4: { rowSpan: 1, colSpan: 1 },
        },
      },
      // 第2行：“在执行中项目”标题（合并5列）
      {
        key: 'row2',
        col0: '在执行中项目',
        col1: '',
        col2: '',
        col3: '',
        col4: '',
        spans: {
          col0: { rowSpan: 1, colSpan: 5 }, // 固定合并5列
          col1: { rowSpan: 0, colSpan: 0 },
          col2: { rowSpan: 0, colSpan: 0 },
          col3: { rowSpan: 0, colSpan: 0 },
          col4: { rowSpan: 0, colSpan: 0 },
        },
      },
      // 按专业（所有数值来自 rawData["按专业"]）
      {
        key: 'row3',
        col0: '按专业',
        col1: '油气田地面工程',
        col2: '',
        col3: rawData["按专业"]["油气田地面工程"], // 绑定rawData,
        col4: '',
        spans: {
          col0: { rowSpan: 7, colSpan: 1 }, // 固定跨7行
          col1: { rowSpan: 1, colSpan: 2 },
          col2: { rowSpan: 1, colSpan: 0 },
          col3: { rowSpan: 1, colSpan: 2 },
          col4: { rowSpan: 1, colSpan: 0 },
        },
      },
      {
        key: 'row4',
        col0: '',
        col1: '油气储运工程',
        col2: '',
        col3: rawData["按专业"]["油气储运工程"], // 绑定rawData
        col4: '',
        spans: {
          col0: { rowSpan: 0, colSpan: 1 },
          col1: { rowSpan: 1, colSpan: 2 },
          col2: { rowSpan: 1, colSpan: 0 },
          col3: { rowSpan: 1, colSpan: 2 },
          col4: { rowSpan: 1, colSpan: 0 },
        },
      },
      {
        key: 'row5',
        col0: '',
        col1: '炼化工程',
        col2: '',
        col4: '',
        col3: rawData["按专业"]["炼化工程"], // 绑定rawData
        spans: {
          col0: { rowSpan: 0, colSpan: 1 },
          col1: { rowSpan: 1, colSpan: 2 },
          col2: { rowSpan: 1, colSpan: 0 },
          col3: { rowSpan: 1, colSpan: 2 },
          col4: { rowSpan: 1, colSpan: 0 },
        },
      },
      {
        key: 'row6',
        col0: '',
        col1: 'LNG工程',
        col2: '',
        col4: '',
        col3: rawData["按专业"]["LNG工程"], // 绑定rawData
        spans: {
          col0: { rowSpan: 0, colSpan: 1 },
          col1: { rowSpan: 1, colSpan: 2 },
          col2: { rowSpan: 1, colSpan: 0 },
          col3: { rowSpan: 1, colSpan: 2 },
          col4: { rowSpan: 1, colSpan: 0 },
        },
      },
      {
        key: 'row7',
        col0: '',
        col1: '环保工程',
        col2: '',
        col4: '',
        col3: rawData["按专业"]["环保工程"], // 绑定rawData
        spans: {
          col0: { rowSpan: 0, colSpan: 0 },
          col1: { rowSpan: 1, colSpan: 2 },
          col2: { rowSpan: 1, colSpan: 0 },
          col3: { rowSpan: 1, colSpan: 2 },
          col4: { rowSpan: 1, colSpan: 0 },
        },
      },
      {
        key: 'row8',
        col0: '',
        col1: '三新工程',
        col2: '',
        col4: '',
        col3: rawData["按专业"]["三新工程"], // 绑定rawData
        spans: {
          col0: { rowSpan: 0, colSpan: 0 },
          col1: { rowSpan: 1, colSpan: 2 },
          col2: { rowSpan: 1, colSpan: 0 },
          col3: { rowSpan: 1, colSpan: 2 },
          col4: { rowSpan: 1, colSpan: 0 },
        },
      },
      {
        key: 'row9',
        col0: '',
        col1: '项目管理及其他工程',
        col2: '',
        col4: '',
        col3: rawData["按专业"]["项目管理及其他工程"], // 绑定rawData
        spans: {
          col0: { rowSpan: 0, colSpan: 0 },
          col1: { rowSpan: 1, colSpan: 2 },
          col2: { rowSpan: 1, colSpan: 0 },
          col3: { rowSpan: 1, colSpan: 2 },
          col4: { rowSpan: 1, colSpan: 0 },
        },
      },
      // 按地域（所有数值来自 rawData["按地域"]）
      {
        key: 'row10',
        col0: '按地域',
        col1: '国内',
        col2: rawData["按地域"]["国内"],
        col3: '系统内',
        col4: rawData["按地域"]["国内系统内"], // 绑定rawData
        spans: {
          col0: { rowSpan: 4, colSpan: 1 }, // 固定跨5行
          col1: { rowSpan: 2, colSpan: 1 }, // 国内跨3行
          col2: { rowSpan: 2, colSpan: 1 },
          col3: { rowSpan: 1, colSpan: 1 },
          col4: { rowSpan: 1, colSpan: 1 },
        },
      },
      {
        key: 'row11',
        col0: '',
        col1: '',
        col2: '',
        col3: '系统外',
        col4: rawData["按地域"]["国内系统外"], // 绑定rawData
        spans: {
          col0: { rowSpan: 0, colSpan: 0 },
          col1: { rowSpan: 0, colSpan: 0 },
          col2: { rowSpan: 0, colSpan: 1 },
          col3: { rowSpan: 1, colSpan: 1 },
          col4: { rowSpan: 1, colSpan: 1 },
        },
      },
      // {
      //   key: 'row12',
      //   col0: '',
      //   col1: '',
      //   col2: '',
      //   col3: '国内集团外部',
      //   col4: rawData["按地域"]["国内集团外部"], // 绑定rawData
      //   spans: {
      //     col0: { rowSpan: 0, colSpan: 0 },
      //     col1: { rowSpan: 0, colSpan: 0 },
      //     col2: { rowSpan: 0, colSpan: 1 },
      //     col3: { rowSpan: 1, colSpan: 1 },
      //     col4: { rowSpan: 1, colSpan: 1 },
      //   },
      // },
      {
        key: 'row13',
        col0: '',
        col1: '国外',
        col2: rawData["按地域"]["国外"],
        col3: '系统内',
        col4: rawData["按地域"]["国外系统内"], // 绑定rawData
        spans: {
          col0: { rowSpan: 0, colSpan: 0 },
          col1: { rowSpan: 2, colSpan: 1 }, // 国外跨2行
          col2: { rowSpan: 2, colSpan: 1 },
          col3: { rowSpan: 1, colSpan: 1 },
          col4: { rowSpan: 1, colSpan: 1 },
        },
      },
      {
        key: 'row14',
        col0: '',
        col1: '',
        col2: '',
        col3: '系统外',
        col4: rawData["按地域"]["国外系统外"], // 绑定rawData
        spans: {
          col0: { rowSpan: 0, colSpan: 0 },
          col1: { rowSpan: 0, colSpan: 0 },
          col2: { rowSpan: 0, colSpan: 1 },
          col3: { rowSpan: 1, colSpan: 1 },
          col4: { rowSpan: 1, colSpan: 1 },
        },
      },
      // 按系统（所有数值来自 rawData["按系统"]）
      {
        key: 'row15',
        col0: '按系统',
        col1: '系统内',
        col2: rawData["按系统"]["系统内"], // 绑定rawData
        col3: '国内',
        col4: rawData["按系统"]["系统内国内"], // 绑定rawData
        spans: {
          col0: { rowSpan: 4, colSpan: 1 }, // 固定跨4行
          col1: { rowSpan: 2, colSpan: 1 }, // 系统内跨2行
          col2: { rowSpan: 2, colSpan: 1 },
          col3: { rowSpan: 1, colSpan: 1 },
          col4: { rowSpan: 1, colSpan: 1 },
        },
      },
      {
        key: 'row16',
        col0: '',
        col1: '',
        col2: '',
        col3: '国外',
        col4: rawData["按系统"]["系统内国外"], // 绑定rawData
        spans: {
          col0: { rowSpan: 0, colSpan: 0 },
          col1: { rowSpan: 0, colSpan: 0 },
          col2: { rowSpan: 0, colSpan: 1 },
          col3: { rowSpan: 1, colSpan: 1 },
          col4: { rowSpan: 1, colSpan: 1 },
        },
      },
      {
        key: 'row17',
        col0: '',
        col1: '系统外',
        col2: rawData["按系统"]["系统外"], // 绑定rawData
        col3: '国内',
        col4: rawData["按系统"]["系统外国内"], // 绑定rawData
        spans: {
          col0: { rowSpan: 0, colSpan: 0 },
          col1: { rowSpan: 2, colSpan: 1 }, // 系统外跨2行
          col2: { rowSpan: 2, colSpan: 1 },
          col3: { rowSpan: 1, colSpan: 1 },
          col4: { rowSpan: 1, colSpan: 1 },
        },
      },
      {
        key: 'row18',
        col0: '',
        col1: '',
        col2: '',
        col3: '国外',
        col4: rawData["按系统"]["系统外国外"], // 绑定rawData
        spans: {
          col0: { rowSpan: 0, colSpan: 0 },
          col1: { rowSpan: 0, colSpan: 0 },
          col2: { rowSpan: 0, colSpan: 1 },
          col3: { rowSpan: 1, colSpan: 1 },
          col4: { rowSpan: 1, colSpan: 1 },
        },
      },
      // 合同额（所有数值来自 rawData["合同额"]）
      {
        key: 'row19',
        col0: '合同额',
        col1: '合同额≥10亿元',
        col2: '',
        col3: rawData["合同额"]["合同额≥10亿元"], // 绑定rawData,
        col4: '',
        spans: {
          col0: { rowSpan: 4, colSpan: 1 }, // 固定跨7行
          col1: { rowSpan: 1, colSpan: 2 },
          col2: { rowSpan: 1, colSpan: 0 },
          col3: { rowSpan: 1, colSpan: 2 },
          col4: { rowSpan: 1, colSpan: 0 },
        },
      },
      {
        key: 'row20',
        col0: '',
        col1: '5亿元≤合同额＜10亿元',
        col2: '',
        col3: rawData["合同额"]["5亿元≤合同额＜10亿元"], // 绑定rawData
        col4: '',
        spans: {
          col0: { rowSpan: 0, colSpan: 1 },
          col1: { rowSpan: 1, colSpan: 2 },
          col2: { rowSpan: 1, colSpan: 0 },
          col3: { rowSpan: 1, colSpan: 2 },
          col4: { rowSpan: 1, colSpan: 0 },
        },
      },
      {
        key: 'row21',
        col0: '',
        col1: '1亿元≤合同额＜5亿元',
        col2: '',
        col4: '',
        col3: rawData["合同额"]["1亿元≤合同额＜5亿元"], // 绑定rawData
        spans: {
          col0: { rowSpan: 0, colSpan: 1 },
          col1: { rowSpan: 1, colSpan: 2 },
          col2: { rowSpan: 1, colSpan: 0 },
          col3: { rowSpan: 1, colSpan: 2 },
          col4: { rowSpan: 1, colSpan: 0 },
        },
      },
      {
        key: 'row22',
        col0: '',
        col1: '合同额＜1亿元',
        col2: '',
        col4: '',
        col3: rawData["合同额"]["合同额＜1亿元"], // 绑定rawData
        spans: {
          col0: { rowSpan: 0, colSpan: 1 },
          col1: { rowSpan: 1, colSpan: 2 },
          col2: { rowSpan: 1, colSpan: 0 },
          col3: { rowSpan: 1, colSpan: 2 },
          col4: { rowSpan: 1, colSpan: 0 },
        },
      },
    ];

    setDataSource(data)
  }

  // 5列配置
  const columns = [
    {
      title: '',
      dataIndex: 'col0',
      key: 'col0',
      width: 160,
      render: (text, record) => {
        const { rowSpan, colSpan } = record.spans.col0;
        return {
          children: text,
          props: {
            rowSpan,
            colSpan,
            style: {
              textAlign: 'center',
              fontWeight: 'bold',
              background: text === '在执行中项目' ? '#dcdcdc' : text ? '#f5f7fa' : 'transparent',
              border: '1px solid #e8e8e8',
              padding: '8px',
            },
          },
        };
      },
    },
    {
      title: '',
      dataIndex: 'col1',
      key: 'col1',
      width: 160,
      render: (text, record) => {
        const { rowSpan, colSpan } = record.spans.col1;
        // 判断是否为数值单元格（非空且可能为数字）
        const isNumberCell = text !== '' && text !== undefined;
        return {
          children: text,
          props: {
            rowSpan,
            colSpan,
            style: {
              textAlign: 'center',
              paddingLeft: '16px',
              border: '1px solid #e8e8e8',
              padding: '8px',
            },
            // 仅数值单元格绑定点击事件
            ...(isNumberCell && {
              onClick: () => {
                handleNumberClick({
                  category: record.col0 || '', // 大分类（如"按地域"）
                  subItem: record.col1 || record.col3 || '', // 子项名称
                  value: text,
                  record: record,
                });
              },
            }),
          },
        };
      },
    },
    {
      title: '',
      dataIndex: 'col2',
      key: 'col2',
      width: 160,
      render: (text, record) => {
        const { rowSpan, colSpan } = record.spans.col2;
        // 判断是否为数值单元格（非空且可能为数字）
        const isNumberCell = text !== '' && text !== undefined;
        return {
          children: text,
          props: {
            rowSpan,
            colSpan,
            style: {
              textAlign: 'center',
              border: '1px solid #e8e8e8',
            },
            // 仅数值单元格绑定点击事件
            ...(isNumberCell && {
              onClick: () => {
                handleNumberClick({
                  category: record.col0 || '', // 大分类（如"按地域"）
                  subItem: record.col1 || record.col3 || '', // 子项名称
                  value: text,
                  record: record,
                });
              },
            }),
          },
        };
      },
    },
    {
      title: '',
      dataIndex: 'col3',
      key: 'col3',
      width: 160,
      render: (text, record) => {
        const { rowSpan, colSpan } = record.spans.col3;
        // 判断是否为数值单元格（非空且可能为数字）
        const isNumberCell = text !== '' && text !== undefined;
        return {
          children: text,
          props: {
            rowSpan,
            colSpan,
            style: {
              textAlign: 'center',
              paddingLeft: '16px',
              border: '1px solid #e8e8e8',
              padding: '8px',
            },
            // 仅数值单元格绑定点击事件
            ...(isNumberCell && {
              onClick: () => {
                handleNumberClick({
                  category: record.col0 || '', // 大分类（如"按地域"）
                  subItem: record.col1 || record.col3 || '', // 子项名称
                  value: text,
                  record: record,
                });
              },
            }),
          },
        };
      },
    },
    {
      title: '',
      dataIndex: 'col4',
      key: 'col4',
      width: 160,
      render: (text, record) => {
        const { rowSpan, colSpan } = record.spans.col4;
        // 判断是否为数值单元格（非空且可能为数字）
        const isNumberCell = text !== '' && text !== undefined;
        return {
          children: text,
          props: {
            rowSpan,
            colSpan,
            style: {
              textAlign: 'center',
              paddingRight: '16px',
              border: '1px solid #e8e8e8',
              padding: '8px',
            },
            // 仅数值单元格绑定点击事件
            ...(isNumberCell && {
              onClick: () => {
                handleNumberClick({
                  category: record.col0 || '', // 大分类（如"按地域"）
                  subItem: record.col1 || record.col3 || '', // 子项名称
                  value: text,
                  record: record,
                });
              },
            }),
          },
        };
      },
    },
  ];


  // 点击数值单元格的处理函数
  const handleNumberClick = (info: {
    category: string; // 大分类（如"按专业"、"按地域"）
    subItem: string;  // 子项名称（如"油气储运工程"、"国内系统内"）
    value: any;       // 数值
    record: any;      // 整行数据
  }) => {
    console.log('点击了数值单元格：', info);
    // 这里可以添加你的业务逻辑，比如跳转详情、弹窗等
  };

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ y: 'calc(100vh - 150px)'}}
        bordered={false}
        size="middle"
      />
    </div>
  )
}
export default connect()(KeyProjectListPage);
