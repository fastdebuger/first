import { queryProjectInformationMonthlyDetails } from '@/services/finance/projectInformation';
import { Drawer, Table } from 'antd';
import React, { useEffect, useState } from 'react';

interface IEveryMonthlyRecordProps {
  contractNo: string;
}

const EveryMonthlyRecord = (props: IEveryMonthlyRecordProps) => {
  const { contractNo } = props;
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const fetchList = async () => {
    const res = await queryProjectInformationMonthlyDetails({
      contract_no: contractNo,
      sort: 'belong_month',
      order: 'desc'
    })
    // setDataSource(res)
    console.log('-------res', res);
    setDataSource(res.rows || []);
  }

  useEffect(() => {
    if (visible) {
      fetchList();
    }
  }, [visible])

  const columns = [
    {
      title: '月份',
      dataIndex: 'belong_month',
      align: 'center',
      width: 100,
      valueType: 'number',
    },
    {
      title: '项目状态',
      dataIndex: 'project_status_str',
      align: 'center',
      width: 100,
      valueType: 'number',
    },
    {
      title: '结算状态',
      dataIndex: 'settlement_status_str',
      align: 'center',
      width: 100,
      valueType: 'number',
    },
    {
      title: '计划（%）',
      dataIndex: 'curr_month_plan',
      align: 'center',
      width: 100,
      valueType: 'number',
    },
    {
      title: '实际（%）',
      dataIndex: 'curr_month_reality',
      align: 'center',
      width: 100,
      valueType: 'number',
    },
    {
      title: '差值',
      dataIndex: 'curr_month_difference',
      align: 'center',
      width: 100,
      valueType: 'cha',
    },
    {
      title: '本月计划产值（万元）',
      dataIndex: 'curr_month_plan_output',
      align: 'center',
      width: 100,
      valueType: 'number',
    },
    {
      title: '本月实际完成产值（万元）',
      dataIndex: 'curr_month_reality_output',
      align: 'center',
      width: 100,
      valueType: 'number',
    }
  ]

  return (
    <>
      <a onClick={() => setVisible(true)}>查看每月数据</a>
      {visible && (
        <Drawer 
          title="每月工程进度情况" 
          placement="right"
          width={'80%'}
          onClose={() => setVisible(false)} 
          open={visible}
          visible={visible}
        >
          <Table
            bordered
            size='small'
            columns={columns}
            dataSource={dataSource}
          />
        </Drawer>
      )}
    </>
  )
}

export default EveryMonthlyRecord;