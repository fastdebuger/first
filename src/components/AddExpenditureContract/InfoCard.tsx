import React from 'react';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { numberToChinese } from '@/utils/utils';
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import type { SelectedExpenditureContract } from './index';

export interface InfoCardProps {
  record: SelectedExpenditureContract;
  isReadonly?: boolean;
  onClear?: () => void;
  progressData?: any[];
  visaData?: any[];
  showEmptyState?: boolean; // 是否显示空状态（当数据为空时），默认 false
}

/**
 * 分包合同信息卡片组件
 */
const InfoCard: React.FC<InfoCardProps> = ({
  record,
  isReadonly = false,
  onClear,
  progressData = [],
  visaData = [],
  showEmptyState = false
}) => {
  console.log(progressData, 'progressData');
  return (
    <>
      <div
        className="info-card"
        style={{
          width: "100%",
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
            合同信息详情
          </h2>
          {onClear && !isReadonly && (
            <Button
              size="small"
              onClick={onClear}
              style={{ marginLeft: "auto" }}
              type="default"
            >
              <CloseOutlined />
            </Button>
          )}
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
              <span style={{ color: "#666", marginRight: "4px" }}>分公司：</span>
              <span style={{ color: "#333" }}>{record.branch_comp_name || '无数据'}</span>
            </div>
            <div
              className="info-item"
              style={{
                flex: 1,
                padding: "0 8px",
              }}
            >
              <span style={{ color: "#666", marginRight: "4px" }}>项目经理部：</span>
              <span style={{ color: "#333" }}>{record.dep_name || '无数据'}</span>
            </div>
            <div
              className="info-item"
              style={{
                flex: 1,
                padding: "0 8px",
              }}
            >
              <span style={{ color: "#666", marginRight: "4px" }}>业主名称：</span>
              <span style={{ color: "#333" }}>{record.owner_name || '无数据'}</span>
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
              <span style={{ color: "#666", marginRight: "4px" }}>分包合同名称：</span>
              <span style={{ color: "#333" }}>{record.contract_out_name || '无数据'}</span>
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
              <span style={{ color: "#666", marginRight: "4px" }}>WBS项目定义：</span>
              <span style={{ color: "#333" }}>{record.income_info_wbs_code || '无数据'}</span>
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
              <span style={{ color: "#666", marginRight: "4px" }}>合同类型：</span>
              <span style={{ color: "#333" }}>{record.contract_type_str || '无数据'}</span>
            </div>
            <div
              className="info-item"
              style={{
                flex: 1,
                padding: "0 8px",
              }}
            >
              <span style={{ color: "#666", marginRight: "4px" }}>合同起始日期：</span>
              <span style={{ color: "#333" }}>{record.contract_start_date_str || '无数据'}</span>
            </div>
            <div
              className="info-item"
              style={{
                flex: 1,
                padding: "0 8px",
              }}
            >
              <span style={{ color: "#666", marginRight: "4px" }}>合同结束日期：</span>
              <span style={{ color: "#333" }}>{record.contract_end_date_str || '无数据'}</span>
            </div>
          </div>
          {/* 第四行：三个信息项 */}
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
              <span style={{ color: "#666", marginRight: "4px" }}>乙方单位名称：</span>
              <span style={{ color: "#333" }}>{record.subletting_enroll_name || '无数据'}</span>
            </div>
            <div
              className="info-item"
              style={{
                flex: 1,
                padding: "0 8px",
              }}
            >
              <span style={{ color: "#666", marginRight: "4px" }}>本月前累计产值：</span>
              <span style={{ color: "#333" }}>{record.pre_total_output_value || '无数据'}</span>
            </div>
            <div
              className="info-item"
              style={{
                flex: 1,
                padding: "0 8px",
              }}
            >
              <span style={{ color: "#666", marginRight: "4px" }}>乙方现场负责人：</span>
              <span style={{ color: "#333" }}>{record.y_site_name || '无数据'}</span>
            </div>
          </div>
          {/* 第五行：三个信息项 */}
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
      {/* 进度数据展示 */}
      {((progressData && progressData.length > 0) || showEmptyState) && (
        <div
          className="info-card"
          style={{
            width: "100%",
            marginTop: "16px",
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
              进度款信息
            </h2>
          </div>

          {/* 信息内容区域 - 三列布局 */}
          <div
            className="card-content"
            style={{
              padding: "16px",
            }}
          >
            {progressData && progressData.length > 0 ? (
              progressData.map((item: any, index: number) => {
                // 判断是否是最后一条记录
                const isLastItem = index === progressData.length - 1;

                return (
                  <div
                    key={item.id || item.RowNumber || index}
                    className="info-row"
                    style={{
                      display: "flex",
                      marginBottom: isLastItem ? 0 : "16px",
                      paddingBottom: isLastItem ? 0 : "16px",
                      borderBottom: isLastItem ? "none" : "1px dashed #eee",
                    }}
                  >
                    <div
                      className="info-item"
                      style={{
                        flex: 1,
                        padding: "0 8px",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "4px" }}>期次：</span>
                      <span style={{ color: "#333" }}>{`第${numberToChinese(item.number)}次进度款` || '无数据'}</span>
                    </div>
                    <div
                      className="info-item"
                      style={{
                        flex: 1,
                        padding: "0 8px",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "4px" }}>审批金额：</span>
                      <span style={{ color: "#333" }}>{item.approval_amount || '无数据'}</span>
                    </div>
                    <div
                      className="info-item"
                      style={{
                        flex: 1,
                        padding: "0 8px",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "4px" }}>审批进度：</span>
                      <span style={{ color: "#333" }}>{item.approval_schedule_str || '无数据'}</span>
                    </div>
                    <div
                      className="info-item"
                      style={{
                        flex: 1,
                        padding: "0 8px",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "4px" }}>是否到账：</span>
                      <span style={{ color: "#333" }}>{item.is_arrival_str || '无数据'}</span>
                    </div>
                    <div
                      className="info-item"
                      style={{
                        flex: 1,
                        padding: "0 8px",
                      }}
                    >
                      <span style={{ color: "#666", marginRight: "4px" }}>附件：</span>
                      {item.file_url ? (
                        <a
                          href={getUrlCrypto(item.file_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1890ff" }}
                        >
                          下载文件
                        </a>
                      ) : (
                        <span style={{ color: "#333" }}>暂无附件</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  padding: "16px",
                  textAlign: "center",
                  color: "#999",
                }}
              >
                当前合同不存在进度款
              </div>
            )}
          </div>
        </div>
      )}
      {/* 签证数据展示 */}
      {((visaData && visaData.length > 0) || showEmptyState) && (
        <div
          className="info-card"
          style={{
            width: "100%",
            marginTop: "16px",
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
              签证信息
            </h2>
          </div>

          {/* 信息内容区域 */}
          <div
            className="card-content"
            style={{
              padding: "16px",
            }}
          >
            {visaData && visaData.length > 0 ? (
              visaData.map((item: any, index: number) => {
                // 判断是否是最后一条记录
                const isLastItem = index === visaData.length - 1;

                return (
                  <div
                    key={item.id || item.RowNumber || index}
                    style={{
                      marginBottom: isLastItem ? 0 : "16px",
                      paddingBottom: isLastItem ? 0 : "16px",
                      borderBottom: isLastItem ? "none" : "1px dashed #eee",
                    }}
                  >
                    {/* 第一行：四个字段 */}
                    <div
                      className="info-row"
                      style={{
                        display: "flex",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        className="info-item"
                        style={{
                          flex: 1,
                          padding: "0 8px",
                        }}
                      >
                        <span style={{ color: "#666", marginRight: "4px" }}>签证编号：</span>
                        <span style={{ color: "#333" }}>{item.visa_code || '无数据'}</span>
                      </div>
                      <div
                        className="info-item"
                        style={{
                          flex: 1,
                          padding: "0 8px",
                        }}
                      >
                        <span style={{ color: "#666", marginRight: "4px" }}>专业：</span>
                        <span style={{ color: "#333" }}>{item.visa_major || '无数据'}</span>
                      </div>
                      <div
                        className="info-item"
                        style={{
                          flex: 1,
                          padding: "0 8px",
                        }}
                      >
                        <span style={{ color: "#666", marginRight: "4px" }}>签证内容：</span>
                        <span style={{ color: "#333" }}>{item.visa_content || '无数据'}</span>
                      </div>
                      <div
                        className="info-item"
                        style={{
                          flex: 1,
                          padding: "0 8px",
                        }}
                      >
                        <span style={{ color: "#666", marginRight: "4px" }}>签证上报金额：</span>
                        <span style={{ color: "#333" }}>{item.visa_budget_amount || '无数据'}</span>
                      </div>
                    </div>
                    {/* 第二行：四个字段 */}
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
                        <span style={{ color: "#666", marginRight: "4px" }}>签证审核金额：</span>
                        <span style={{ color: "#333" }}>{item.visa_review_amount || '无数据'}</span>
                      </div>
                      <div
                        className="info-item"
                        style={{
                          flex: 1,
                          padding: "0 8px",
                        }}
                      >
                        <span style={{ color: "#666", marginRight: "4px" }}>签证日期：</span>
                        <span style={{ color: "#333" }}>{item.visa_date_str || item.visa_date || '无数据'}</span>
                      </div>
                      <div
                        className="info-item"
                        style={{
                          flex: 1,
                          padding: "0 8px",
                        }}
                      >
                        <span style={{ color: "#666", marginRight: "4px" }}>承包商申请签证端口：</span>
                        <span style={{ color: "#333" }}>{item.visa_port || '无数据'}</span>
                      </div>
                      <div
                        className="info-item"
                        style={{
                          flex: 1,
                          padding: "0 8px",
                        }}
                      >
                        <span style={{ color: "#666", marginRight: "4px" }}>合同附件：</span>
                        {item.file_url ? (
                          <a
                            href={getUrlCrypto(item.file_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#1890ff" }}
                          >
                            下载文件
                          </a>
                        ) : (
                          <span style={{ color: "#333" }}>无数据</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  padding: "16px",
                  textAlign: "center",
                  color: "#999",
                }}
              >
                当前合同不存在签证
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default InfoCard;

