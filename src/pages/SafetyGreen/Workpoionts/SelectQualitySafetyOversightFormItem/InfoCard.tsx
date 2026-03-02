import React from 'react';
import { Button, Space } from 'antd';

interface ProjectRecord {
  [key: string]: any;
}

interface ProjectInfoCardProps {
  record?: ProjectRecord;
  setIncomeInfoWbsNameOpen: () => void;
  handleCancel: () => void;
}

/**
 * 质量显示详情
 * @param param
 * @returns 
 */
const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({
  record = {},
  setIncomeInfoWbsNameOpen,
  handleCancel,
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
        <Space
          style={{ marginLeft: "auto" }}
        >
          <Button
            size="small"
            onClick={setIncomeInfoWbsNameOpen}
            type="primary"
          >
            重新选择
          </Button>
          <Button
            danger
            size="small"
            onClick={handleCancel}
            type="primary"
          >
            关闭
          </Button>
        </Space>
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
            <span style={{ color: "#666", marginRight: "4px" }}>问题来源：</span>
            <span style={{ color: "#333" }}>{record.problem_obs_name || '无数据'}</span>
          </div>
          <div
            className="info-item"
            style={{
              flex: 1,
              padding: "0 8px",
            }}
          >
            <span style={{ color: "#666", marginRight: "4px" }}>工程名称：</span>
            <span style={{ color: "#333" }}>{record.project_name || '无数据'}</span>
          </div>
          <div
            className="info-item"
            style={{
              flex: 1,
              padding: "0 8px",
            }}
          >
            <span style={{ color: "#666", marginRight: "4px" }}>问题描述：</span>
            <span style={{ color: "#333" }}>{record.problem_description || '无数据'}</span>
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
            <span style={{ color: "#666", marginRight: "4px" }}>检查日期：</span>
            <span style={{ color: "#333" }}>{record.check_date_str || '无数据'}</span>
          </div>
          <div
            className="info-item"
            style={{
              flex: 1,
              padding: "0 8px",
            }}
          >
            <span style={{ color: "#666", marginRight: "4px" }}>上传日期：</span>
            <span style={{ color: "#333" }}>{record.upload_date_str || '无数据'}</span>


          </div>
          <div
            className="info-item"
            style={{
              flex: 1,
              padding: "0 8px",
            }}
          >
            <span style={{ color: "#666", marginRight: "4px" }}>问题类别：</span>
            <span style={{ color: "#333" }}>{record.problem_category_str || '无数据'}</span>
          </div>
        </div>

        {/* 第三行：三个信息项 */}
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
            <span style={{ color: "#666", marginRight: "4px" }}>责任单位归属：</span>
            <span style={{ color: "#333" }}>{record.responsible_unit_str || '无数据'}</span>
          </div>
          <div
            className="info-item"
            style={{
              flex: 1,
              padding: "0 8px",
            }}
          >
            <span style={{ color: "#666", marginRight: "4px" }}>问题严重程度：</span>
            <span style={{ color: "#333" }}>{record.severity_level_str || '无数据'}</span>
          </div>
          <div
            className="info-item"
            style={{
              flex: 1,
              padding: "0 8px",
            }}
          >
            <span style={{ color: "#666", marginRight: "4px" }}>问题归属系统：</span>
            <span style={{ color: "#333" }}>{record.system_belong_str || '无数据'}</span>
          </div>
        </div>


        {/* 第四行：1个信息项 */}
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
            <span style={{ color: "#666", marginRight: "4px" }}>检查单位：</span>
            <span style={{ color: "#333" }}>{record.examine_wbs_name || '无数据'}</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectInfoCard;
