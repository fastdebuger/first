import React, { useEffect, useRef } from "react";
import { connect } from "umi";
import { Col, Row, Tabs, Modal } from "antd";
import ShowProjectContractInfo from "../Common/ShowProjectContractInfo";
import BaseInfo from "./BaseInfo";
import HumanResource from "./HumanResource";
import MasterEquipmentResource from "./MasterEquipmentResource";
import SubcontractorResource from "./SubcontractorResource";
import ProjectProgress from "./ProjectProgress";
import {
  getMonthlyReportById
} from "@/services/engineering/monthlyReport";


/**
 * 项目月报详情
 * @param props
 * @constructor
 */
const MonthlyReportDetail: React.FC<any> = (props) => {
  const { visible, onCancel, selectedRecord, monthlyId = 'id'} = props;
  const monthlyReportBaseRef: any = useRef();
  const monthlyHumanResourceRef: any = useRef();
  const monthlyMasterEquipmentsRef: any = useRef();
  const monthlySubcontractorsRef: any = useRef();
  const monthlyProProgressRef: any = useRef();

  const [lastMonthRecord, setLastMonthRecord] = React.useState<object | null>(null);

  const fetchInitData = async () => {
    const res = await getMonthlyReportById({
      id: selectedRecord[monthlyId],
    })
    setLastMonthRecord(res.result || null);
  }

  useEffect(() => {
    fetchInitData()
  }, []);

  return (
    <Modal
      title={(
        <Row>
          <Col span={6} style={{ textAlign: "left" }}>
            <h3>月报详情</h3>
          </Col>
          <Col span={12} style={{ textAlign: "center" }}>
          </Col>
          <Col span={6} style={{ textAlign: "right" }}>
          </Col>
        </Row>
      )}
      visible={visible}
      onCancel={onCancel}
      width={'100vw'}
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
          日期：{selectedRecord.belong_month}月份
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        {lastMonthRecord && selectedRecord && (
          <>
            <ShowProjectContractInfo  selectedRecord={Object.assign(selectedRecord, lastMonthRecord.MonthlyReportBase || {})}/>
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
                <ProjectProgress cRef={monthlyProProgressRef} lastMonthRecord={lastMonthRecord}  selectedRecord={selectedRecord}/>
              </Tabs.TabPane>
            </Tabs>
          </>
        )}
      </div>
    </Modal>
  );
};

export default connect()(MonthlyReportDetail);
