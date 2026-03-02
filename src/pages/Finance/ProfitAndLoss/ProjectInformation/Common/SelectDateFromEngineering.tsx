import React, { useEffect } from 'react';
import {Alert, Button, Form, Input, message, Modal, Table } from 'antd';
import FormItemIsDatePicker from "@/pages/Engineering/Week/WeeklyReport/FormItem/FormItemIsDatePicker";
import {queryProjectInformationMonthlyDetails} from "@/services/finance/projectInformation";

const SelectDateFromEngineering = (props: any) => {
  const { title, form, onChange, dataIndex } = props;

  const contractNo = Form.useWatch('contract_no', form);

  // 项目定义对应查询出的合同数量 有一对多的情况
  const [leftValue, setLeftValue] = React.useState('');
  const [visible, setVisible] = React.useState(false);

  const [dataSource, setDataSource] = React.useState([]);

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
    if(visible && contractNo) {
      fetchList()
    }
  }, [contractNo, dataIndex, visible]);

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
      title: '项目状态时间',
      dataIndex: 'project_status_date',
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
    },
    {
      title: '操作',
      dataIndex: 'operate',
      align: 'center',
      width: 100,
      valueType: 'number',
      render: (text, record) => (
        <a onClick={() => {
          setLeftValue(record.project_status_date)
          onChange(record.project_status_date);
          setVisible(false);
        }}>选择</a>
      )
    }
  ]

  return (
    <>
      <Input.Group compact style={{width:'100%'}}>
        <div style={{ width: 'calc(100% - 88px)' }}>
          <FormItemIsDatePicker needValue={'date'} value={leftValue} onChange={(_value: string) => {
            setLeftValue(_value)
            onChange(_value);
          }}/>
        </div>
        <Button style={{width: 88}} type="primary" onClick={() => {
          if(!contractNo) {
            message.warning('请先选择一份合同');
            return;
          }
          setVisible(true);
        }}>点击获取</Button>
      </Input.Group>
      {visible && (
        <Modal
          width={'80%'}
          title={'每月工程进度情况'}
          visible={visible}
          open={visible}
          onCancel={() => setVisible(false)}
          footer={null}
        >
          <Alert type={'info'} message={'从下方合同中选择 ' + title + '如果没有数据，则需要用户手动选择'}/>
          <div style={{marginTop: 8, overflowY: 'scroll', height: 'calc(100vh - 120px)'}}>
            <Table
              bordered
              size='small'
              columns={columns}
              dataSource={dataSource}
            />
          </div>
        </Modal>
      )}
    </>
  )
}

export default SelectDateFromEngineering;
