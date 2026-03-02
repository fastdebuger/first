import React, { useMemo } from 'react';
import { Card, Collapse, Typography, Space, Tag } from 'antd';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import { history, useLocation } from 'umi';
import styles from './index.less';

const { Panel } = Collapse;
const { Title, Text } = Typography;

/**
 * 质量月报模块概览组件
 *
 * 功能说明：
 * 1. 展示质量月报的七个大模块及其所有子模块
 * 2. 支持模块和子模块的点击跳转功能
 * 3. 自动识别当前路由前缀（subComp/branchComp/dep），动态生成跳转路径
 * 4. 使用卡片式布局，支持子模块的折叠展开
 *
 * 模块列表：
 * - 工程产品总体质量情况（3个子模块）
 * - 质量体系运行情况（无子模块）
 * - 开展主要质量活动（3个子模块）
 * - 质量数据统计分析及采取措施（包含分组子模块）
 * - 严重不合格品及质量事故情况（2个子模块）
 * - 工作安排及建议（无子模块）
 * - 质量经验分享（无子模块）
 */
const QualityMonthlyReportOverview: React.FC<any> = () => {
  // 获取当前路由位置信息，用于识别路由前缀
  const location = useLocation();

  /**
   * 获取当前路由前缀
   * 根据路径判断当前是在公司(subComp)、分公司(branchComp)还是项目部(dep)路由下
   * @returns {string} 路由前缀：'subComp' | 'branchComp' | 'dep'
   */
  // 使用 useMemo 缓存路由前缀，避免重复计算
  const routePrefix = useMemo(() => {
    const pathname = location.pathname;
    if (pathname.startsWith('/subComp/')) return 'subComp';
    if (pathname.startsWith('/branchComp/')) return 'branchComp';
    if (pathname.startsWith('/dep/')) return 'dep';
    return 'subComp'; // 默认返回公司路由前缀
  }, [location.pathname]);

  /**
   * 生成完整路径的辅助函数
   * 根据相对路径和当前路由前缀生成完整的路由路径
   * @param {string} relativePath - 相对路径，例如：'overallQualityProducts/overallQualityProductsView'
   * @returns {string} 完整路径，例如：'/subComp/quality/qualityReport/overallQualityProducts/overallQualityProductsView'
   */
  const getPath = (relativePath: string) => {
    return `/${routePrefix}/quality/qualityReport/${relativePath}`;
  };

  /**
   * 模块数据配置
   * 定义七个大模块及其子模块的结构化数据
   * 使用 useMemo 缓存，当路由前缀变化时重新计算
   */
  const moduleData = useMemo(() => [
    /**
     * 模块1：工程产品总体质量情况
     * 包含3个子模块：概述、自产产品、技术服务
     */
    {
      key: 'overallQualityProducts', // 模块唯一标识
      title: '工程产品总体质量情况', // 模块标题
      icon: '📊', // 模块图标
      hasSubModules: true, // 是否有子模块
      subModules: [
        {
          key: 'overallQualityProductsView', // 子模块唯一标识
          title: '工程产品总体质量情况概述', // 子模块标题
          relativePath: 'overallQualityProducts/overallQualityProductsView', // 相对路径，用于生成完整路由
        },
        {
          key: 'qualityProducedProducts',
          title: '自产产品制造质量情况',
          relativePath: 'overallQualityProducts/qualityProducedProducts',
        },
        {
          key: 'qualityTechServiceQuality',
          title: '技术服务质量情况',
          relativePath: 'overallQualityProducts/qualityTechServiceQuality',
        },
      ],
    },
    /**
     * 模块2：质量体系运行情况
     * 无子模块，点击卡片直接跳转
     */
    {
      key: 'qualitySystemOperation',
      title: '质量体系运行情况',
      icon: '⚙️',
      hasSubModules: false, // 无子模块
      relativePath: 'qualitySystemOperation', // 直接跳转路径
    },
    /**
     * 模块3：开展主要质量活动
     * 包含3个子模块：质量大检查、创优活动、QC小组活动
     */
    {
      key: 'qualityActivities',
      title: '开展主要质量活动',
      icon: '🎯',
      hasSubModules: true,
      subModules: [
        {
          key: 'qualityInspection',
          title: '质量大检查及专项检查情况',
          relativePath: 'qualityActivities/qualityInspection',
        },
        {
          key: 'qualityExcellenceActivity',
          title: '创优活动开展情况',
          relativePath: 'qualityActivities/qualityExcellenceActivity',
        },
        {
          key: 'qualityQcActivity',
          title: 'QC小组活动开展情况',
          relativePath: 'qualityActivities/qualityQcActivity',
        },
      ],
    },
    /**
     * 模块4：质量数据统计分析及采取措施
     * 包含分组子模块和普通子模块
     * 其中"质量数据统计"是一个分组，包含5个子项
     */
    {
      key: 'qualityDataAnalysis',
      title: '质量数据统计分析及采取措施',
      icon: '📈',
      hasSubModules: true,
      subModules: [
        /**
         * 分组子模块：质量数据统计
         * isGroup: true 表示这是一个分组，包含多个子项
         */
        {
          key: 'qualityDataStatistics',
          title: '质量数据统计',
          isGroup: true, // 标记为分组
          children: [ // 分组下的子项列表
            {
              key: 'qualityNcCorrectiveAction',
              title: '不合格项纠正措施记录',
              relativePath: 'qualityDataAnalysis/qualityDataStatistics/qualityNcCorrectiveAction',
            },
            {
              key: 'qualityInspectionSummary',
              title: '质量大(专项)检查主要不合格项汇总情况分布',
              relativePath: 'qualityDataAnalysis/qualityDataStatistics/qualityInspectionSummary',
            },
            {
              key: 'qualityMonthlyWeldingPassRate',
              title: '月度焊接一次合格率统计表',
              relativePath: 'qualityDataAnalysis/qualityDataStatistics/qualityMonthlyWeldingPassRate',
            },
            {
              key: 'qualityAccidentSummary',
              title: '质量事故汇总表',
              relativePath: 'qualityDataAnalysis/qualityDataStatistics/qualityAccidentSummary',
            },
            {
              key: 'qualityMonthlyQualityStatistics',
              title: '质量数据统计表',
              relativePath: 'qualityDataAnalysis/qualityDataStatistics/qualityMonthlyQualityStatistics',
            },
          ],
        },
        // 普通子模块：其它质量数据统计情况
        {
          key: 'qualityOtherQualityStatistics',
          title: '其它质量数据统计情况',
          relativePath: 'qualityDataAnalysis/qualityOtherQualityStatistics',
        },
        // 普通子模块：质量统计数据分析情况
        {
          key: 'qualityStatisticsAnalysis',
          title: '质量统计数据分析情况',
          relativePath: 'qualityDataAnalysis/qualityStatisticsAnalysis',
        },
      ],
    },
    /**
     * 模块5：严重不合格品及质量事故情况
     * 包含2个子模块：严重不合格品、质量事故
     */
    {
      key: 'criticalNonconformities',
      title: '严重不合格品及质量事故情况',
      icon: '⚠️',
      hasSubModules: true,
      subModules: [
        {
          key: 'qualitySeriousNonconformities',
          title: '本月严重不合格品情况',
          relativePath: 'criticalNonconformities/qualitySeriousNonconformities',
        },
        {
          key: 'qualityIncidentDetails',
          title: '质量事故情况',
          relativePath: 'criticalNonconformities/qualityIncidentDetails',
        },
      ],
    },
    /**
     * 模块6：工作安排及建议
     * 无子模块，点击卡片直接跳转
     */
    {
      key: 'qualityWorkArrangement',
      title: '工作安排及建议',
      icon: '📋',
      hasSubModules: false,
      relativePath: 'qualityWorkArrangement',
    },
    /**
     * 模块7：质量经验分享
     * 无子模块，点击卡片直接跳转
     */
    {
      key: 'qualityExperience',
      title: '质量经验分享',
      icon: '💡',
      hasSubModules: false,
      relativePath: 'qualityExperience',
    },
  ], []); // 模块数据不依赖外部变量，只需初始化一次

  /**
   * 处理模块卡片点击事件
   * 仅当模块没有子模块时，点击卡片直接跳转到对应页面
   * @param {any} module - 模块数据对象
   */
  const handleModuleClick = (module: any) => {
    // 只有没有子模块的模块才支持点击跳转
    if (!module.hasSubModules && module.relativePath) {
      history.push(getPath(module.relativePath));
    }
  };

  /**
   * 处理子模块点击事件
   * 点击子模块项时跳转到对应的页面
   * @param {string} relativePath - 子模块的相对路径
   */
  const handleSubModuleClick = (relativePath: string) => {
    if (relativePath) {
      history.push(getPath(relativePath));
    }
  };

  return (
    <div className={styles.container}>
      {/* 页面头部：标题和说明 */}
      <div className={styles.header}>
        <Title level={2}>质量月报模块概览</Title>
        <Text type="secondary">点击模块或子模块可快速跳转到对应页面</Text>
      </div>

      {/* 模块网格布局容器 */}
      <div className={styles.modulesGrid}>
        {moduleData.map((module) => (
          <Card
            key={module.key} // 使用模块key作为唯一标识
            className={styles.moduleCard} // 模块卡片样式
            hoverable={!module.hasSubModules} // 无子模块的卡片支持悬停效果
            onClick={() => handleModuleClick(module)} // 点击事件处理
            style={{
              cursor: module.hasSubModules ? 'default' : 'pointer', // 有子模块时显示默认光标，无子模块时显示手型光标
            }}
          >
            {/* 模块头部：图标、标题和子模块数量标签 */}
            <div className={styles.moduleHeader}>
              <Space size="middle">
                <span className={styles.moduleIcon}>{module.icon}</span>
                <Title level={4} className={styles.moduleTitle}>
                  {module.title}
                </Title>
              </Space>
              {/* 如果有子模块，显示子模块数量标签 */}
              {module.hasSubModules && (
                <Tag color="blue">{module.subModules?.length || 0} 个子模块</Tag>
              )}
            </div>

            {/* 子模块容器：使用折叠面板展示子模块列表 */}
            {module.hasSubModules && module.subModules && (
              <div className={styles.subModulesContainer}>
                <Collapse
                  ghost // 使用幽灵模式，无边框背景
                  expandIcon={({ isActive }) => (
                    // 自定义展开/收起图标：展开时显示向下箭头，收起时显示向右箭头
                    isActive ? <DownOutlined /> : <RightOutlined />
                  )}
                  className={styles.collapse}
                >
                  {module.subModules.map((subModule: any) => {
                    // 判断是否为分组子模块（包含children数组）
                    if (subModule.isGroup && subModule.children) {
                      // 渲染分组子模块：使用Panel组件，支持折叠展开
                      return (
                        <Panel
                          key={subModule.key}
                          header={
                            <Space>
                              <Text strong>{subModule.title}</Text>
                              {/* 显示分组下的子项数量 */}
                              <Tag color="cyan">{subModule.children.length} 项</Tag>
                            </Space>
                          }
                          className={styles.groupPanel}
                        >
                          {/* 分组子项列表 */}
                          <div className={styles.groupChildren}>
                            {subModule.children.map((child: any) => (
                              <div
                                key={child.key}
                                className={styles.subModuleItem}
                                onClick={(e) => {
                                  // 阻止事件冒泡，避免触发父元素的折叠/展开
                                  e.stopPropagation();
                                  // 跳转到子模块页面
                                  handleSubModuleClick(child.relativePath);
                                }}
                              >
                                <Space>
                                  {/* 子项前的箭头图标 */}
                                  <RightOutlined style={{ fontSize: '12px', color: '#1890ff' }} />
                                  <Text
                                    className={styles.subModuleLink}
                                  >
                                    {child.title}
                                  </Text>
                                </Space>
                              </div>
                            ))}
                          </div>
                        </Panel>
                      );
                    } else {
                      // 渲染普通子模块：直接显示为可点击的列表项
                      return (
                        <div
                          key={subModule.key}
                          className={styles.subModuleItem}
                          onClick={(e) => {
                            // 阻止事件冒泡
                            e.stopPropagation();
                            // 跳转到子模块页面
                            handleSubModuleClick(subModule.relativePath);
                          }}
                        >
                          <Space>
                            {/* 子模块前的箭头图标 */}
                            <RightOutlined style={{ fontSize: '12px', color: '#1890ff' }} />
                            <Text
                              className={styles.subModuleLink}
                            >
                              {subModule.title}
                            </Text>
                          </Space>
                        </div>
                      );
                    }
                  })}
                </Collapse>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QualityMonthlyReportOverview;
