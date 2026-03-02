import React from "react";
import { useIntl, connect } from "umi";
import { Modal, Space, Button, Row, Col } from "antd";
import ContractEvaluation from "./ContractEvaluation";

/**
 * 新增承包商年度评价基本信息
 * @param props
 * @constructor
 */
const ContractorModal: React.FC<any> = (props) => {
  const { visible, onCancel, callbackSuccess, selectedRecord, getInterfaceData } = props;
  const { formatMessage } = useIntl();


  return (
    <Modal
      style={{
        maxWidth: '100vw',
        top: 0,
        paddingBottom: 0,
      }}
      closable={false}
      bodyStyle={{
        height: 'calc(100vh - 65px)',
        overflowY: 'auto',
      }}
      width={'100%'}
      title={
        <Row justify="space-between" align="middle" style={{ width: '100%' }}>
          <Col>
            {formatMessage({ id: 'compinfo.contractor.info' })}
          </Col>
          <Col>
            <Space>
              <Button onClick={onCancel}>{formatMessage({ id: 'common.cancel' })}</Button>
            </Space>
          </Col>
        </Row>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <ContractEvaluation selectedRecord={selectedRecord} callbackSuccess={callbackSuccess} getInterfaceData={getInterfaceData}/>
    </Modal>
  );
};

export default connect()(ContractorModal);
