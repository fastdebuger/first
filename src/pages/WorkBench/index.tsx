import {useEffect, useState } from 'react'
import { Layout, Calendar, Row, Col } from 'antd'
import {
  User,
  ChevronRight,
  ChevronLeft,
  Shield,
  Award,
  Contact,
} from 'lucide-react';
import styles from './index.css'
import moment from 'moment';
import TodoList from "./TodoList";
import {getIncomeInfo} from "@/services/contract/income";
import {queryContract} from "@/services/contract/expenditure";
// import {queryUser} from "@/services/base/user/list";
import MessageList from "@/pages/WorkBench/MessageList";
import QuickLinks from './QuickLinks';
import LearningSection from "@/pages/WorkBench/LearningSection";
import PublicClassList from "@/pages/WorkBench/PublicClassList";
const { Content } = Layout


const WorkBench = (props: any) => {

  const { routes } = props;
  const wbsCode = localStorage.getItem('auth-default-wbsCode') || '';

  const [incomeCount, setIncomeCount] = useState<number>(0)
  const [outcomeCount, setOutcomeCount] = useState<number>(0)
  const [userCount, setUserCount] = useState<number>(0)

  const fetchCount = async () => {
    // 收入合同数量
    const resInCome = await getIncomeInfo({
      sort: 'id',
      order: 'asc',
      filter: JSON.stringify(
        [{"Key":"dep_code","Val": wbsCode + "%","Operator":"like"}]
      )
    })
    if (resInCome) {
      setIncomeCount(resInCome.total)
    }
    // 支出合同数量
    const resOutCome = await queryContract({
      sort: 'id',
      order: 'asc',
      filter: JSON.stringify(
        [{"Key":"dep_code","Val": wbsCode + "%","Operator":"like"}]
      )
    })
    if (resOutCome) {
      setOutcomeCount(resOutCome.total)
    }
    // 用户人数
    // const resUser = await queryUser({
    //   sort: 'user_code',
    //   order: 'asc',
    // })
    // if (resUser) {
    //   setUserCount(resUser.total)
    // }
  }

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <div className={styles.contentWrapper}>
          {/* Main Content */}
          <Content className={styles.mainContent}>
            <Row gutter={16}>
              <Col span={18}>
                {/* Stats Row */}
                <div className={styles.statsRow}>
                  <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconRed}`}>
                      <Contact size={20} />
                    </div>
                    <div className={styles.statContent}>
                      <div className={styles.statLabel}>收入合同</div>
                      <div className={styles.statValue}>{incomeCount}份</div>
                      {/* <div className={`${styles.statChange} ${styles.statUp}`}>较上月 +0 ↑</div> */}
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconOrange}`}>
                      <Contact size={20} />
                    </div>
                    <div className={styles.statContent}>
                      <div className={styles.statLabel}>支出合同</div>
                      <div className={styles.statValue}>{outcomeCount}份</div>
                      {/* <div className={`${styles.statChange} ${styles.statUp}`}>较上月 +3 ↑</div> */}
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconBlue}`}>
                      <User size={20} />
                    </div>
                    <div className={styles.statContent}>
                      <div className={styles.statLabel}>人数</div>
                      <div className={styles.statValue}>{userCount}人</div>
                      {/* <div className={`${styles.statChange} ${styles.statUp}`}>同比 +0.2% ↑</div> */}
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconPink}`}>
                      <Award size={20} />
                    </div>
                    <div className={styles.statContent}>
                      <div className={styles.statLabel}>本年学习</div>
                      <div className={styles.statValue}>0次</div>
                      {/* <div className={`${styles.statChange} ${styles.statUp}`}>同比 +0.2% ↑</div> */}
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconCyan}`}>
                      <Shield size={20} />
                    </div>
                    <div className={styles.statContent}>
                      <div className={styles.statLabel}>本年考试</div>
                      <div className={styles.statValue}>0次</div>
                      {/* <div className={`${styles.statChange} ${styles.statDown}`}>较上月 -0.2% ↓</div> */}
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <QuickLinks routes={routes || []} />

                {/* Tasks Section */}
                <TodoList/>

                {/* Learning Section */}
                <LearningSection/>
              </Col>
              <Col span={6}>
                {/* Right Sidebar */}
                <aside className={styles.rightSidebar}>
                  {/* Calendar */}
                  <div className={styles.calendarCard}>
                    <div className={styles.calendarHeader}>
                      <span className={styles.calendarNav}><ChevronLeft size={16} /></span>
                      <span className={styles.calendarMonth}>{moment().format('YYYY年MM月')}</span>
                      <span className={styles.calendarNav}><ChevronRight size={16} /></span>
                    </div>
                    <Calendar fullscreen={false} headerRender={() => null} />
                  </div>

                  {/* Friend Links */}

                  {/* Public Class */}
                  <PublicClassList/>

                  {/* message */}
                  <MessageList/>
                </aside>
              </Col>
            </Row>
          </Content>
        </div>
      </div>
    </div>
  )
}

export default WorkBench
