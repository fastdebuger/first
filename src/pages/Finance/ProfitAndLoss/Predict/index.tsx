import {Alert, Button, Col, DatePicker, Input, message, Modal, Row, Space, Table, Tag } from 'antd';
import React, {useEffect, useState } from 'react';
import PredictItem from "@/pages/Finance/ProfitAndLoss/Predict/PredictItem";
import AddInputNumber from "@/pages/Engineering/Week/WeeklyReport/Common/AddInputNumber";
import AddInput from "@/pages/Engineering/Week/WeeklyReport/Common/AddInput";
import moment from 'moment';
import {queryPredictReportItems, updatePredictReportItems} from "@/services/finance/predictReportItems";
import {connect} from "umi";


const Predict = (props) => {
  const { dispatch } = props;

  const depCode = localStorage.getItem('auth-default-wbsCode') || '';

  const currYear = moment().year();
  const [loading, setLoading] = useState(false);
  const [currDate, setCurrDate] = React.useState<any>(moment());
  const [year, setYear] = React.useState<any>(currYear);
  const [version, setVersion] = React.useState<any>(0);
  const [reasonVisible, setReasonVisible] = React.useState(false);
  const [inputReason, setInputReason] = React.useState<any>('');
  const [commitLoading, setCommitLoading] = React.useState(false);


  const initialArr = [
    { year: year, item_key: '1', item_name: '一、营业总收入', sort_order: 1 },
    { year: year, item_key: '1-1', item_name: '其中：集团公司外部收入', sort_order: 10 },
    { year: year, item_key: '1-2', item_name: '集团内部与中油工程外部收入', sort_order: 20 },
    { year: year, item_key: '1-3', item_name: '中油工程内部与工程建设公司外部收入', sort_order: 30 },
    { year: year, item_key: '1-4', item_name: '工程建设公司内部单位间关联交易收入', sort_order: 40 },
    { year: year, item_key: '2', item_name: '二、营业总成本', sort_order: 50 },
    { year: year, item_key: '2-1', item_name: '其中：营业成本、税金及附加', sort_order: 60, },
    { year: year, item_key: '2-2', item_name: '管理费用', sort_order: 70 },
    { year: year, item_key: '2-3', item_name: '财务费用', sort_order: 80 },
    { year: year, item_key: '2-4', item_name: '其中：利息收支净额（收入减支出）', sort_order: 90 },
    { year: year, item_key: '2-5', item_name: '汇兑净收益（收益减损失）', sort_order: 100 },
    { year: year, item_key: '3', item_name: '三、加  投资收益', sort_order: 120 },
    { year: year, item_key: '3-1', item_name: '加  资产处置收益', sort_order: 130 },
    { year: year, item_key: '3-2', item_name: '加  其他收益', sort_order: 140 },
    { year: year, item_key: '3-3', item_name: '加  营业外收入', sort_order: 150 },
    { year: year, item_key: '3-4', item_name: '减  营业外支出', sort_order: 160 },
    { year: year, item_key: '3-5', item_name: '加  资产减值损失及信用减值损失', sort_order: 170 },
    { year: year, item_key: '4', item_name: '四、利润总额', sort_order: 180 },
    { year: year, item_key: '5', item_name: '五、所得税费用', sort_order: 190 },
    { year: year, item_key: '6', item_name: '六、净利润', sort_order: 200 },
  ]

  // 表格内数据
  const [dataSource, setDataSource] = useState([])

  const fetchList = async () => {
    const res = await queryPredictReportItems({
      sort: 'sort_order',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'year', Val: year, Operator: '='},
        {Key: 'dep_code', Val: depCode, Operator: '='},
      ])
    })
    if (res.rows.length > 0) {
      const data = [];
      res.rows.forEach((item) => {
        const _item = new PredictItem(item.year, item.item_key, item.item_name, item.sort_order);
        Object.assign(_item, {
          q1_month1: item.q1_month1,
          q1_month2: item.q1_month2,
          q1_month3: item.q1_month3,
          q1_subtotal: item.q1_subtotal,
          q2_month1: item.q2_month1,
          q2_month2: item.q2_month2,
          q2_month3: item.q2_month3,
          q2_subtotal: item.q2_subtotal,
          q3_month1: item.q3_month1,
          q3_month2: item.q3_month2,
          q3_month3: item.q3_month3,
          q3_subtotal: item.q3_subtotal,
          q4_month1: item.q4_month1,
          q4_month2: item.q4_month2,
          q4_month3: item.q4_month3,
          q4_subtotal: item.q4_subtotal,
          full_year_amount: item.full_year_amount,
          indicator_amount: item.indicator_amount,
          remark: item.remark,
        })
        data.push(_item);
      })
      setVersion(res.rows[0].version)
      setDataSource(data)
    } else {
      const data = () => {
        return initialArr.map(p => new PredictItem(p.year, p.item_key, p.item_name, p.sort_order));
      };
      setDataSource(data);
    }
  }

  useEffect(() => {
    fetchList()
  }, [year]);

  /**
   * 是否允许编辑
   * @param col
   */
  const isAllowEdit = (col: any) => {
    // return true;

    const currMonthStr = Number(moment().format('MM')) + '月份';
    const currDay = Number(moment().format('DD'))
    const title = col.title;
    const dataIndex = col.dataIndex;
    if (dataIndex === 'indicator_amount') {
      return true;
    }
    if (dataIndex === 'remark') {
      return true;
    }
    if (currMonthStr === title) {
      // 是当前月的操作，还要判断是否大于28号，大于28好也不能修改
      if (currDay >= 28) {
        return false;
      }
      return true;
    }
    return false;
  }

  const columns = [
    { title: '项目', dataIndex: 'item_name', align: 'left', width: 330, fixed: 'left' },
    { title: '1月份', dataIndex: 'q1_month1', align: 'right', width: 180, valueType: 'number' },
    { title: '2月份', dataIndex: 'q1_month2', align: 'right', width: 180, valueType: 'number' },
    { title: '3月份', dataIndex: 'q1_month3', align: 'right', width: 180, valueType: 'number' },
    { title: '小计',  dataIndex: 'q1_subtotal', align: 'right', width: 180, valueType: 'jisuan' },
    { title: '4月份', dataIndex: 'q2_month1', align: 'right', width: 180, valueType: 'number' },
    { title: '5月份', dataIndex: 'q2_month2', align: 'right', width: 180, valueType: 'number' },
    { title: '6月份', dataIndex: 'q2_month3', align: 'right', width: 180, valueType: 'number' },
    { title: '小计', dataIndex:  'q2_subtotal', align: 'right', width: 180, valueType: 'jisuan' },
    { title: '7月份', dataIndex: 'q3_month1', align: 'right', width: 180, valueType: 'number' },
    { title: '8月份', dataIndex: 'q3_month2', align: 'right', width: 180, valueType: 'number' },
    { title: '9月份', dataIndex: 'q3_month3', align: 'right', width: 180, valueType: 'number' },
    { title: '小计', dataIndex:  'q3_subtotal', align: 'right', width: 180, valueType: 'jisuan' },
    { title: '10月份', dataIndex: 'q4_month1', align: 'right', width: 180, valueType: 'number' },
    { title: '11月份', dataIndex: 'q4_month2', align: 'right', width: 180, valueType: 'number' },
    { title: '12月份', dataIndex: 'q4_month3', align: 'right', width: 180, valueType: 'number' },
    { title: '小计', dataIndex:   'q4_subtotal', align: 'right', width: 180, valueType: 'jisuan' },
    { title: '全年预测', dataIndex: 'full_year_amount', align: 'right', width: 180, valueType: 'jisuan' },
    { title: '指标数', dataIndex: 'indicator_amount', align: 'right', width: 180, valueType: 'number' },
    { title: '备注', dataIndex: 'remark', align: 'right', width: 200, valueType: 'string' },
  ]

  /**
   * 通过数值的变化，中方人员，外方人员的变化
   * 1，给当前属性赋值
   * 2，调用 PersonnelItem 类里的更新小计的方法，更新小计的值
   * 3，setDataSource([...dataSource]) 时 小计根据 {record.getField(item.dataIndex)} 获取最新的值展示
   * @param value
   * @param record
   * @param item
   */
  const onChange = (value: number | null, record: any, item: any) => {
    const _value = value || 0;
    record.updateField(item.dataIndex, _value);
    setDataSource([...dataSource]);
  }

  /**
   * 通过数值的变化，对应的单位，租赁公司 和 备注发生变化
   * 1，给当前属性赋值
   * 2，调用 PersonnelItem 类里的更新小计的方法，更新小计的值
   * 3，setDataSource([...dataSource]) 时 小计根据 {record.getField(item.dataIndex)} 获取最新的值展示
   * @param value
   * @param record
   * @param item
   */
  const onChangeInput = (value: string | null, record: any, item: any) => {
    const _value = value || '';
    record.updateField(item.dataIndex, _value);
    setDataSource([...dataSource]);
  }

  /**
   * 获取配置列
   * 根据 columns里的 valueType 渲染不同的组件展示
   */
  const getColumns = () => {
    const getCols = (arr: any[]) => {
      arr.forEach((item) => {
        //  小计的写法 一定要写成这样的，要不然虽然底层数据变化了，但是页面没变化
        if (item.valueType === 'jisuan') {
          Object.assign(item, {
            render: (_: any, record: PredictItem) => (
              <strong>{record.getField(item.dataIndex)}</strong>
            )
          })
        }
        // 不允许编辑 直接返回值
        if (!isAllowEdit(item)) {
          Object.assign(item, {
            render: (text: string, record: any) => {
              return text;
            }
          })
          return;
        }
        // 数值类型的展示
        if (item.valueType === 'number') {
          Object.assign(item, {
            render: (text: string, record: any) => {
              return (
                <AddInputNumber
                  value={Number(text || 0)}
                  onChange={(_value) => onChange(_value, record, item)}
                />
              )
            }
          })
        }
        // 数值类型的展示
        if (item.valueType === 'string') {
          Object.assign(item, {
            render: (text: string, record: any) => {
              return (
                <AddInput
                  value={text || ''}
                  onChange={(e) => onChangeInput(e.target.value, record, item)}
                />
              )
            }
          })
        }
      })
    }
    getCols(columns)
    return columns;
  }

  /**
   * 导出的列过滤 和 列配置
   * 因为导出需要的格式是：DataIndex, Title的格式 需要转换一下
   * @param columns
   */
  const getFilterExportColumns = (columns: any[]) => {
    const arr: any[] = [];
    columns.forEach((column) => {
      if (column.export) {
        const obj = {
          DataIndex: column.dataIndex,
          Title: column.title,
        };
        arr.push(obj);
      }
    });
    return arr;
  };

  const exportFile = () => {
    setLoading(true);
    const exCols = getFilterExportColumns(columns);
    dispatch({
      type: 'predictReportItems/queryPredictReportItems',
      payload: {
        op:'xlsx',
        exType: '1',
        moduleCaption: '损益预测表',
        exColBasis: JSON.stringify(exCols),
        sort: 'sort_order',
        order: 'asc',
        filter: JSON.stringify([
          {Key: 'year', Val: year, Operator: '='},
          {Key: 'dep_code', Val: depCode, Operator: '='},
        ])
      },
      callback: (response: any) => {
        setLoading(false);
        if (response && response.result && response.result.fileUrl) {
          window.open(response.result.fileUrl, '_blank');
        } else if (response && response.fileUrl) {
          window.open(response.fileUrl, '_blank');
        } else {
          message.error('生成导出文件有误，请稍后再试');
        }
      },
    });
  };

  return (
    <div style={{padding: 8}}>
      <Row justify={'space-between'}>
        <Col>
          <strong style={{fontSize: 18}}>月度及全年损益预测表</strong>
          {version && (
            <Tag style={{marginLeft: 4}} color={'blue'}>
              第{version}版
            </Tag>
          )}
        </Col>
        <Col>
          <Space>
            <span>金额单位:元</span>
            <Button type="primary" loading={loading} onClick={() => {
              exportFile();
            }}>
              导出
            </Button>
          </Space>
        </Col>
      </Row>
      <Row justify={'space-between'} style={{marginTop: 4}}>
        <Col>
          <Space align={'baseline'}>
            <DatePicker picker={'year'} value={currDate} onChange={(date, dateString) => {
              setCurrDate(date);
              if(date) {
                setYear(date.format('YYYY'));
              }
            }}/>
            <Alert style={{marginTop: 8}} type={'warning'} message={'1,只能填报当前月的数据，每月28号之前填报，过期无法操作, 2，内容填写后 请点击右侧的：'}
                   action={
                     <Button size="small" type="primary" onClick={() => {
                       setReasonVisible(true)
                     }}>保存填报信息</Button>
                   }
            />
          </Space>
        </Col>
      </Row>

      <Table
        style={{marginTop: 8}}
        size={'small'}
        bordered
        columns={getColumns()}
        scroll={{ x: '100%', y: 'calc(100vh - 310px)' }}
        dataSource={dataSource}
        pagination={false}
        footer={() => (
          <div style={{fontSize: 12}}>
            <div>注：1、本表作为各单位月度绩效考核表，表中的数字每个月都需经本单位主管领导审核</div>
            <div style={{color: '#f40'}}>2、实际月份按实际发生数填报，尚未发生月份填报预测数</div>
            <div>3、“全年预测”数要根据本年工程实际情况进行预测，不得简单填报指标数</div>
          </div>
        )}
      />
      {reasonVisible && (
        <Modal
          title="填报信息"
          open={reasonVisible}
          visible={reasonVisible}
          okText={'提交'}
          footer={(
            <Space>
              <Button onClick={() => setReasonVisible(false)}>
                我再想想
              </Button>
              <Button type="primary" loading={commitLoading} onClick={async () => {
                if(!inputReason) {
                  message.warn("必须输入具体的信息, 才能提交");
                  return;
                }
                setCommitLoading(true);
                const res = await updatePredictReportItems({
                  year: year,
                  options: JSON.stringify(dataSource),
                  reason: inputReason || '',
                })
                setCommitLoading(false);
                if (res.errCode === 0) {
                  message.success('更新成功');
                  fetchList();
                  setReasonVisible(false);
                }
              }}>
                提交
              </Button>
            </Space>
          )}
          onCancel={() => {
            setReasonVisible(false)
            setInputReason('')
          }}
        >
          <div>
            <Alert type={'warning'} message={'必须输入填报/修改信息, 如果是第一次填报 可输入：第一次填报'}/>
            <Input.TextArea style={{marginTop: 8}} rows={3} value={inputReason} onChange={(e) => {
              setInputReason(e.target.value);
            }} />
          </div>
        </Modal>
      )}
    </div>
  )
}

export default connect()(Predict)
