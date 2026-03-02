import React, { useEffect, useRef } from "react";
import { connect } from "umi";
import {Button, Col, Row, Tabs, Modal, Space, message } from "antd";
import {getLastThuToThisWedRange} from "../Common/DateRangerSelect";
import ShowProjectContractInfo from "@/pages/Engineering/Week/WeeklyReport/Common/ShowProjectContractInfo";
import BaseInfo from "./BaseInfo";
import HumanResource from "./HumanResource";
import MasterEquipmentResource from "./MasterEquipmentResource";
import SubcontractorResource from "./SubcontractorResource";
import ProjectProgress from "./ProjectProgress";
import {
  getWeeklyReportById,
  updateWeeklyReport
} from "@/services/engineering/weeklyReport";


/**
 * 编辑项目周报
 * @param props
 * @constructor
 */
const WeeklyReportAdd: React.FC<any> = (props) => {
  const { visible, onCancel, selectedRecord} = props;
  const depCode = localStorage.getItem('auth-default-wbsCode') || '';

  // 上周四 到 这周三
  const [lastThu, thisWed] = getLastThuToThisWedRange();
  const weeklyReportBaseRef: any = useRef();
  const weeklyHumanResourceRef: any = useRef();
  const weeklyMasterEquipmentsRef: any = useRef();
  const weeklySubcontractorsRef: any = useRef();
  const weeklyProProgressRef: any = useRef();

  const [lastWeekRecord, setLastWeekRecord] = React.useState<object | null>(null);

  const fetchInitData = async () => {
    const res = await getWeeklyReportById({
      id: selectedRecord.id,
    })
    setLastWeekRecord(res.result || null);
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
      const weeklyReportBase = await weeklyReportBaseRef.current.getData();
      const weeklyHumanResource = weeklyHumanResourceRef.current.getData();
      const weeklyMasterEquipments = weeklyMasterEquipmentsRef.current.getData();
      const weeklySubcontractors = weeklySubcontractorsRef.current.getData();
      const weeklyProProgress = await weeklyProProgressRef.current.getData();

      let weightTotal = 0;
      const { weeklyEngineeringPhaseList } = weeklyProProgress;
      weeklyEngineeringPhaseList.forEach(r => {
        weightTotal += Number(r.weight || 0);
      })

      if (weightTotal !== 100) {
        Modal.warn({
          title: '项目进度 工程阶段 权重之和必须为100'
        })
        return;
      }

      const result: any[] = [];
      if(weeklyHumanResource.length > 0) {
        weeklyHumanResource.forEach(item => {
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
      const newWeeklyHumanResource = mergeSameGroup(result);

      // console.log("weeklyReportBase---", weeklyReportBase);
      // console.log("weeklyMasterEquipments---", weeklyMasterEquipments);
      // console.log("weeklySubcontractors---", weeklySubcontractors);
      // console.log("weeklyProProgress---", weeklyProProgress);
      if (selectedRecord) {
        Object.assign(weeklyReportBase, {
          ...selectedRecord,
          weekly_report_start: selectedRecord.weekly_report_start,
          weekly_report_end: selectedRecord.weekly_report_end,
          report_dep_code: depCode,
        });
      }
      const payload = {
        id: selectedRecord.id,
        WeeklyEquipments: JSON.stringify(weeklyMasterEquipments),
        WeeklyHumanResource: JSON.stringify(newWeeklyHumanResource),
        WeeklyProProgress: JSON.stringify(weeklyProProgress),
        WeeklyReportBase: JSON.stringify(weeklyReportBase),
        WeeklySubcontractors: JSON.stringify(weeklySubcontractors),
      };
      // console.log("payload---", {
      //   WeeklyEquipments: weeklyMasterEquipments,
      //   WeeklyHumanResource: newWeeklyHumanResource,
      //   WeeklyProProgress: weeklyProProgress,
      //   WeeklyReportBase: weeklyReportBase,
      //   WeeklySubcontractors: weeklySubcontractors,
      // });
      // return;
      const res = await updateWeeklyReport(payload);
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
            <h3>编辑周报</h3>
          </Col>
          <Col span={12} style={{ textAlign: "center" }}>
          </Col>
          <Col span={6} style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={onCancel}>取消</Button>
              <Button disabled={!lastWeekRecord} onClick={handleSave}>保存</Button>
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
          日期：{selectedRecord.weekly_report_start} ~ {selectedRecord.weekly_report_end}
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        {lastWeekRecord && selectedRecord && (
          <>
            <ShowProjectContractInfo selectedRecord={Object.assign(selectedRecord, lastWeekRecord.WeeklyReportBase || {})}/>
            <Tabs>
              <Tabs.TabPane tab="基本信息完善" key="item-1" forceRender={true}>
                <BaseInfo cRef={weeklyReportBaseRef} lastWeekRecord={lastWeekRecord} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="人力资源投入" key="item-2" forceRender={true}>
                <HumanResource cRef={weeklyHumanResourceRef} lastWeekRecord={lastWeekRecord}  />
              </Tabs.TabPane>
              <Tabs.TabPane tab="主要施工设备投入" key="item-3" forceRender={true}>
                <MasterEquipmentResource cRef={weeklyMasterEquipmentsRef} lastWeekRecord={lastWeekRecord} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="分包商投入" key="item-4" forceRender={true}>
                <SubcontractorResource cRef={weeklySubcontractorsRef} lastWeekRecord={lastWeekRecord} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="项目进度" key="item-5" forceRender={true}>
                <ProjectProgress selectedRecord={selectedRecord} cRef={weeklyProProgressRef} lastWeekRecord={lastWeekRecord} />
              </Tabs.TabPane>
            </Tabs>
          </>
        )}
      </div>
    </Modal>
  );
};

export default connect()(WeeklyReportAdd);
