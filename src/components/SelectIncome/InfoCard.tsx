import React from 'react';
import { Button } from 'antd';

interface ProjectRecord {
  wbs_code?: string;
  contract_no?: string;
  user_name?: string;
  owner_name?: string;
  owner_group_str?: string;
  owner_unit_name?: string;
  project_location?: string;
  contract_name?: string;
  [key: string]: any;
}

interface ProjectInfoCardProps {
  record?: ProjectRecord;
  setIncomeInfoWbsNameOpen: () => void;
}

const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({
  record = {},
  setIncomeInfoWbsNameOpen,
}) => {
  return (
    <div
      className="info-card"
      style={{
        width: "100%",
        border: "1px solid #ccc",
        borderRadius: "6px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* 卡片标题栏 */}
      <div
        className="card-header"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid #eee",
          backgroundColor: "#f9f9f9",
        }}
      >
        <i
          className="fa fa-info-circle"
          style={{ color: "#1890ff", marginRight: "8px" }}
        />
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 600,
            margin: 0,
            color: "#333",
          }}
        >
          项目信息详情
        </h2>
        <Button
          size="small"
          onClick={setIncomeInfoWbsNameOpen}
          style={{ marginLeft: "auto" }}
          type="primary"
        >
          重新选择
        </Button>
      </div>

      {/* 信息内容区域 - 三列布局 */}
      <div
        className="card-content"
        style={{
          padding: "16px",
        }}
      >
        {/* 第一行：三个信息项 */}
        <div
          className="info-row"
          style={{
            display: "flex",
            marginBottom: "16px",
            paddingBottom: "16px",
            borderBottom: "1px dashed #eee",
          }}
        >
          <div
            className="info-item"
            style={{
              flex: 1,
              padding: "0 8px",
            }}
          >
            <span style={{ color: "#666", marginRight: "4px" }}>合同名称：</span>
            <span style={{ color: "#333" }}>{record.contract_name || '无数据'}</span>
          </div>
          <div
            className="info-item"
            style={{
              flex: 1,
              padding: "0 8px",
            }}
          >
            <span style={{ color: "#666", marginRight: "4px" }}>合同编号：</span>
            <span style={{ color: "#333" }}>{record.contract_no || '无数据'}</span>
          </div>
          <div
            className="info-item"
            style={{
              flex: 1,
              padding: "0 8px",
            }}
          >
            <span style={{ color: "#666", marginRight: "4px" }}>合同获取方式：</span>
            <span style={{ color: "#333" }}>{record.bidding_mode_str || '无数据'}</span>
          </div>
        </div>

        {/* 第二行：三个信息项 */}
        <div
          className="info-row"
          style={{
            display: "flex",
            marginBottom: "16px",
            paddingBottom: "16px",
            borderBottom: "1px dashed #eee",
          }}
        >
          <div
            className="info-item"
            style={{
              flex: 1,
              padding: "0 8px",
            }}
          >
            <span style={{ color: "#666", marginRight: "4px" }}>计价方式：</span>
            <span style={{ color: "#333" }}>{record.valuation_mode_name || '无数据'}</span>
          </div>
          <div
            className="info-item"
            style={{
              flex: 1,
              padding: "0 8px",
            }}
          >
            <span style={{ color: "#666", marginRight: "4px" }}>合同开工日期：</span>
            <span style={{ color: "#333" }}>{record.contract_start_date_str || '无数据'}</span>
          </div>
          <div
            className="info-item"
            style={{
              flex: 1,
              padding: "0 8px",
            }}
          >
            <span style={{ color: "#666", marginRight: "4px" }}>合同完工日期：</span>
            <span style={{ color: "#333" }}>{record.contract_end_date_str || '无数据'}</span>
          </div>
        </div>

        {/* 第三行：三个信息项 */}
        <div
          className="info-row"
          style={{
            display: "flex",
          }}
        >
          <div
            className="info-item"
            style={{
              flex: 1,
              padding: "0 8px",
            }}
          >
            <span style={{ color: "#666", marginRight: "4px" }}>合同签订日期：</span>
            <span style={{ color: "#333" }}>{record.contract_sign_date_str || '无数据'}</span>
          </div>
          <div
            className="info-item"
            style={{
              flex: 1,
              padding: "0 8px",
            }}
          >
            <span style={{ color: "#666", marginRight: "4px" }}>合同含税金额(元)：</span>
            <span style={{ color: "#333" }}>{record.contract_say_price || '无数据'}</span>
          </div>
          <div
            className="info-item"
            style={{
              flex: 1,
              padding: "0 8px",
            }}
          >
            <span style={{ color: "#666", marginRight: "4px" }}>合同不含税金额(元)：</span>
            <span style={{ color: "#333" }}>{record.contract_un_say_price || '无数据'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoCard;
