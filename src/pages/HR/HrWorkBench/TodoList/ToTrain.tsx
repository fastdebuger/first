import {Badge, Card, Col, Empty, Progress, Row } from 'antd';
import { ChevronRight, Clock } from 'lucide-react';
import React from 'react';
import {showTS} from "@/utils/utils-date";
import AIGenerateExamModal from "@/pages/HR/Common/AIGenerateExamModal";

const ToTrain = (props: any) => {

  const { toTrainList } = props;
  const [visible, setVisible] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState<any>(null);

  return (
    <Row gutter={[16, 16]}>
      {toTrainList.length > 0 ? (
        <>
          {toTrainList.map(item => {
            return (
              <Col span={6}>
                <Badge.Ribbon text={item.training_type_str} color={item.training_type_str === '线上' ? 'volcano' : 'cyan'}>
                  <Card
                    className="border-2 border-gray-100 shadow-none transition-all hover:border-blue-200 hover:shadow-md"
                    bodyStyle={{
                      padding: 12
                    }}
                  >
                    <div className="mb-3">
                      <h3 className="mb-1 text-base font-semibold text-gray-800">
                        {item.class_name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {showTS(Number(item.start_time), 'YYYY-MM-DD HH:mm')} ~ {showTS(Number(item.end_time), 'MM-DD HH:mm')}
                      </div>
                    </div>
                    <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                      培训对象：{item.training_target}
                    </p>
                    <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      共{item.course_count}节课 已有{item.student_count}人
                    </span>
                    {/* 线上课 才有进入学习，线下课 直接知道了就行 */}
                    {Number(item.training_type) === 1 && (
                      <a className="flex items-center text-xs text-blue-600 hover:text-blue-700"
                         onClick={() => {
                           setSelectedRecord(item);
                           setVisible(true);
                         }}
                      >
                        进入 <ChevronRight className="h-3 w-3" />
                      </a>
                    )}
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
                </Badge.Ribbon>
              </Col>
            )
          })}
        </>
      ) : (
        <Empty/>
      )}
      {visible && (
        <AIGenerateExamModal
          selectedRecord={selectedRecord}
          visible={visible}
          onCancel={() => setVisible(false)}
        />
      )}
    </Row>
  )
}

export default ToTrain;
