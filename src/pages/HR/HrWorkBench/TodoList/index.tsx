import { useEffect, useState } from "react"
import { Badge, Card, Col, Progress, Row,  Table, Tabs, Tag } from "antd"
import { connect } from "umi";
import styles from "../index.css";
import { ChevronRight, Clock } from "lucide-react";
import ToStudy from "@/pages/HR/HrWorkBench/TodoList/ToStudy";
import {queryClassForUse} from "@/services/hr/hrTrainingClass";
import ToTrain from "@/pages/HR/HrWorkBench/TodoList/ToTrain";
import {getUserExam} from "@/services/hr/exam";
import ToExam from "@/pages/HR/HrWorkBench/TodoList/ToExam";


const ToDoList = (props: any) => {

  const { toStudyList, selectedYear } = props;
  const [toTrainList, setToTrainList] = useState<any[]>([]);
  const [toExamList, setToExamList] = useState<any[]>([]);

  const fetchToTrainList = async () => {
    const res = await queryClassForUse({
      sort: 'id',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'year', Val: selectedYear.format('YYYY'), Operator: '='},
      ])
    })
    setToTrainList(res.rows || []);
  }

  const fetchToExamList = async () => {
    const res = await getUserExam({
      sort: 'id',
      order: 'asc',
      // filter: JSON.stringify([
      //   {Key: 'year', Val: selectedYear.format('YYYY'), Operator: '='},
      // ])
    })
    console.log('-----123----fetchToExamList', res)
    setToExamList(res.rows || []);
  }

  useEffect(() => {
    fetchToTrainList();
    fetchToExamList()
  }, []);

  return (
    <div className={styles.tasksSection}>
      <Tabs>
        <Tabs.TabPane tab={<Badge count={toStudyList.length}>待学习</Badge>} key="item-1">
          <ToStudy selectedYear={selectedYear} toStudyList={toStudyList}/>
        </Tabs.TabPane>
        <Tabs.TabPane tab={<Badge count={toTrainList.length}>待参加培训班</Badge>} key="item-2">
          <ToTrain toTrainList={toTrainList}/>
        </Tabs.TabPane>
        <Tabs.TabPane tab={<Badge count={toExamList.length}>待参加考试</Badge>} key="item-3">
          <ToExam toExamList={toExamList}/>
          {/*<Row gutter={12}>
            <Col span={6}>
              <Card
                className="border-2 border-gray-100 shadow-none transition-all hover:border-blue-200 hover:shadow-md"
                bodyStyle={{
                  padding: 12
                }}
              >
                <div className="mb-3">
                  <h3 className="mb-1 text-base font-semibold text-gray-800">
                    新员工入职培训计划
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    2024.01.15 ~ 2024.02.15
                  </div>
                </div>
                <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                  包含公司文化、规章制度、岗位技能等必修课程
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      学习进度: 36/12节课
                    </span>
                  <a className="flex items-center text-xs text-blue-600 hover:text-blue-700">
                    进入学习 <ChevronRight className="h-3 w-3" />
                  </a>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Progress
                    percent={34}
                    showInfo={false}
                    strokeColor={'#52c41a'}
                    trailColor="#f0f0f0"
                    size="small"
                  />
                  <span className="text-xs font-medium" style={{ color: '#52c41a'}}>
                      34%
                    </span>
                </div>
              </Card>
            </Col>
          </Row>*/}
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default connect()(ToDoList);
