import React, {useRef, useState } from 'react';
import {Button, Col, Empty, Modal, Row, Tree } from 'antd';
import moment from 'moment';
import {BasicTaskForm, BasicFormColumns} from "yayang-ui";
import { useIntl } from 'umi';

const AddModal = (props: any) => {
  const { visible, onCancel } = props;
  const formRef: any = useRef()
  // 获取去年的年份
  const lastYear = moment().subtract(1, 'years').year();
  const currentYear = moment().year();
  const currMonth = moment().format('YYYY-MM');
  const treeData: any[] = [lastYear, currentYear].map(item => ({
    title: item,
    key: item,
    children: [
      {
        title: `${item}-Q1`,
        key: `${item}-Q1`,
        children: [
          {title: `${item}-01`, key: `${item}-01`,},
          {title: `${item}-02`, key: `${item}-02`,},
          {title: `${item}-03`, key: `${item}-03`,},
        ],
      },
      {
        title: `${item}-Q2`,
        key: `${item}-Q2`,
        children: [
          {title: `${item}-04`, key: `${item}-04`,},
          {title: `${item}-05`, key: `${item}-05`,},
          {title: `${item}-06`, key: `${item}-06`,},
        ],
      },
      {
        title: `${item}-Q3`,
        key: `${item}-Q3`,
        children: [
          {title: `${item}-07`, key: `${item}-07`,},
          {title: `${item}-08`, key: `${item}-08`,},
          {title: `${item}-09`, key: `${item}-09`,},
        ],
      },
      {
        title: `${item}-Q4`,
        key: `${item}-Q4`,
        children: [
          {title: `${item}-10`, key: `${item}-10`,},
          {title: `${item}-11`, key: `${item}-11`,},
          {title: `${item}-12`, key: `${item}-12`,},
        ],
      },
    ],
  }))
  const { formatMessage } = useIntl();
  const [selectedKeys, setSelectedKeys] = useState<any>([currMonth]);

  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    setSelectedKeys(selectedKeys);
  };

  const columns = [
    { align: 'center', width: 160,  dataIndex: '1', title: '一、营业总收入', sort_order: 1 },
    { align: 'center', width: 160,  dataIndex: '1-1', title: '其中：集团公司外部收入', sort_order: 10 },
    { align: 'center', width: 160,  dataIndex: '1-2', title: '集团内部与中油工程外部收入', sort_order: 20 },
    { align: 'center', width: 160,  dataIndex: '1-3', title: '中油工程内部与工程建设公司外部收入', sort_order: 30 },
    { align: 'center', width: 160,  dataIndex: '1-4', title: '工程建设公司内部单位间关联交易收入', sort_order: 40 },
    { align: 'center', width: 160,  dataIndex: '2', title: '二、营业总成本', sort_order: 50 },
    { align: 'center', width: 160,  dataIndex: '2-1', title: '其中：营业成本、税金及附加', sort_order: 60, },
    { align: 'center', width: 160,  dataIndex: '2-2', title: '管理费用', sort_order: 70 },
    { align: 'center', width: 160,  dataIndex: '2-3', title: '财务费用', sort_order: 80 },
    { align: 'center', width: 160,  dataIndex: '2-4', title: '其中：利息收支净额（收入减支出）', sort_order: 90 },
    { align: 'center', width: 160,  dataIndex: '2-5', title: '汇兑净收益（收益减损失）', sort_order: 100 },
    { align: 'center', width: 160,  dataIndex: '3', title: '三、加  投资收益', sort_order: 120 },
    { align: 'center', width: 160,  dataIndex: '3-1', title: '加  资产处置收益', sort_order: 130 },
    { align: 'center', width: 160,  dataIndex: '3-2', title: '加  其他收益', sort_order: 140 },
    { align: 'center', width: 160,  dataIndex: '3-3', title: '加  营业外收入', sort_order: 150 },
    { align: 'center', width: 160,  dataIndex: '3-4', title: '减  营业外支出', sort_order: 160 },
    { align: 'center', width: 160,  dataIndex: '3-5', title: '加  资产减值损失及信用减值损失', sort_order: 170 },
    { align: 'center', width: 160,  dataIndex: '4', title: '四、利润总额', sort_order: 180 },
    { align: 'center', width: 160,  dataIndex: '5', title: '五、所得税费用', sort_order: 190 },
    { align: 'center', width: 160,  dataIndex: '6', title: '六、净利润', sort_order: 200 },
  ]

  const initObj = {};

  columns.forEach(item => {
    initObj[item.dataIndex] = 0
  })


  const getFormColumns = () => {
    const cols = new BasicFormColumns(columns)
      .initFormColumns(columns.map(c => c.dataIndex))
      .setSplitGroupFormColumns([
        {title: '一.', columns: [
            "1",
            "1-1",
            "1-2",
            "1-3",
            "1-4",
          ], order: 2},
        {title: '二.', columns: [
            "2",
            "2-1",
            "2-2",
            "2-3",
            "2-4",
            "2-5",
          ], order: 3},
        {title: '三.', columns: [
            "3",
            "3-1",
            "3-2",
            "3-3",
            "3-4",
            "3-5",
          ], order: 4},
        {title: '四.', columns: [
            "4",

          ], order: 5},
        {title: '五.', columns: [
            "5",
          ], order: 6},
        {title: '六.', columns: [
            "6",
          ], order: 7},
      ])
      .setFormColumnToInputNumber(columns.map(c => ({value: c.dataIndex, valueType: 'digit', min: 0})))
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <Modal
      title={(
        <Row justify='space-between'>
          <Col>
            <strong style={{fontSize: 18}}>完善期间费用等</strong>
          </Col>
          <Col>
            <Button type={'primary'} onClick={async () => {
              const values = await formRef.current.validateFields();
              console.log('----values', values);
              // const res = await updateResourceOngoingProjectB1Extra({
              //
              //   options: JSON.stringify(arr),
              // })
              // if (res.errCode === 0) {
              //   message.success('更新成功');
              //   callbackSuccess()
              // }
            }}>
              保存
            </Button>
          </Col>
        </Row>
      )}
      open={visible}
      visible={visible}
      onCancel={onCancel}
      width={'100vw'}
      footer={null}
      style={{
        top: 0,
        maxWidth: '100vw',
        paddingBottom: 0,
        maxHeight: '100vh',
        overflow: 'hidden',
      }}
      bodyStyle={{
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      <Row>
        <Col span={4}>
          <strong style={{ fontSize: 18 }}>债权填报</strong>
          {treeData.length > 0 ? (
            <Tree
              style={{ marginTop: 8 }}
              selectedKeys={selectedKeys}
              defaultExpandedKeys={[currentYear, currentYear + '-Q1']}
              onSelect={onSelect}
              treeData={treeData}
            />
          ) : (
            <Empty />
          )}
        </Col>
        <Col span={20}>
          <div style={{height: 'calc(100vh - 100px)', overflowY: 'scroll'}}>
            <BasicTaskForm
              cRef={formRef}
              labelCol={{span: 24}}
              layout={'vertical'}
              formColumns={getFormColumns()}
              footerBarRender={() => []}
              initialValue={initObj}
            />
          </div>
        </Col>
      </Row>
    </Modal>
  )
}

export default AddModal;
