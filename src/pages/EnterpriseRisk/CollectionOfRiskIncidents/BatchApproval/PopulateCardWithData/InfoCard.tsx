import React from 'react';
import { Button, Space } from 'antd';

/**
 * 项目记录数据接口定义
 */
export interface ProjectRecord {
  contract_name?: string;           // 合同名称
  contract_no?: string;             // 合同系统2.0合同编号
  wbs_code?: string;                // WBS项目定义
  valuation_mode_name?: string;     // 计价方式
  contract_start_date_str?: string; // 合同开工日期
  contract_end_date_str?: string;   // 合同完工日期
  contract_sign_date_str?: string;  // 合同签订日期
  contract_say_price?: string | number;    // 合同含税金额
  contract_un_say_price?: string | number; // 合同不含税金额
  [key: string]: any;
}

interface ProjectInfoCardProps {
  record?: ProjectRecord;
  setIncomeInfoWbsNameOpen: () => void;
  handleCancel: () => void;
  infoConfigs?: { label: string, value: string }[];
  operate?: 'add' | 'edit';
}

/**
 * 卡片列表
 * @param param
 * @returns
 */
const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({
  operate,
  record = {},
  setIncomeInfoWbsNameOpen,
  handleCancel,
  infoConfigs = [
    { label: '合同名称', value: 'contract_name' },
    { label: '合同系统2.0合同编号', value: 'contract_no' },
    { label: 'WBS项目定义', value: 'wbs_code' },
    { label: '计价方式', value: 'valuation_mode_name' },
    { label: '合同开工日期', value: 'contract_start_date_str' },
    { label: '合同完工日期', value: 'contract_end_date_str' },
    { label: '合同签订日期', value: 'contract_sign_date_str' },
    { label: '合同含税金额(元)', value: 'contract_say_price' },
    { label: '合同不含税金额(元)', value: 'contract_un_say_price' },
  ]
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
        backgroundColor: "#fff",
      }}
    >
      {/* 卡片头部 */}
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
        <i className="fa fa-info-circle" style={{ color: "#1890ff", marginRight: "8px" }} />
        <h2 style={{ fontSize: "16px", fontWeight: 600, margin: 0, color: "#333" }}>
          合同信息详情
        </h2>
        {operate != 'edit' && (
          <Space style={{ marginLeft: "auto" }}>
            <Button size="small" onClick={setIncomeInfoWbsNameOpen} type="primary">
              重新选择
            </Button>
            <Button danger size="small" onClick={handleCancel} type="primary">
              关闭
            </Button>
          </Space>
        )}
      </div>

      <div
        className="card-content"
        style={{
          padding: "16px 8px",
          display: "flex",
          flexWrap: "wrap"
        }}
      >
        {infoConfigs.map((item, index, infoConfigs) => (
          <div
            key={item.value}
            style={{
              width: "33.33%",
              padding: "12px 8px",
              fontSize: "14px",
              borderBottom: index < infoConfigs.length - 3 ? "1px dashed #eee" : "none"
            }}
          >
            <span style={{ color: "#666", marginRight: "4px" }}>{item.label}：</span>
            <span style={{ color: "#333" }}>{record[item.value] || '无数据'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectInfoCard;
