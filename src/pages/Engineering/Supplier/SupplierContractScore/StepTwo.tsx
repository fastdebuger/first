import React, { useEffect } from "react";
import {Alert, Button, Col, Descriptions,  Row } from "antd";
import { BasicTableColumns, BasicTable } from 'yayang-ui';
import {configColumns} from "@/pages/Engineering/Supplier/SupplierContractScore/columns";

const StepTwo = (props: any) => {
  const { selectedNodeInfo, findObj } = props;

  const getTableColumns = () => {
    return [];
  };

  return (
    <>
      <Descriptions title={"填报信息"}>
        <Descriptions.Item label="联系方式">{findObj.phone_number}</Descriptions.Item>
      </Descriptions>
      <h3>合同信息</h3>
      <Row justify={'space-between'} style={{marginTop: 8}}>
        <Col>
          <Alert type={'warning'} message={<span>请在规定时间段 <strong>{selectedNodeInfo.upload_date_start} ~ {selectedNodeInfo.upload_date_end}</strong> 内上传需要打分的合同, 过期将无法上传</span>}/>
        </Col>
        <Col>
          <Button>追加合同</Button>
        </Col>
      </Row>
      <BasicTable
        rowKey='year'
        dataSource={[]}
        columns={getTableColumns()}
        selectedRowsToolbar={() => []}
        noReloadIcon
      />
    </>
  )
}

export default StepTwo;
