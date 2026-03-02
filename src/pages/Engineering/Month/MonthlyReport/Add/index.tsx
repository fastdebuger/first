import React, { useEffect, useRef } from "react";
import { configColumns } from "../columns";
import { BasicTableColumns } from "yayang-ui";
import { connect } from "umi";
import {Button, Col, Row, Steps, Tabs, Modal, Alert, Space, message } from "antd";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import ShowProjectContractInfo from "../Common/ShowProjectContractInfo";
import BaseInfo from "./BaseInfo";
import HumanResource from "./HumanResource";
import MasterEquipmentResource from "./MasterEquipmentResource";
import SubcontractorResource from "./SubcontractorResource";
import ProjectProgress from "./ProjectProgress";
import {addMonthlyReport, getLastMonthlyReport} from "@/services/engineering/monthlyReport";
import moment from "moment";


/**
 * 新增项目月报
 * @param props
 * @constructor
 */
const MonthlyReportAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const depCode = localStorage.getItem('auth-default-wbsCode') || '';

  const currentMonth = moment().format('YYYY-MM'); // 当前月
  const lastMonth = moment().subtract(1, 'months').format('YYYY-MM');

  // 上月四 到 这月三
  // const [lastThu, thisWed] = getLastThuToThisWedRange();
  // // 上上月四 到 上月三
  // const [lastLastThu, lastWed] = getLastLastThuToLastWedRange();

  const monthlyReportBaseRef: any = useRef();
  const monthlyHumanResourceRef: any = useRef();
  const monthlyMasterEquipmentsRef: any = useRef();
  const monthlySubcontractorsRef: any = useRef();
  const monthlyProProgressRef: any = useRef();
  // 当前步骤
  const [current, setCurrent] = React.useState(0);
  // 选中的项目
  const [selectedRecord, setSelectedRecord] = React.useState<object | null>(null);

  const [lastMonthRecord, setLastMonthRecord] = React.useState<object | null>(null);


  useEffect(() => {
    if (dispatch) {

    }
  }, []);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns)
      .initTableColumns([
        // 'id',
        // 'form_code', // 月报编码 -》后台生成
        'project_id',
        'project_name',
        // 'monthly_report_start', // 月报日期开始 -》 报告日期
        // 'monthly_report_end', // 月报日期结束 -〉 报告日期
        // 'report_dep_code', // 填报单位 -》 上报单位
        'project_manager',
        'manager_phone',
        'region_category',
        // 'project_status',
        // 'project_status_date', // 项目状态日期-》实际完成日期
        'project_subject',
        'project_quantities',
        'contract_start_date',
        'contract_end_date',
        'plan_finish_date',

        // 'change_complete_date',
        // 'change_date',
        // 'change_reason',

        'contract_currency',
        'contract_say_price',
        'contract_un_say_price',
        // 'contract_sign_date',
        // 'equivalent_RMB_price',
        // 'equivalent_RMB_un_price',
        'contract_mode_name',
        'project_level_name',
        'construction_dep',
      ])
      .setTableColumnToDatePicker([
        {value: 'contract_start_date', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'contract_end_date', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'plan_finish_date', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'contract_sign_date', valueType: 'dateTs', needValueType: 'timestamp'},
      ])
      .getNeedColumns();
    return cols;
  };

  // 合并相同分组的函数（仅整合字段，不求和）
  function mergeSameGroup(arr: any[]) {
    const tempObj: any = {};

    arr.forEach(item => {
      // 生成唯一分组键（三个字段完全相同则键相同）
      const groupKey = `${item.person_category}-${item.person_situation}-${item.person_type}`;

      // 初始化分组对象：若不存在则创建，仅保留核心分组字段，数值字段默认0
      if (!tempObj[groupKey]) {
        tempObj[groupKey] = {
          person_category: item.person_category,
          person_situation: item.person_situation,
          person_type: item.person_type,
          chinese_count: 0, // 初始值可改为 undefined，根据需求调整
          foreign_count: 0
        };
      }

      // 整合字段：若当前项有chinese_count，则赋值给分组对象
      if (item.hasOwnProperty('chinese_count')) {
        tempObj[groupKey].chinese_count = item.chinese_count;
      }
      // 整合字段：若当前项有foreign_count，则赋值给分组对象
      if (item.hasOwnProperty('foreign_count')) {
        tempObj[groupKey].foreign_count = item.foreign_count;
      }
    });

    // 将分组对象转为最终数组
    return Object.values(tempObj);
  }

  const handleSave = async () => {
    try {
      const monthlyReportBase = await monthlyReportBaseRef.current.getData();
      const monthlyHumanResource = monthlyHumanResourceRef.current.getData();
      const monthlyMasterEquipments = monthlyMasterEquipmentsRef.current.getData();
      const monthlySubcontractors = monthlySubcontractorsRef.current.getData();
      const monthlyProProgress = await monthlyProProgressRef.current.getData();

      let weightTotal = 0;
      const { monthlyEngineeringPhaseList } = monthlyProProgress;
      monthlyEngineeringPhaseList.forEach(r => {
        weightTotal += Number(r.weight || 0);
      })

      if (weightTotal !== 100) {
        Modal.warn({
          title: '项目进度 工程阶段 权重之和必须为100'
        })
        return;
      }

      const result: any[] = [];
      if(monthlyHumanResource.length > 0) {
        monthlyHumanResource.forEach(item => {
          for(const [key, val] of Object.entries(item)) {
            const obj = {};
            if (key.indexOf("_yy_") > -1 && key.indexOf("_t") < 0) {
              const strings = key.split("_yy_");
              const titleArr = strings[1].split("_");
              Object.assign(obj, {
                [strings[0]]: val,
                person_situation: titleArr[0],
                person_category: titleArr[1],
                person_type: item.person_type,
              })
            }
            if (JSON.stringify(obj) !== '{}') {
              result.push(obj);
            }
          }
        })
      }
      const newMonthlyHumanResource = mergeSameGroup(result);

      if (selectedRecord) {
        Object.assign(monthlyReportBase, {
          ...selectedRecord,
          belong_month: currentMonth,
          report_dep_code: depCode,
        });
      }
      const payload = {
        MonthlyEquipments: JSON.stringify(monthlyMasterEquipments),
        MonthlyHumanResource: JSON.stringify(newMonthlyHumanResource),
        MonthlyProProgress: JSON.stringify(monthlyProProgress),
        MonthlyReportBase: JSON.stringify(monthlyReportBase),
        MonthlySubcontractors: JSON.stringify(monthlySubcontractors),
      };
      const res = await addMonthlyReport(payload);
      if (res.errCode === 0) {
        message.success('保存成功');
        if (callbackSuccess) callbackSuccess();
      }
    } catch (e) {
      console.log('--------handelSave', e)
    }
  }

  return (
    <Modal
      title={(
        <Row>
          <Col span={6} style={{ textAlign: "left" }}>
            <h3>新增月报</h3>
          </Col>
          <Col span={12} style={{ textAlign: "center" }}>
            <Steps current={current} size={'small'}>
              <Steps.Step title="第一步, 选择项目部" />
              <Steps.Step title="第二步，完善日报信息" />
            </Steps>
          </Col>
          <Col span={6} style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={onCancel}>取消</Button>
              <Button disabled={current === 0} onClick={handleSave}>保存</Button>
            </Space>
          </Col>
        </Row>
      )}
      visible={visible}
      onCancel={onCancel}
      width={'100vw'}
      closable={false}
      footer={null}
      style={{
        top: 0,
        maxWidth: '100vw',
        paddingBottom: 0,
      }}
      bodyStyle={{
        height: 'calc(100vh - 65px)',
        overflow: 'scroll'
      }}
    >
      <div>
        日期：{currentMonth}月
      </div>
      <div style={{ marginTop: 16 }}>
        {current === 0 && (
          <BaseCurdSingleTable
            rowKey="project_id"
            tableTitle="项目月报备选列表"
            funcCode={'查询项目月报备选列表'}
            type="monthlyReport/getProjectBak"
            tableColumns={getTableColumns()}
            renderSelfHeader={() => undefined}
            tableSortOrder={{ sort: 'contract_start_date', order: 'desc' }}
            buttonToolbar={undefined}
            renderSelfToolbar={() => {
              return (
                <Alert type={'info'} message={'选择其中一个项目,会把选中的当前项目的上月的数据赋值到下一步'}/>
              )
            }}
            selectedRowsToolbar={() => []}
            rowSelection={{
              type: 'radio',
              callback: async (keys, rows) => {
                console.log(rows);
                const res = await getLastMonthlyReport({
                  project_id: rows[0].project_id,
                  belong_month: lastMonth,
                })
                setLastMonthRecord(res.result || null);
                setSelectedRecord(rows[0]);
                setCurrent(1)
              }
            }}
            tableDefaultField={{
              belong_month: currentMonth,
            }}
            tableDefaultFilter={[]}
          />
        )}
        {current === 1 && selectedRecord && (
          <>
            <ShowProjectContractInfo selectedRecord={selectedRecord} />
            <Tabs>
              <Tabs.TabPane tab="基本信息完善" key="item-1" forceRender={true}>
                <BaseInfo cRef={monthlyReportBaseRef} lastMonthRecord={lastMonthRecord} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="人力资源投入" key="item-2" forceRender={true}>
                <HumanResource cRef={monthlyHumanResourceRef} lastMonthRecord={lastMonthRecord}  />
              </Tabs.TabPane>
              <Tabs.TabPane tab="主要施工设备投入" key="item-3" forceRender={true}>
                <MasterEquipmentResource cRef={monthlyMasterEquipmentsRef} lastMonthRecord={lastMonthRecord} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="分包商投入" key="item-4" forceRender={true}>
                <SubcontractorResource cRef={monthlySubcontractorsRef} lastMonthRecord={lastMonthRecord} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="项目进度" key="item-5" forceRender={true}>
                <ProjectProgress cRef={monthlyProProgressRef} selectedRecord={selectedRecord} lastMonthRecord={lastMonthRecord} />
              </Tabs.TabPane>
            </Tabs>
          </>
        )}
      </div>
    </Modal>
  );
};

export default connect()(MonthlyReportAdd);
