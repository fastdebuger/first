import React, { useState } from "react";
import { connect } from "umi";
import { SingleTable } from "yayang-ui";
import { Tag } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 数据驾驶舱数据详情
 * @param props
 * @constructor
 */
const KnowledgeBaseDetail: React.FC<any> = (props) => {
  const { engineeringData = {}, indicatorsData = {} } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="id"
        title={indicatorsData?.length ? '市场开发完成情况详情' : "各类工程占比详情"}
        columns={[]}
        open={open}
        onClose={() => setOpen(false)}
        selectedRecord={{}}
        buttonToolbar={undefined}
      >
        {/* 市场开发完成情况详情 */}
        {Array.isArray(indicatorsData) && indicatorsData.length > 0 ? (
          <div style={{ padding: '10px 20px' }}>
            {/* 动态列表展示 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {indicatorsData
                .sort((a: any, b: any) => b.engineering_value - a.engineering_value)
                .map((item: any, index: number) => {

                  return (
                    <div key={item.id} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '500', color: '#262626' }}>{index + 1}.{item.engineering_name}</span>
                        <span style={{ fontWeight: 'bold' }}>{item.engineering_value} <small>亿元</small></span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          ""
        )}
        {/* 各类工程占比详情 */}
        {Array.isArray(engineeringData) && engineeringData.length > 0 ? (
          <div style={{ padding: '10px 10px' }}>
            <div style={{
              background: '#f0f7ff',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #bae7ff'
            }}>
              <div style={{ color: '#8c8c8c', fontSize: '12px' }}>工程业务总额</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {engineeringData.reduce((sum: number, item: any) => sum + (Number(item.engineering_value) || 0), 0).toFixed(2)}
                <span style={{ fontSize: '14px', marginLeft: '4px' }}>亿元</span>
              </div>
            </div>

            {/* 动态列表展示 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {engineeringData
                .sort((a: any, b: any) => b.engineering_value - a.engineering_value)
                .map((item: any, index: number) => {

                  return (
                    <div key={item.id} style={{ borderBottom: '1px solid #f0f0f0', padding: 8, paddingBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '500', color: '#262626' }}>{index + 1}.{item.engineering_name}</span>
                        <span style={{ fontWeight: 'bold' }}>{item.engineering_value} <small>亿元</small></span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          ""
        )}
      </CrudQueryDetailDrawer>
      <Tag
        color={'#40a9ff'}
        icon={<InfoCircleOutlined />}
        onClick={() => setOpen(true)}
      >
        详情
      </Tag>
    </>
  );
};

export default connect()(KnowledgeBaseDetail);
