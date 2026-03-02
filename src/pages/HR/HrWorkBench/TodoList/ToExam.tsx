import {Badge, Card, Col, Empty, Modal, Progress, Row } from 'antd';
import { ChevronRight, Clock } from 'lucide-react';
import React from 'react';
import {showTS} from "@/utils/utils-date";
import AIGenerateExamModal from "@/pages/HR/Common/AIGenerateExamModal";

const ToExam = (props: any) => {

  const { toExamList } = props;

  return (
    <Row gutter={[16, 16]}>
      {toExamList.length > 0 ? (
        <>
          {toExamList.map(item => {
            return (
              <Col span={6}>
                <Card
                  className="border-2 border-gray-100 shadow-none transition-all hover:border-blue-200 hover:shadow-md"
                  bodyStyle={{
                    padding: 12
                  }}
                >
                  <div className="mb-3">
                    <h3 className="mb-1 text-base font-semibold text-gray-800">
                      {item.paper_name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {showTS(Number(item.start_time), 'YYYY-MM-DD HH:mm')} ~ {showTS(Number(item.end_time), 'YYYY-MM-DD HH:mm')}
                    </div>
                  </div>
                  <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                    考试对象：{item.module_name}（{item.grade_name}）
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      满分/及格分: {item.total_score}/{item.pass_score}分
                    </span>
                    <a onClick={() => {
                      Modal.info({
                        title: '提示',
                        content: '功能集成中，敬请期待',
                      })
                    }} className="flex items-center text-xs text-blue-600 hover:text-blue-700">
                      进入 <ChevronRight className="h-3 w-3" />
                    </a>
                  </div>
                  {/*<div className="mt-2 flex items-center gap-2">
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
                  </div>*/}
                </Card>
              </Col>
            )
          })}
        </>
      ) : (
        <Empty/>
      )}
    </Row>
  )
}

export default ToExam;
