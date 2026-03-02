import { Modal, Button, Card, message } from 'antd';
import React, { useState } from 'react';
import { materialFlowReportQR } from "@/utils/utils";

const bt1 = require('./print.png');
const bt2 = require('./print2.png');
interface PrintButtonProps {
  className?: string;
  selectedRows?: any;
}

const PrintButton: React.FC<PrintButtonProps> = (props) => {
  const { selectedRows } = props;
  const [visible, setVisible] = useState(false)

  const [data, setData] = useState('')

  return (
    <>
      <Button
        type={"primary"}
        // size={"small"}
        onClick={() => {
          let arr = ''
          if (selectedRows.length === 0) {
            message.warn('请选择一条数据')
          } else {
            selectedRows.forEach((item: any, index: number) => {
              console.log(item.prod_code)
              if (index === selectedRows.length - 1) {
                arr = arr + `'${item.prod_code}'`
              } else {
                arr = arr + `'${item.prod_code}'` + ','
              }
            })
            setData(encodeURIComponent(arr))
            setVisible(true)
          }
        }}
      >打印</Button>

      <Modal
        title={'打印'}
        visible={visible}
        width="28%"
        style={{ height: 600 }}
        footer={null}
        bodyStyle={{ padding: 24 }}
        onCancel={() => setVisible(false)}
      >
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}
        >
          <Card
            style={{ width: 150, }}
            hoverable
            onClick={() => {
              materialFlowReportQR(data, 'JiaQRCode.cpt');
              setVisible(false)
            }}
            cover={
              <div
                style={{ width: 150, height: 100, position: "relative" }}
              >
                <img alt="example" src={bt1}
                  style={{
                    width: 100, height: 100, transform: 'translateX(-50%)',
                    position: "absolute", top: 20, left: '50%'
                  }}
                />
              </div>
            }
          >
            <div style={{ textAlign: "center", fontSize: 16 }}>
              打印二维码
            </div>
          </Card>
          <Card
            hoverable
            onClick={() => {
              materialFlowReportQR(data, 'PrintJiaMaterial.cpt');
              setVisible(false)
            }}
            style={{ width: 150 }}
            cover={
              <div
                style={{ width: 150, height: 100, position: "relative" }}
              >
                <img alt="example" src={bt2}
                  style={{
                    width: 100, height: 100, transform: 'translateX(-50%)',
                    position: "absolute", top: 20, left: '50%'
                  }}
                />
              </div>
            }
          >
            <div style={{ textAlign: "center", fontSize: 16 }}>
              打印标识牌
            </div>
          </Card>
        </div>
      </Modal>
    </>
  );
};

export default PrintButton;
