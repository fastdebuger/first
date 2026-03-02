import React, { useEffect, useRef } from "react";
import { connect } from "umi";
import { Col, Row, Tabs, Modal, Space, Button, message } from "antd";
import ShowProjectContractInfo from "../Common/ShowProjectContractInfo";
import BaseInfo from "./BaseInfo";
import HumanResource from "./HumanResource";
import MasterEquipmentResource from "./MasterEquipmentResource";
import SubcontractorResource from "./SubcontractorResource";
import ProjectProgress from "./ProjectProgress";
import {
  getWeeklyReportById
} from "@/services/engineering/weeklyReport";
import {updateConfirmationRecord} from "@/services/engineering/weeklyReport";


/**
 * 项目周报详情
 * @param props
 * @constructor
 */
const WeeklyReportDetail: React.FC<any> = (props) => {
  const { visible, onCancel, selectedRecord, weeklyId = 'id', callback} = props;
  const weeklyReportBaseRef: any = useRef();
  const weeklyHumanResourceRef: any = useRef();
  const weeklyMasterEquipmentsRef: any = useRef();
  const weeklySubcontractorsRef: any = useRef();
  const weeklyProProgressRef: any = useRef();

  const [lastWeekRecord, setLastWeekRecord] = React.useState<object | null>(null);

  const fetchInitData = async () => {
    const res = await getWeeklyReportById({
      id: selectedRecord[weeklyId],
    })
    setLastWeekRecord(res.result || null);
  }


  useEffect(() => {
    fetchInitData()
  }, []);

  return (
    <Modal
      title={(
        <Row>
          <Col span={6} style={{ textAlign: "left" }}>
            <h3>周报详情</h3>
          </Col>
          <Col span={12} style={{ textAlign: "center" }}>
          </Col>
          <Col span={6} style={{ textAlign: "right", paddingRight: 16 }}>
            <Space>
              <span>
                {Number(selectedRecord.branch_confirmation) === 1 && (
                  <Button type={'primary'} danger onClick={() => {
                    Modal.confirm({
                      title: '驳回',
                      content: '是否驳回？',
                      okText: '驳回',
                      cancelText: '我再想想',
                      onOk: async () => {
                        const res = await updateConfirmationRecord({
                          branch_confirmation: '0',
                          weekly_id: selectedRecord.weekly_id,
                        })
                        if (res.errCode === 0) {
                          message.success("已确认");
                          callback();
                        }
                      }
                    })
                  }}>
                    驳回
                  </Button>
                )}
              </span>
              <span>
              {Number(selectedRecord.branch_confirmation) === 0 && (
                <Button type={'primary'} onClick={() => {
                  Modal.confirm({
                    title: '确认',
                    content: '是否确认？',
                    okText: '确认',
                    cancelText: '我再想想',
                    onOk: async () => {
                      const res = await updateConfirmationRecord({
                        branch_confirmation: '1',
                        weekly_id: selectedRecord.weekly_id,
                      })
                      if (res.errCode === 0) {
                        message.success("已确认");
                        callback();
                      }
                    }
                  })
                }}>
                  确认
                </Button>
              )}
              </span>
            </Space>
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
          日期：{selectedRecord.weekly_report_start} ~ {selectedRecord.weekly_report_end}
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        {lastWeekRecord && selectedRecord && (
          <>
            <ShowProjectContractInfo selectedRecord={selectedRecord} lastWeekRecord={lastWeekRecord}/>
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
                <ProjectProgress cRef={weeklyProProgressRef} lastWeekRecord={lastWeekRecord} />
              </Tabs.TabPane>
            </Tabs>
          </>
        )}
      </div>
    </Modal>
  );
};

export default connect()(WeeklyReportDetail);
