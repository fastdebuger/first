import React, { useEffect, useRef } from "react";
import { connect } from "umi";
import {Button, Col, Row, Tabs, Modal, Space, message } from "antd";
import ShowProjectContractInfo from "../Common/ShowProjectContractInfo";
import BaseInfo from "./BaseInfo";
import HumanResource from "./HumanResource";
import MasterEquipmentResource from "./MasterEquipmentResource";
import SubcontractorResource from "./SubcontractorResource";
import ProjectProgress from "./ProjectProgress";
import {
  getLastMonthlyReport,
  getMonthlyReportById,
  updateMonthlyReport
} from "@/services/engineering/monthlyReport";
import moment from "moment";


/**
 * 编辑项目月报
 * @param props
 * @constructor
 */
const MonthlyReportAdd: React.FC<any> = (props) => {
  const { visible, onCancel, selectedRecord} = props;
  const depCode = localStorage.getItem('auth-default-wbsCode') || '';
  const lastMonth = moment().subtract(1, 'months').format('YYYY-MM');
  const currentMonth = moment().format("YYYY-MM"); // 当前月
  // const lastMonth = (moment().subtract(1, 'months')).month() + 1; //上个月

  const monthlyReportBaseRef: any = useRef();
  const monthlyHumanResourceRef: any = useRef();
  const monthlyMasterEquipmentsRef: any = useRef();
  const monthlySubcontractorsRef: any = useRef();
  const monthlyProProgressRef: any = useRef();

  const [lastMonthRecord, setLastMonthRecord] = React.useState<object | null>(null);

  const [defaultRecord, setDefaultRecord] = React.useState<object | null>(null);

  const fetchInitData = async () => {
    const res = await getMonthlyReportById({
      id: selectedRecord.id,
    })
    setLastMonthRecord(res.result || null);

    const res2 = await getLastMonthlyReport({
      project_id: selectedRecord.project_id,
      belong_month: lastMonth,
    })
    if (res2.result.length > 0) {
      setDefaultRecord(res2.rows[0])
    }
  }

  useEffect(() => {
    fetchInitData()
  }, []);


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

      // console.log("monthlyReportBase---", monthlyReportBase);
      // console.log("monthlyMasterEquipments---", monthlyMasterEquipments);
      // console.log("monthlySubcontractors---", monthlySubcontractors);
      // console.log("monthlyProProgress---", monthlyProProgress);
      if (selectedRecord) {
        Object.assign(monthlyReportBase, {
          ...selectedRecord,
          belong_month: selectedRecord.belong_month,
          report_dep_code: depCode,
        });
      }
      const payload = {
        id: selectedRecord.id,
        MonthlyEquipments: JSON.stringify(monthlyMasterEquipments),
        MonthlyHumanResource: JSON.stringify(newMonthlyHumanResource),
        MonthlyProProgress: JSON.stringify(monthlyProProgress),
        MonthlyReportBase: JSON.stringify(monthlyReportBase),
        MonthlySubcontractors: JSON.stringify(monthlySubcontractors),
      };

      const res = await updateMonthlyReport(payload);
      if (res.errCode === 0) {
        message.success('保存成功');
        onCancel();
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
            <h3>编辑月报</h3>
          </Col>
          <Col span={12} style={{ textAlign: "center" }}>
          </Col>
          <Col span={6} style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={onCancel}>取消</Button>
              <Button disabled={!lastMonthRecord} onClick={handleSave}>保存</Button>
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
      {selectedRecord && (
        <div>
          日期：{selectedRecord.belong_month}
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        {lastMonthRecord && selectedRecord && (
          <>
            <ShowProjectContractInfo selectedRecord={Object.assign(selectedRecord, lastMonthRecord.MonthlyReportBase || {})}/>
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
                <ProjectProgress defaultRecord={defaultRecord} cRef={monthlyProProgressRef} lastMonthRecord={lastMonthRecord} selectedRecord={selectedRecord}/>
              </Tabs.TabPane>
            </Tabs>
          </>
        )}
      </div>
    </Modal>
  );
};

export default connect()(MonthlyReportAdd);
