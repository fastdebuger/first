import React from 'react';
import { Button, Space } from 'antd';
import { useIntl } from 'umi';

export interface ProjectRecord {
  [key: string]: any;
}

interface ProjectInfoCardProps {
  record?: ProjectRecord;
  setIncomeInfoWbsNameOpen: () => void;
  handleCancel: () => void;
}

/**
 * 卡片展示详情
 * @param param0
 * @returns 
 */
const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({
  record = {},
  setIncomeInfoWbsNameOpen,
  handleCancel,
}) => {
  const { formatMessage } = useIntl();

  const infoConfigs = [
    { label: formatMessage({ id: "contract.owner_unit_name" }), value: 'owner_unit_name' },
    { label: formatMessage({ id: "contract.contract_no2" }), value: 'contract_no' },
    { label: formatMessage({ id: "contract.wbs_code" }), value: 'wbs_code' },
    { label: formatMessage({ id: "contract.user_name" }), value: 'user_name' },
    { label: formatMessage({ id: "contract.owner_name" }), value: 'owner_name' },
    { label: formatMessage({ id: "contract.owner_group_str" }), value: 'owner_group_str' },
    { label: formatMessage({ id: "contract.owner_unit_name" }), value: 'owner_unit_name' },
    { label: formatMessage({ id: "contract.project_location" }), value: 'project_location' },
    { label: formatMessage({ id: "contract.contract_name" }), value: 'contract_name' },
    { label: formatMessage({ id: "contract.scope_fo_work" }), value: 'scope_fo_work' },
    { label: formatMessage({ id: "contract.contract_mode_str" }), value: 'contract_mode_str' },
    { label: formatMessage({ id: "contract.bidding_mode" }), value: 'bidding_mode_str' },
    { label: formatMessage({ id: "contract.valuation_mode" }), value: 'valuation_mode_name' },
    { label: formatMessage({ id: "contract.contract_start_date_str" }), value: 'contract_start_date_str' },
    { label: formatMessage({ id: "contract.contract_end_date_str" }), value: 'contract_end_date_str' },
    { label: formatMessage({ id: "contract.contract_say_price" }), value: 'contract_say_price' },
    { label: formatMessage({ id: "contract.contract_un_say_price" }), value: 'contract_un_say_price' },
    { label: formatMessage({ id: "contract.contract_sign_date_str" }), value: 'contract_sign_date_str' },
    { label: formatMessage({ id: "contract.project_level" }), value: 'project_level_str' },
    { label: formatMessage({ id: "contract.project_category" }), value: 'project_category_str' },
    { label: formatMessage({ id: "contract.specialty_type" }), value: 'specialty_type_str' },
    { label: formatMessage({ id: "contract.revenue_method" }), value: 'revenue_method_str' },
    // { label: formatMessage({ id: "contract.relative_person_code" }), value: 'relative_person_code' },
    {
      label: formatMessage({ id: "contract.scanning_file_url" }),
      value: 'file_url',
      render: (text: any) => text ? <Button size="small" type="link" onClick={() => window.open(text)} style={{ padding: 0 }}>下载文件</Button> : '-'
    },
    {
      label: formatMessage({ id: "contract.others_file_url" }),
      value: 'others_file_url',
      render: (text: any) => text ? <Button size="small" type="link" onClick={() => window.open(text)} style={{ padding: 0 }}>下载文件</Button> : '-'
    },
    { label: formatMessage({ id: "contract.remark" }), value: 'remark' },
    { label: formatMessage({ id: "contract.form_maker_code" }), value: 'form_maker_code' },
    { label: formatMessage({ id: "contract.form_maker_name" }), value: 'form_maker_name' },
    { label: formatMessage({ id: "contract.form_make_time" }), value: 'form_make_time_str' },
    { label: formatMessage({ id: "contract.settlement_management_id" }), value: 'settlement_management_id_str' },
  ];

  return (
    <div
      style={{
        width: "100%",
        border: "1px solid #ccc",
        borderRadius: "6px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      {/* 头部展示 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid #eee",
          backgroundColor: "#f9f9f9",
        }}
      >
        <i className="fa fa-info-circle" style={{ color: "#1890ff", marginRight: "8px" }} />
        <h2 style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>
          {formatMessage({ id: "contract.detail_title", defaultMessage: "合同信息详情" })}
        </h2>
        <Space style={{ marginLeft: "auto" }}>
          <Button size="small" onClick={setIncomeInfoWbsNameOpen} type="primary">
            {formatMessage({ id: "common.reselect", defaultMessage: "重新选择" })}
          </Button>
          <Button danger size="small" onClick={handleCancel} type="primary">
            {formatMessage({ id: "common.close", defaultMessage: "关闭" })}
          </Button>
        </Space>
      </div>

      {/* 内容区域 */}
      <div style={{ padding: "16px 8px", display: "flex", flexWrap: "wrap" }}>
        {infoConfigs.map((item, index) => {
          const rawValue = record[item.value];
          const content = item.render 
            ? item.render(rawValue, record) 
            : (rawValue !== undefined && rawValue !== null ? String(rawValue) : '-');

          return (
            <div
              key={item.value + index}
              style={{
                width: "33.33%",
                padding: "12px 8px",
                fontSize: "14px",
                // 虚线边框逻辑
                borderBottom: index < infoConfigs.length - 3 ? "1px dashed #eee" : "none"
              }}
            >
              <span style={{ color: "#666", marginRight: "4px" }}>{item.label}：</span>
              <span style={{ color: "#333", fontWeight: 500 }}>{content}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectInfoCard;