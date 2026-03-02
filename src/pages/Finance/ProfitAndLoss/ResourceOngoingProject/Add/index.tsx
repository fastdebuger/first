import React, { useEffect, useRef } from "react";
import { configColumns as showContractColumns } from "@/pages/Contract/Income/columns";
import { BasicTableColumns } from "yayang-ui";
import { connect } from "umi";
import {Button, Col, Row, Steps, Tabs, Modal, Alert, Space, message, Collapse, Menu, Badge } from "antd";
import {getDepTitle} from "@/utils/utils";
import {getUrlCrypto} from "@/components/HuaWeiOBSUploadSingleFile";
import ShowProjectContractInfo from "../Common/ShowProjectContractInfo";
import BasicData from "../Common/BasicData";
import {queryWbsDefineCompare} from "@/services/finance/wbsDefineCompare";
import FinalAccounts from "../Common/FinalAccounts";
import SanJinAndJianZhi from "../Common/SanJinAndJianZhi";
import FuZhai from "../Common/FuZhai";
import {addResourceOngoingProject} from "@/services/finance/resourceOngoingProject";
import {queryWbsDefineCodeContractCountList} from "@/services/contract/income";
import { CaretRightOutlined } from "@ant-design/icons";
import ShowContractInfo from "./ShowContractInfo";


/**
 * 新增数据
 * @param props
 * @constructor
 */
const ResourceOngoingProjectAdd: React.FC<any> = (props) => {
  const { dispatch, year, visible, onCancel, callbackSuccess } = props;
  const depCode = localStorage.getItem('auth-default-wbsCode') || '';

  // 当前步骤
  const [current, setCurrent] = React.useState(0);
  // 选中的项目
  const [selectedRecord, setSelectedRecord] = React.useState<any | null>(null);
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
  const [selectedMenuItem, setSelectedMenuItem]  = React.useState<any | null>(null);

  const [wbsDefineContracts, setWbsDefineContracts] = React.useState([])
  const [contractCountStr, setContractCountStr] = React.useState<any>('');

  const basicRef: any = useRef(null);
  const finalRef: any = useRef(null);
  const sanjinRef: any = useRef(null);
  const fuzhaiRef: any = useRef(null);

  const fetchList = async () => {
    const res = await queryWbsDefineCodeContractCountList({
      sort: 'wbs_define_code',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'dep_code', Val: depCode, Operator: '='}
      ])
    })
    if (res.rows.length > 0) {
      const _item = res.rows[0];
      setSelectedKeys([_item.wbs_define_code]);
      setSelectedMenuItem(_item);
      setWbsDefineContracts(res.rows);
    }
  }

  useEffect(() => {
    if(current === 0) {
      fetchList()
    }
  }, [current]);

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
        year,
        ...basicData,
        finalData: JSON.stringify(_finalData),
        sanJinData: JSON.stringify(_sanJinData),
        ...fuZhaiData,
      };
      console.log("payload-----22222-", payload);
      const res = await addResourceOngoingProject(payload);
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
            <h3>新增数据</h3>
          </Col>
          <Col span={12} style={{ textAlign: "center" }}>
            <Steps current={current} size={'small'}>
              <Steps.Step title="第一步, 选择WBS项目定义" />
              <Steps.Step title="第二步，完善信息" />
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
        overflow: 'scroll',
        padding: '8px 24px'
      }}
    >
      <div>
        {current === 0 && (
          <div>
            <Row gutter={16}>
              <Col span={4}>
                <strong>WBS项目定义及主合同数量</strong>
                <Menu
                  selectedKeys={selectedKeys}
                >
                  {wbsDefineContracts.map((item: any) => {
                    return (
                      <Menu.Item
                        key={item.wbs_define_code}
                        onClick={() => {
                          setSelectedKeys([item.wbs_define_code]);
                          setSelectedMenuItem(item);
                        }}
                      >
                        {item.wbs_define_code}
                        <Badge
                          count={Number(item.contract_no_count || 0)}
                          style={{ marginLeft: 8, backgroundColor: '#52c41a' }}
                        />
                      </Menu.Item>
                    )
                  })}
                </Menu>
              </Col>
              <Col span={20}>
                {selectedMenuItem && (
                  <>
                    <ShowContractInfo selectedMenuItem={selectedMenuItem}
                      callback={(_selectedRecord: any, _contractCountStr: string) => {
                        setContractCountStr(_contractCountStr)
                        setSelectedRecord(_selectedRecord);
                        setCurrent(1)
                      }}
                    />
                  </>
                )}
              </Col>
            </Row>
          </div>
        )}
        {current === 1 && selectedRecord && (
          <>
            <Tabs>
              <Tabs.TabPane tab="基本信息填报" key="item-1" forceRender={true}>
                <BasicData contractCountStr={contractCountStr} cRef={basicRef} selectedRecord={selectedRecord}/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="决算数据" key="item-2" forceRender={true}>
                <FinalAccounts operate={'add'} cRef={finalRef} selectedRecord={selectedRecord}/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="三金数据及减值" key="item-3" forceRender={true}>
                <SanJinAndJianZhi cRef={sanjinRef} selectedRecord={selectedRecord}/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="负债" key="item-4" forceRender={true}>
                <FuZhai cRef={fuzhaiRef} selectedRecord={selectedRecord}/>
              </Tabs.TabPane>
            </Tabs>
          </>
        )}
      </div>
    </Modal>
  );
};

export default connect()(ResourceOngoingProjectAdd);
