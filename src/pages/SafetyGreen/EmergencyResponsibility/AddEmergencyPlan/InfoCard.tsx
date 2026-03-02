import React from 'react';
import { Button, Space } from 'antd';
import { useIntl } from 'umi';
import ContractDetails from './EmergencyPlanDetail/ContractDetails';

interface ProjectRecord {
  [key: string]: any;
}

interface ProjectInfoCardProps {
  isDetail: boolean;
  record?: ProjectRecord;
  setIncomeInfoWbsNameOpen: () => void;
  handleCancel: () => void;
}

/**
 * 显示详情
 * @param param
 * @returns 
 */
const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({
  record = {},
  setIncomeInfoWbsNameOpen,
  handleCancel,
  isDetail
}) => {
  const { formatMessage } = useIntl();
  // 将需要展示的额外字段打包，便于渲染
  const additionalDetails = [
    { label: formatMessage({ id: "emergencyplan.plan_name" }), value: record.plan_name },
    { label: formatMessage({ id: "emergencyplan.applicable_area" }), value: record.applicable_area },
    { label: formatMessage({ id: "emergencyplan.scene" }), value: record.scene },
    { label: formatMessage({ id: "emergencyplan.punishment_principle" }), value: record.punishment_principle },
    // { label: formatMessage({ id: "emergencyplan.disposal_process" }), value: record.disposal_process },
  ];


  interface DetailItemType {
    label: string;
    value: string | undefined | null;
  }

  /**
   * 通用函数：将一维数组按指定大小分组为二维数组。
   * @param array 原始数组
   * @param size 每组（行）的大小
   */
  const chunkArray = (array: DetailItemType[], size: number): DetailItemType[][] => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };

  /**
   * 渲染每行三个字段的详细信息。
   * @param additionalDetails 包含 {label, value} 的详细信息数组。
   */
  const renderThreeColumnRow = (additionalDetails: DetailItemType[]) => {
    // 1. 进行分组
    const chunkedDetails = chunkArray(additionalDetails, 3);

    return (
      <div>
        {chunkedDetails.map((rowItems, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="info-row"
            style={{
              display: "flex",
              marginBottom: rowIndex < chunkedDetails.length - 1 ? "16px" : "0",
              paddingBottom: rowIndex < chunkedDetails.length - 1 ? "16px" : "0",
              borderBottom: rowIndex < chunkedDetails.length - 1 ? "1px dashed #eee" : "none",
            }}
          >
            {rowItems.map((item, colIndex) => {
              if (colIndex === 0 && rowIndex === 0) {
                return (
                  <div
                    key={`item-${rowIndex}-${colIndex}`}
                    className="info-item"
                    style={{
                      flex: 1,
                      padding: "0 8px",
                    }}
                  >
                    <ContractDetails
                      record={record}
                    >
                      <span style={{ color: "#666", marginRight: "4px" }}>{item.label}：</span>
                      <span style={{ color: "#333" }}>{item.value || '无数据'}</span>
                    </ContractDetails>
                  </div>

                )
              } else {
                return (
                  <div
                    key={`item-${rowIndex}-${colIndex}`}
                    className="info-item"
                    style={{
                      flex: 1,
                      padding: "0 8px",
                    }}
                  >
                    <span style={{ color: "#666", marginRight: "4px" }}>{item.label}：</span>
                    <span style={{ color: "#333" }}>{item.value || '无数据'}</span>
                  </div>
                )
              }

            })}

            {/* 4. 填充空白列  */}
            {Array(3 - rowItems.length).fill(null).map((_, placeholderIndex) => (
              <div
                key={`placeholder-${rowIndex}-${placeholderIndex}`}
                style={{ flex: 1, padding: "0 8px" }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

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
        {
          !isDetail && (
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
          )
        }

      </div>

      {/* 信息内容区域 - 三列布局 */}
      <div
        className="card-content"
        style={{
          padding: "16px",
        }}
      >
        {renderThreeColumnRow(additionalDetails)}
      </div>
    </div>
  );
};

export default ProjectInfoCard;
