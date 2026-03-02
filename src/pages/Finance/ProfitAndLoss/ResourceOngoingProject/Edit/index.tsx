import React, { useEffect, useRef } from "react";
import { connect } from "umi";
import {Button, Col, Row, Steps, Tabs, Modal, Space, message } from "antd";
import ShowProjectContractInfo from "../Common/ShowProjectContractInfo";
import BasicData from "../Common/BasicData";
import FinalAccounts from "../Common/FinalAccounts";
import SanJinAndJianZhi from "../Common/SanJinAndJianZhi";
import FuZhai from "../Common/FuZhai";
import {updateResourceOngoingProject} from "@/services/finance/resourceOngoingProject";


/**
 * 新增数据
 * @param props
 * @constructor
 */
const ResourceOngoingProjectEdit: React.FC<any> = (props) => {
  const { dispatch, visible, selectedRecord,  onCancel, callbackSuccess } = props;
  const [showInfo, setShowInfo] = React.useState(null);

  const basicRef: any = useRef(null);
  const finalRef: any = useRef(null);
  const sanjinRef: any = useRef(null);
  const fuzhaiRef: any = useRef(null);

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'income/getIncomeInfo',
        payload: {
          sort: 'id',
          order: 'asc',
          filter: JSON.stringify([
            {Key: 'id', Val: selectedRecord.contract_income_id, Operator: '='}
          ]),
        },
        callback: (res) => {
          if (res.rows.length > 0) {
            setShowInfo(res.rows[0])
          }
        }
      })
    }
  }, []);

  const handleSave = async () => {
    try {
      const basicData = await basicRef.current.getData();
      const finalData = await finalRef.current.getData();
      const sanJinData = await sanjinRef.current.getData();
      const fuZhaiData = await fuzhaiRef.current.getData();
      console.log("basicData--", basicData);
      console.log("finalData--", finalData);
      console.log("sanJinData--", sanJinData);
      console.log("fuZhaiData--", fuZhaiData);
      const _finalData: any[] = [];
      for(const [key, val] of Object.entries(finalData)) {
        if (Array.isArray(val) && val.length > 0) {
          _finalData.push({
            type_code: key,
            wbs_define_code: selectedRecord.wbs_code,
            ...val[0],
          })
        }
      }
      const _sanJinData: any[] = [];
      for(const [key, val] of Object.entries(sanJinData)) {
        if (Array.isArray(val) && val.length > 0) {
          _sanJinData.push({
            type: key,
            wbs_define_code: selectedRecord.wbs_code,
            ...val[0],
          })
        }
      }
      if(!basicData) {
        return;
      }
      const payload = {
        id: selectedRecord.id,
        year: selectedRecord.year,
        ...basicData,
        finalData: JSON.stringify(_finalData),
        sanJinData: JSON.stringify(_sanJinData),
        ...fuZhaiData,
        b3_id: selectedRecord.b3_id,
      };
      console.log("payload-----22222-", payload);
      const res = await updateResourceOngoingProject(payload);
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
            <h3>编辑数据</h3>
          </Col>
          <Col span={12} style={{ textAlign: "center" }}/>
          <Col span={6} style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={onCancel}>取消</Button>
              <Button onClick={handleSave}>保存</Button>
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
        overflow: 'scroll',
        padding: '8px 24px'
      }}
    >
      <div>
        {showInfo && <ShowProjectContractInfo selectedRecord={showInfo}/>}
        <Tabs>
          <Tabs.TabPane tab="基本信息填报" key="item-1" forceRender={true}>
            <BasicData operate={'edit'} cRef={basicRef} selectedRecord={selectedRecord}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="决算数据" key="item-2" forceRender={true}>
            <FinalAccounts cRef={finalRef} selectedRecord={selectedRecord}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="三金数据及减值" key="item-3" forceRender={true}>
            <SanJinAndJianZhi cRef={sanjinRef} selectedRecord={selectedRecord}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="负债" key="item-4" forceRender={true}>
            <FuZhai cRef={fuzhaiRef} selectedRecord={selectedRecord}/>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default connect()(ResourceOngoingProjectEdit);
