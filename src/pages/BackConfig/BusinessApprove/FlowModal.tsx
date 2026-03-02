import React, {useEffect, useState} from "react";
import {connect, useIntl} from "umi";
import {Tag, Card, Row, Col, Input,Button, Modal} from "antd";
import './index.less'
import {RedoOutlined} from "@ant-design/icons";

const {Search} = Input;
const selectedIcon = require('@/assets/handover/selected.png')
const flowIcon = require('@/assets/approve/flow.png')

interface FlowModalType {
  visible: boolean;
  onCancel: () => {};
  flowList: any;
  onOk: any;
  checkedFlow: string;
}

const FlowModal: React.FC<any> = (props: FlowModalType) => {
  const {visible, onCancel, flowList, onOk, checkedFlow} = props
  const {formatMessage} = useIntl();
  const [searchValue, setSearchValue] = useState<string>('');
  const [flowListAll, setFlowListAll] = useState<any[]>([]);

  useEffect(() => {
    setFlowListAll(flowList)
  }, [visible]);

  useEffect(() => {
    if (searchValue) {
      setFlowListAll(flowList.filter((item: any) => item.name.includes(searchValue)))
    } else {
      setFlowListAll(flowList)
    }
  }, [searchValue])

  return (
    <Modal
      centered
      title={formatMessage({id: 'system.chose_template_name'})}
      open={visible}
      onCancel={onCancel}
      width={'48vw'}
      bodyStyle={{height: '62vh'}}
    >
      <Row>
        <Col span={23}>
          <Search
            style={{width: '100%'}}
            placeholder={formatMessage({id: 'system.module'})}
            value={searchValue}
            onChange={(e: any) => setSearchValue(e.target.value)}
          />
        </Col>
        <Col span={1}>
          <Button icon={<RedoOutlined/>} onClick={() => {
            setSearchValue('')
            setFlowListAll(flowList)
          }}/>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className={'flowModalRow'}>
        {flowListAll.map((item: any) => (
          <Col span={24}>
            <Card
              className={item.code === checkedFlow ? 'checkedFlowRowCard' : 'flowRowCard'}
              onClick={() => onOk(item)}
              size={"small"}
              bodyStyle={{position: 'relative'}}
              hoverable
            >
              {item.code === checkedFlow && <img className={'checkedFlowImg'} alt={item.title} src={selectedIcon}/>}
              <Row>
                <Col span={2}>
                  <div className={'checkedFlowRow'}>
                    <img className={'checkedFlowRowImg'} src={flowIcon}/>
                  </div>
                </Col>
                <Col span={12}>
                  <div className={'checkedFlowRowCol'}>{item.name}</div>
                </Col>
                <Col span={5}>
                  <div className={'checkedFlowRowCol'}>
                    <Tag>v{item.version}</Tag>
                  </div>
                </Col>
                <Col span={5}>
                  <div className={'checkedFlowRowCol'}>
                    {item.updateTime}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

export default connect()(FlowModal);
