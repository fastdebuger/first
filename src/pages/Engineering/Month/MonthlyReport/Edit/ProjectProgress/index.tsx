import {useEffect, useImperativeHandle, useRef, useState } from 'react';
import { columns } from './ProjectProgressColumns';
import {Alert, Button, Col, Form, Input, message, Modal, Popconfirm, Row, Space, Table,
  Tabs, Typography } from 'antd';
import MainIssues from "../../Common/MainIssues";
import ImgProgress from "../../Common/ImgProgress";
import AddInputNumber from "@/pages/Engineering/Month/MonthlyReport/Common/AddInputNumber";
import ProjectProgressItem from "@/pages/Engineering/Month/MonthlyReport/Common/ProjectProgressItem";
import moment from 'moment';
import LastDataModalItem from "@/pages/Engineering/Month/MonthlyReport/Add/ProjectProgress/LastDataModalitem";
const { Text } = Typography;


const ProjectProgress = (props: any) => {
  const { cRef, lastMonthRecord, selectedRecord, defaultRecord } = props;
  const [form] = Form.useForm();
  const mainIssuesRef: any = useRef();
  const imgProgressRef: any = useRef();
  // 合同含税额
  const contractSayPrice = Number(selectedRecord.contract_say_price || 0);
  // 下个月的月份数字（1-12，不补零）
  const nextMonthNumber = moment().add(1, 'month').format('M')
  const [lastVisible, setLastVisible] = useState(false);
  // 表格内数据
  const [dataSource, setDataSource] = useState(() => {
    return ['设计', '采购', '施工', '试运'].map(type => new ProjectProgressItem(type));
  })
  const [addVisible, setAddVisible] = useState(false);
  const [inputVal, setInputVal] = useState('');


  useEffect(() => {
    if (lastMonthRecord && lastMonthRecord.MonthlyProProgress) {
      form.setFieldsValue({
        delay_reasons: lastMonthRecord.MonthlyProProgress.delay_reasons,
        schedule_desc: lastMonthRecord.MonthlyProProgress.schedule_desc,
        work_plan: lastMonthRecord.MonthlyProProgress.work_plan,
        completion_status: lastMonthRecord.MonthlyProProgress.completion_status,
        curr_month_progress: lastMonthRecord.MonthlyProProgress.curr_month_progress,
        next_month_plan_desc: lastMonthRecord.MonthlyProProgress.next_month_plan_desc,
      });

      // dataSource
      if (lastMonthRecord.MonthlyProProgress.monthlyEngineeringPhaseList && lastMonthRecord.MonthlyProProgress.monthlyEngineeringPhaseList.length > 0) {

        const _arr: string[] = lastMonthRecord.MonthlyProProgress.monthlyEngineeringPhaseList.map(item => item.phase);
        const _dataSource = _arr.reverse().map(type => new ProjectProgressItem(type));
        _dataSource.forEach(item => {
          const findObj = lastMonthRecord.MonthlyProProgress.monthlyEngineeringPhaseList.find(r => r.phase === item.phase)
          if (findObj) {
            Object.assign(item, {
              ...findObj,
              ...{
                last_cumulative_reality: findObj.cumulative_reality, // 存储上个月的自开工累计
              }
            });
          }
          if (defaultRecord && defaultRecord.MonthlyProProgress && defaultRecord.MonthlyProProgress.monthlyEngineeringPhaseList && defaultRecord.MonthlyProProgress.monthlyEngineeringPhaseList.length > 0) {
            const findObj2 = defaultRecord.MonthlyProProgress.monthlyEngineeringPhaseList.find(r => r.phase === item.phase);
            if (findObj2) {
              Object.assign(item, {
                last_month_plan: findObj2.curr_month_plan,
                last_month_reality: findObj2.curr_month_reality,
              });
            }
          }
        })
        setDataSource([..._dataSource]);
      }
    }
  }, [lastMonthRecord]);

  /**
   * 通过此方法
   * 暴漏给父组件 可操作的函数
   */
  useImperativeHandle(cRef, () => {
    return {
      getData: async () => {
        try {
          const values = await form.validateFields();
          const mainIssuesData = mainIssuesRef.current.getData();
          const imgProgressData = await imgProgressRef.current.getData();
          return {
            ...values,
            monthlyEngineeringPhaseList: dataSource,
            monthlyMainIssuesList: mainIssuesData,
            monthlyProImgProgressList: imgProgressData,
          }
        } catch (err) {
          Modal.error({
            title: '项目进度有必填项未填写',
            // content: JSON.stringify(err),
          });
        }
      }
    };
  });

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
    record.updateField(item.dataIndex, _value, contractSayPrice);
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
        if (item.valueType === 'cha') {
          Object.assign(item, {
            render: (_: any, record: ProjectProgressItem) => (
              <Text>{record.getField(item.dataIndex)}</Text>
            )
          })
        }
        // 数值类型的展示
        if (item.valueType === 'number') {
          //  权重特殊处理
          if(item.dataIndex === 'weight') {
            Object.assign(item, {
              render: (text: string, record: any) => {
                return (
                  <AddInputNumber
                    disabled={true}
                    value={Number(text || 0)}
                    max={100}
                    onChange={(_value) => onChange(_value, record, item)}
                  />
                )
              }
            })
          } else if(item.dataIndex === 'curr_month_plan_output') {
            // 去掉最大值100限制
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
          } else {
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
        }
        if (['next_month_plan', 'next_month_output'].includes(item.dataIndex)) {
          Object.assign(item, {
            title: item.title.replace('（）', `（${nextMonthNumber}）`)
          })
        }
        if (item.children && item.children.length > 0) {
          getCols(item.children);
        }
      })
    }
    getCols(columns)
    return columns;
  }

  const calculateGrandTotal = () => {
    const total = {
      total1: 0,
      total2: 0,
      total3: 0,
      total4: 0,
      total5: 0,
      total6: 0,
      total7: 0,
      total8: 0,
      total9: 0,
    }

    dataSource.forEach(item => {
      total.total1 += item.getField('weight');
      total.total2 += (item.getField('curr_month_plan') * (item.getField('weight') / 100));
      total.total3 += (item.getField('curr_month_reality') * (item.getField('weight') / 100));
      total.total4 += (item.getField('curr_month_difference') * (item.getField('weight') / 100));
      total.total5 += (item.getField('curr_month_plan_output') * (item.getField('weight') / 100));
      total.total6 += (item.getField('curr_month_reality_output') * (item.getField('weight') / 100));
      total.total7 += (item.getField('next_month_plan') * (item.getField('weight') / 100));
      total.total8 += (item.getField('cumulative_plan') * (item.getField('weight') / 100));
      total.total9 += (item.getField('next_month_output') * (item.getField('weight') / 100));
    })
    return total;
  }

  // @ts-ignore
  return (
    <>
      <Space>
        <Button type="primary" onClick={() => {
          setAddVisible(true);
        }}>
          新增
        </Button>
        <Button type="primary" onClick={() => {
          setLastVisible(true);
        }}>
          查看上月数据
        </Button>
      </Space>
      <Alert style={{marginTop: 16}} type={'info'} message={'1.本月计划产值（万元）:从上一期报表中取得, 2.本月实际完成产值（万元）: 本月累计实际百分比减去上月累计实际百分比乘以合同额, 3.下月计划产值（万元）:计划百分比乘以合同额'}/>
      <Table
        style={{marginTop: 16}}
        size="small"
        bordered
        scroll={{x: 1000}}
        dataSource={dataSource}
        columns={[
          // @ts-ignore
          ...getColumns(),
          {
            title: '操作',
            dataIndex: 'operate',
            // @ts-ignore
            align: 'center',
            width: 80,
            render: (_: any, record: any, item: any) => {
              if(record.hasNewField) {
                return (
                  <>
                    <Popconfirm title="确定删除?" onConfirm={() => {
                      const filterArr = dataSource.filter(item => {
                        return item.phase !== record.phase;
                      })
                      setDataSource(filterArr);
                    }}>
                      <a style={{color: '#f40'}}>删除</a>
                    </Popconfirm>
                  </>
                )
              }
              return null;
            }
          }
        ]}
        pagination={false}
        summary={pageData => {
          const grandTotal = calculateGrandTotal();
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} align="center">总计</Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="center"><Text>{grandTotal.total1}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="center"><Text>{grandTotal.total2.toFixed(2)}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="center"><Text>{grandTotal.total3.toFixed(2)}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="center"><Text>{grandTotal.total4.toFixed(2)}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={5} align="center"><Text>{grandTotal.total5.toFixed(2)}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={6} align="center"><Text>{grandTotal.total6.toFixed(2)}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={7} align="center"><Text>{grandTotal.total7.toFixed(2)}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={8} align="center"><Text>{grandTotal.total8.toFixed(2)}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={9} align="center"><Text>{grandTotal.total9.toFixed(2)}</Text></Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
      <Form
        style={{marginTop: 16}}
        name="projectProgress"
        form={form}
        layout={'vertical'}
        initialValues={{}}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="滞后原因（本月差值小于0必须填写）"
              name="delay_reasons"
              rules={[{ required: calculateGrandTotal().total4 < 0, message: '请输入' }]}
            >
              <Input.TextArea  placeholder={'请输入'} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="项目进度描述"
              name="schedule_desc"
            >
              <Input.TextArea  placeholder={'请输入'} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="简述当前累计完成的主要工作，关键节点完成情况及下月计划"
              name="work_plan"
              rules={[{ required: true, message: '必填项' }]}
            >
              <Input.TextArea  placeholder={'请输入'} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="简述本月关键节点、重点施工工序完成情况"
              name="completion_status"
              rules={[{ required: true, message: '必填项' }]}
            >
              <Input.TextArea  placeholder={'请输入'} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="本月完成形象进度描述"
              name="curr_month_progress"
              rules={[{ required: true, message: '必填项' }]}
            >
              <Input.TextArea  placeholder={'请输入'} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="下月计划安排形象进度描述"
              name="next_month_plan_desc"
              rules={[{ required: true, message: '必填项' }]}
            >
              <Input.TextArea  placeholder={'请输入'} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Alert type={'warning'} message={'当前存在的主要问题、风险和原因分析'}/>
            <MainIssues cRef={mainIssuesRef} lastMonthRecord={lastMonthRecord}/>
          </Col>
          <Col span={24}>
            <Alert type={'warning'} message={'增加项目形象进展'}/>
            <ImgProgress cRef={imgProgressRef} lastMonthRecord={lastMonthRecord}/>
          </Col>
        </Row>
      </Form>
      {lastVisible && (
        <Modal
          title="上月工程阶段数据"
          width={'80%'}
          open={lastVisible}
          onCancel={() => setLastVisible(false)}
          footer={null}
        >
          <LastDataModalItem lastMonthRecord={defaultRecord} />
        </Modal>
      )}
      {addVisible && (
        <Modal
          title="新增工程阶段"
          open={addVisible}
          onOk={() => {
            if (!inputVal) {
              message.warn('未输入工程阶段名称');
              return;
            }
            const newData: any = new ProjectProgressItem(inputVal, true);
            setDataSource([...dataSource, newData]);
            setAddVisible(false);
            form.setFieldsValue({
              monthlyCompletionStatusList: [...dataSource, newData].map((item: any) => {
                return {
                  phase: item.phase,
                  cumulative: '',
                  this_month: '',
                  next_plan: '',
                }
              })
            })
          }}
          onCancel={() => setAddVisible(false)}
        >
          <Input value={inputVal} placeholder={'请输入工程阶段名称'} onChange={(e) => {
            setInputVal(e.target.value);
          }}/>
        </Modal>
      )}
    </>
  )
}

export default ProjectProgress;
