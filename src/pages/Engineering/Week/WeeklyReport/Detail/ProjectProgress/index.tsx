import {useEffect, useImperativeHandle, useRef, useState } from 'react';
import { columns } from './ProjectProgressColumns';
import {Alert, Button, Col, Form, Input, message, Modal, Popconfirm, Row, Table,
  Tabs, Typography } from 'antd';
import MainIssues from "./MainIssues";
import ImgProgress from "./ImgProgress";
import ShiGongTable from "./ShiGongTable";
import AddInputNumber from "@/pages/Engineering/Week/WeeklyReport/Common/AddInputNumber";

const { Text } = Typography;

class ProjectProgressItem {
  phase: string;
  weight: number;
  last_week_plan: number;
  last_week_reality: number;
  last_week_difference: number;
  curr_week_plan: number;
  curr_week_reality: number;
  curr_week_difference: number;
  hasNewField: boolean;

  constructor(phase: string, hasNewField: boolean = false) {
    this.phase = phase;             //工程阶段(设计/采购/施工/试运/其他)
    this.weight = 0;                // 权重（%）
    this.last_week_plan = 0;        // 上周计划累计（%）
    this.last_week_reality = 0;     // 上周实际累计（%）
    this.last_week_difference = 0;  // 上周差值（%）
    this.curr_week_plan = 0;        // 本周计划累计（%）
    this.curr_week_reality = 0;     // 本周实际累计（%）
    this.curr_week_difference = 0;  // 本周差值（%）
    this.hasNewField = hasNewField;
    this.calculateDifference();
  }

  calculateDifference() {
    this.last_week_difference = this.last_week_reality - this.last_week_plan;
    this.curr_week_difference = this.curr_week_reality - this.curr_week_plan;
  }

  updateField(dataIndex: string, value: string | number) {
    // @ts-ignore
    this[dataIndex] = value;
    this.calculateDifference();
  }

  getField(dataIndex: string) {
    // @ts-ignore
    return this[dataIndex];
  }

}

const FormListTabItem = ({ title, name, restField }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 移除多余的item-${key}文本（避免干扰） */}
      <Form.Item
        {...restField}
        style={{ display: 'none' }}
        label="phase"
        name={[name, 'phase']}
      >
        <Input placeholder="请输入阶段名称" />
      </Form.Item>
      <Form.Item
        {...restField}
        label="当前累计完成工作情况"
        name={[name, 'cumulative']}
      >
        <Input.TextArea placeholder="请输入" />
      </Form.Item>
      <Form.Item
        {...restField}
        label="本周工作情况"
        name={[name, 'this_week']}
      >
        <Input.TextArea placeholder="请输入" />
      </Form.Item>
      <Form.Item
        {...restField}
        label="下周计划"
        name={[name, 'next_plan']}
      >
        <Input.TextArea placeholder="请输入" />
      </Form.Item>
    </div>
  );
};


