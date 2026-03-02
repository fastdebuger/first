import React, { useState } from 'react';
import { Modal, Typography, Button } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './index.less';
import ModuleTable from './ModuleTable';

const { Title, Paragraph } = Typography;

/** 附表配置：质量数据统计表下的五个附表，点击展示 */
const APPENDIX_LIST = [
  { title: '不合格项纠正和预防措施记录', relativePath: 'qualityDataAnalysis/qualityDataStatistics/qualityNcCorrectiveAction' },
  { title: '质量大（专项）检查主要不合格项汇总分布表', relativePath: 'qualityDataAnalysis/qualityDataStatistics/qualityInspectionSummary' },
  { title: '月度焊接一次合格率统计表', relativePath: 'qualityDataAnalysis/qualityDataStatistics/qualityMonthlyWeldingPassRate' },
  { title: '质量事故汇总表', relativePath: 'qualityDataAnalysis/qualityDataStatistics/qualityAccidentSummary' },
  { title: '质量数据统计表', relativePath: 'qualityDataAnalysis/qualityDataStatistics/qualityMonthlyQualityStatistics' },
];

/**
 * 质量月报详情弹窗组件
 * 按 Word 文档格式单页展示，质量数据统计表的五个附表保留点击展示
 */
const QualityMonthlyReportDetail: React.FC<any> = (props) => {
  const { visible, selectedRecord, onClose } = props;

  const [nestedModalVisible, setNestedModalVisible] = useState<boolean>(false);
  const [nestedModalTitle, setNestedModalTitle] = useState<string>('');
  const [nestedModalContent, setNestedModalContent] = useState<React.ReactNode>(null);

  const monthStr = selectedRecord?.month_str || '';

  const openModule = (moduleTitle: string, relativePath: string) => {
    setNestedModalTitle(moduleTitle);
    setNestedModalContent(
      <ModuleTable relativePath={relativePath} selectedRecord={selectedRecord} />
    );
    setNestedModalVisible(true);
  };

  return (
    <>
      <Modal
        title={`质量月报 - ${monthStr}`}
        open={visible}
        onCancel={onClose}
        footer={null}
        width="90%"
        style={{ top: 12 }}
        bodyStyle={{ height: 'calc(100vh - 80px)', padding: 0, overflow: 'auto' }}
        destroyOnClose
        className={styles.qualityMonthlyReportModal}
      >
        <div className={styles.qualityMonthlyReportDetailScope}>
          <div className={styles.wordDoc}>
            {/* 封面 */}
            <header className={styles.docHeader}>
              <div className={styles.companyName}>中国石油工程建设有限公司</div>
              <div className={styles.reportTitle}>质　量　月　报</div>
              <div className={styles.monthWrap}>（{monthStr ? `${monthStr.replace('-', '年')}月` : '　年　月'}）</div>
              <div className={styles.signArea}>
                <div>审批人：{selectedRecord?.approval_user_name || ''}</div>
                <div>审批状态：{selectedRecord?.status_str || ''}</div>
                <div>质量月报生成人：{selectedRecord?.form_maker_name || ''}</div>
                <div>质量月报生成时间：{selectedRecord?.form_make_time_str || ''}</div>
              </div>
            </header>

            {/* 目录 */}
            <section className={styles.section}>
              <Title level={4} className={styles.sectionTitle}>目　录</Title>
              <ul className={styles.tocList}>
                <li>一、工程产品总体质量情况概述</li>
                <li>二、质量体系运行情况</li>
                <li>三、开展主要质量活动</li>
                <li>四、质量数据统计情况</li>
                <li>五、严重不合格品及质量事故情况</li>
                <li>六、工作安排及建议</li>
                <li>七、质量经验分享</li>
              </ul>
            </section>

            {/* 一、工程产品总体质量情况概述 */}
            <section className={styles.section}>
              <Title level={4} className={styles.sectionTitle}>一、工程产品总体质量概述</Title>
              <Paragraph className={styles.hint}>（要求：简要叙述本月在建项目名称数量、机械完工（中交）项目名称数量、投产项目名称数量，本单位总体质量运行情况，本单位开展的主要质量活动，获奖情况等。）</Paragraph>
              <div className={styles.block}>
                <Button type="link" className={styles.linkBtn} icon={<LinkOutlined />} onClick={() => openModule('工程产品总体质量情况概述', 'overallQualityProducts/overallQualityProductsView')}>
                  查看 工程产品总体质量情况概述
                </Button>
              </div>
              <div className={styles.subSection}>
                <Title level={5}>（一）自产产品（装备、设备、产品等）制造质量情况</Title>
                <Button type="link" className={styles.linkBtn} icon={<LinkOutlined />} onClick={() => openModule('自产产品制造质量情况', 'overallQualityProducts/qualityProducedProducts')}>
                  查看 自产产品制造质量情况
                </Button>
              </div>
              <div className={styles.subSection}>
                <Title level={5}>（二）技术服务质量情况</Title>
                <Button type="link" className={styles.linkBtn} icon={<LinkOutlined />} onClick={() => openModule('技术服务质量情况', 'overallQualityProducts/qualityTechServiceQuality')}>
                  查看 技术服务质量情况
                </Button>
              </div>
            </section>

            {/* 二、质量体系运行情况 */}
            <section className={styles.section}>
              <Title level={4} className={styles.sectionTitle}>二、质量体系运行情况</Title>
              <Paragraph className={styles.hint}>（包括与质量管理体系有关的内审、培训、制定、实施、检查、改进过程相关的活动）</Paragraph>
              <div className={styles.block}>
                <Button type="link" className={styles.linkBtn} icon={<LinkOutlined />} onClick={() => openModule('质量体系运行情况', 'qualitySystemOperation')}>
                  查看 质量体系运行情况
                </Button>
              </div>
            </section>

            {/* 三、开展主要质量活动 */}
            <section className={styles.section}>
              <Title level={4} className={styles.sectionTitle}>三、开展主要质量活动</Title>
              <div className={styles.subSection}>
                <Title level={5}>（一）质量大检查及专项检查情况</Title>
                <Button type="link" className={styles.linkBtn} icon={<LinkOutlined />} onClick={() => openModule('质量大检查及专项检查情况', 'qualityActivities/qualityInspection')}>
                  查看 质量大检查及专项检查情况
                </Button>
              </div>
              <div className={styles.subSection}>
                <Title level={5}>（二）创优活动开展情况</Title>
                <Button type="link" className={styles.linkBtn} icon={<LinkOutlined />} onClick={() => openModule('创优活动开展情况', 'qualityActivities/qualityExcellenceActivity')}>
                  查看 创优活动开展情况
                </Button>
              </div>
              <div className={styles.subSection}>
                <Title level={5}>（三）“QC”小组活动开展情况</Title>
                <Button type="link" className={styles.linkBtn} icon={<LinkOutlined />} onClick={() => openModule('QC小组活动开展情况', 'qualityActivities/qualityQcActivity')}>
                  查看 QC小组活动开展情况
                </Button>
              </div>
            </section>

            {/* 四、质量数据统计分析及采取措施 */}
            <section className={styles.section}>
              <Title level={4} className={styles.sectionTitle}>四、质量数据统计分析及采取措施</Title>
              <div className={styles.subSection}>
                <Title level={5}>（一）质量数据统计表</Title>
                <div className={styles.appendixList}>
                  {APPENDIX_LIST.map((item) => (
                    <div key={item.relativePath} className={styles.appendixItem}>
                      <Button type="link" className={styles.linkBtn} icon={<LinkOutlined />} onClick={() => openModule(item.title, item.relativePath)}>
                        {item.title}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.subSection}>
                <Title level={5}>（二）其它质量数据统计情况</Title>
                <Button type="link" className={styles.linkBtn} icon={<LinkOutlined />} onClick={() => openModule('其它质量数据统计情况', 'qualityDataAnalysis/qualityOtherQualityStatistics')}>
                  查看 其它质量数据统计情况
                </Button>
              </div>
              <div className={styles.subSection}>
                <Title level={5}>（三）质量统计数据分析情况</Title>
                <Paragraph className={styles.hint}>（采用各类统计技术对质量数据进行分析及采取的措施，附统计分析记录或图表）</Paragraph>
                <Button type="link" className={styles.linkBtn} icon={<LinkOutlined />} onClick={() => openModule('质量统计数据分析情况', 'qualityDataAnalysis/qualityStatisticsAnalysis')}>
                  查看 质量统计数据分析情况
                </Button>
              </div>
            </section>

            {/* 五、严重不合格品及质量事故情况 */}
            <section className={styles.section}>
              <Title level={4} className={styles.sectionTitle}>五、严重不合格品及质量事故情况</Title>
              <div className={styles.subSection}>
                <Title level={5}>（一）本月严重不合格品情况</Title>
                <Button type="link" className={styles.linkBtn} icon={<LinkOutlined />} onClick={() => openModule('本月严重不合格品情况', 'criticalNonconformities/qualitySeriousNonconformities')}>
                  查看 本月严重不合格品情况
                </Button>
              </div>
              <div className={styles.subSection}>
                <Title level={5}>（二）质量事故情况</Title>
                <Paragraph className={styles.hint}>（注：一般质量事故按月上报见附表四，较大及以上质量事故按公司“质量事故管理办法”规定的时间要求上报。）</Paragraph>
                <Button type="link" className={styles.linkBtn} icon={<LinkOutlined />} onClick={() => openModule('质量事故情况', 'criticalNonconformities/qualityIncidentDetails')}>
                  查看 质量事故情况
                </Button>
              </div>
            </section>

            {/* 六、工作安排及建议 */}
            <section className={styles.section}>
              <Title level={4} className={styles.sectionTitle}>六、工作安排及建议</Title>
              <Paragraph className={styles.hint}>（一）下月质量管理工作安排　（二）质量管理工作意见、建议　（三）需总部协调解决的问题</Paragraph>
              <div className={styles.block}>
                <Button type="link" className={styles.linkBtn} icon={<LinkOutlined />} onClick={() => openModule('工作安排及建议', 'qualityWorkArrangement')}>
                  查看 工作安排及建议
                </Button>
              </div>
            </section>

            {/* 七、质量经验分享 */}
            <section className={styles.section}>
              <Title level={4} className={styles.sectionTitle}>七、质量经验分享（每月一个）</Title>
              <Paragraph className={styles.hint}>（可以是本单位、本行业或者国内外在质量经验方面（正面反面均可）的图片与文字，要求简明扼要、图文匹配）</Paragraph>
              <div className={styles.block}>
                <Button type="link" className={styles.linkBtn} icon={<LinkOutlined />} onClick={() => openModule('质量经验分享', 'qualityExperience')}>
                  查看 质量经验分享
                </Button>
              </div>
            </section>
          </div>
        </div>
      </Modal>

      <Modal
        title={nestedModalTitle}
        open={nestedModalVisible}
        onCancel={() => setNestedModalVisible(false)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ height: 'calc(100vh - 100px)', padding: '24px', overflow: 'auto' }}
        destroyOnClose
      >
        {nestedModalContent}
      </Modal>
    </>
  );
};

export default connect()(QualityMonthlyReportDetail);