const ProjectProgress = (props: any) => {
  const { cRef, lastWeekRecord } = props;
  const [form] = Form.useForm();
  const mainIssuesRef: any = useRef();
  const imgProgressRef: any = useRef();
  // 表格内数据
  const [dataSource, setDataSource] = useState(() => {
    return ['设计', '采购', '施工', '试运'].map(type => new ProjectProgressItem(type));
  })
  const [addVisible, setAddVisible] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [activeKey, setActiveKey] = useState('item-0');

  useEffect(() => {
    if (lastWeekRecord && lastWeekRecord.WeeklyProProgress) {
      const {weeklyCompletionStatusList, weeklyMainImageProgressList, weeklyEngineeringPhaseList } = lastWeekRecord.WeeklyProProgress;
      form.setFieldsValue({
        schedule_desc: lastWeekRecord.WeeklyProProgress.schedule_desc,
        work_plan: lastWeekRecord.WeeklyProProgress.work_plan,
        completion_status: lastWeekRecord.WeeklyProProgress.completion_status,
      });
      // 初始化 工作情况的Tab页部分
      if (weeklyCompletionStatusList && weeklyCompletionStatusList.length> 0) {
        form.setFieldsValue({
          weeklyCompletionStatusList: weeklyCompletionStatusList ||[],
        })
      }
      // 初始化 工作情况是施工的 里的表格
      form.setFieldsValue({
        weeklyMainImageProgressList: weeklyMainImageProgressList || [],
      })

      // dataSource
      if (weeklyEngineeringPhaseList && weeklyEngineeringPhaseList.length > 0) {
        const _arr: string[] = weeklyEngineeringPhaseList.map(item => item.phase);
        const _dataSource = _arr.reverse().map(type => new ProjectProgressItem(type));
        _dataSource.forEach(item => {
          const findObj = weeklyEngineeringPhaseList.find(r => r.phase === item.phase)
          if (findObj) Object.assign(item, findObj);
        })
        setDataSource([..._dataSource]);
      }
    }
  }, [lastWeekRecord]);

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
          const imgProgressData = imgProgressRef.current.getData();
          return {
            ...values,
            weeklyEngineeringPhaseList: dataSource,
            weeklyMainIssuesList: mainIssuesData,
            weeklyProImgProgressList: imgProgressData,
          }
        } catch (err) {
          Modal.error({
            title: '项目进度有必填项未填写',
            content: JSON.stringify(err),
          });
        }
      }
    };
  });

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
          Object.assign(item, {
            render: (text: string, record: any) => {
              return (
                <Text>{record.getField(item.dataIndex)}</Text>
              )
            }
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
    }
    dataSource.forEach(item => {
      total.total1 += item.getField('weight');
      total.total2 += (item.getField('last_week_plan') * (item.getField('weight') / 100));
      total.total3 += (item.getField('last_week_reality') * (item.getField('weight') / 100));
      total.total4 += (item.getField('last_week_difference') * (item.getField('weight') / 100));
      total.total5 += (item.getField('curr_week_plan') * (item.getField('weight') / 100));
      total.total6 += (item.getField('curr_week_reality') * (item.getField('weight') / 100));
      total.total7 += (item.getField('curr_week_difference') * (item.getField('weight') / 100));
    })
    return total;
  }

  // @ts-ignore
  return (
    <>
      <Table
        style={{marginTop: 16}}
        size="small"
        bordered
        scroll={{x: 1000}}
        dataSource={dataSource}
        columns={getColumns()}
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
            </Table.Summary.Row>
          );
        }}
      />
      <Form
        style={{marginTop: 16}}
        name="projectProgress"
        form={form}
        disabled={true}
        layout={'vertical'}
        initialValues={{
          weeklyCompletionStatusList: dataSource.map((item: any) => {
            return {
              phase: item.phase,
              cumulative: '',
              this_week: '',
              next_plan: '',
            }
          })
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Col span={24}>
              <Form.Item
                label="滞后原因（本周差值小于0必须填写）"
                name="delay_reasons"
                rules={[{ required: calculateGrandTotal().total4 < 0, message: '请输入' }]}
              >
                <Input.TextArea  placeholder={'请输入'} />
              </Form.Item>
            </Col>
            <Form.Item
              label="项目进度描述"
              name="schedule_desc"
            >
              <Input.TextArea  placeholder={'请输入'} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="简述当前累计完成的主要工作，关键节点完成情况及下周计划"
              name="work_plan"
              rules={[{ required: true, message: '必填项' }]}
            >
              <Input.TextArea  placeholder={'请输入'} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="简述本周关键节点、重点施工工序完成情况"
              name="completion_status"
              rules={[{ required: true, message: '必填项' }]}
            >
              <Input.TextArea  placeholder={'请输入'} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Alert type={'info'} message={'工程阶段附加信息'}/>
            <Form.List name="weeklyCompletionStatusList">
              {(fields, { add, remove }) => {

                // 步骤1：将fields映射为Tabs的items数组
                const tabItems = fields.map(({ key, name, ...restField }) => {
                  const tabKey = `item-${key}`; // 唯一Tab key
                  const title = dataSource[Number(key)]?.phase || `阶段${Number(key) + 1}`; // Tab标题

                  return {
                    key: tabKey,
                    forceRender: true,
                    label: <strong>{title}</strong>, // Tab标签
                    // Tab内容：原FormListTabItem中的Form.Item组
                    children: (
                      <FormListTabItem title={title} key={key} tabKey={tabKey} name={name} restField={restField} />
                    ),
                  };
                });

                return (
                  <Tabs
                    activeKey={activeKey}
                    onChange={(key) => setActiveKey(key)} // 切换页签更新状态
                    items={tabItems}
                    destroyInactiveTabPane={true} // 销毁非激活Tab，避免内容累加
                  />
                );
              }}
            </Form.List>
          </Col>
          <Col span={24}>
            {activeKey === 'item-2' && (
              <Form.Item
                label="主要形象进度 单体工程是指：1.长输管道项目的线路、大中型穿跨越、站场、阀室等单体；2.油气田、炼化、环境项目等各个装置、建筑工程等单"
                name="weeklyMainImageProgressList"
              >
                <ShiGongTable/>
              </Form.Item>
            )}
          </Col>
          <Col span={24}>
            <Alert type={'warning'} message={'当前存在的主要问题、风险和原因分析'}/>
            <MainIssues cRef={mainIssuesRef} lastWeekRecord={lastWeekRecord}/>
          </Col>
          <Col span={24}>
            <Alert type={'warning'} message={'增加项目形象进展'}/>
            <ImgProgress cRef={imgProgressRef} lastWeekRecord={lastWeekRecord}/>
          </Col>
        </Row>
      </Form>
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
              weeklyCompletionStatusList: [...dataSource, newData].map((item: any) => {
                return {
                  phase: item.phase,
                  cumulative: '',
                  this_week: '',
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
