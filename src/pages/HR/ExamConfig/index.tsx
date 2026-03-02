import moment from "moment";
import { Badge, Button, Card, Col, Divider, Empty, Row} from 'antd';
import { useEffect, useState } from 'react';
import { queryExamSessionList } from '@/services/hr/exam';
import { BookOpenCheck, Plus } from 'lucide-react';
import SelectExamModal from './SelectExamModal';
import ShowAndEditExamModal from './ShowAndEditExamModal';

const ExamConfig = () => {

  const [addVisible, setAddVisible] = useState(false);
  const [examList, setExamList] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<any>(null);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);

  const fetchList = async () => {
    const res = await queryExamSessionList({
      sort: 'start_time',
      order: 'desc',
    })
    console.log("res----", res);
    setExamList(res.rows || []);
  }

  useEffect(() => {
    fetchList();
  }, []);

  const getBadgeRibbonConfig = (sessionItem: any) => {
    if (sessionItem.status === 'ongoing') {
      return {
        text: '进行中',
        color: undefined,
      }
    }
    if (sessionItem.status === 'finished') {
      return {
        text: '已结束',
        color: 'green',
      }
    }
    if (sessionItem.status === 'cancelled') {
      return {
        text: '已取消',
        color: 'volcano',
      }
    }
    return {
      text: '未知',
      color: 'red',
    }
  }

  return (
    <div style={{height: '100vh'}}>
      <Row justify={'space-between'}>
        <Col>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <BookOpenCheck size={24} color="#1890ff" />
            <strong style={{fontSize: 24}}>考试管理</strong>
          </div>
        </Col>
        <Col>
          <Button type="primary" icon={<Plus size={16} />} onClick={() => {
            setAddVisible(true);
          }}>
            新建考试
          </Button>
        </Col>
      </Row>
      <Row gutter={16} style={{marginTop: '16px'}}>
        {examList.length > 0 ? (
          <>
            {examList.map((item: any, index: number) => {
              let moduleList: any[] = [];
              try {
                moduleList = JSON.parse(item.paper_module_info);
              } catch (e) {
                moduleList = [];
              }
              return (
                <Col span={8} style={{ marginBottom: '16px' }}>
                  <Badge.Ribbon text={getBadgeRibbonConfig(item).text} color={getBadgeRibbonConfig(item).color}>
                    <Card
                      onClick={() => {
                        setSelectedSessionId(item.session_id);
                        setDetailVisible(true);
                      }}
                      hoverable
                      style={{ width: '100%' }}
                      bodyStyle={{
                        padding: '16px'
                      }}
                      // cover={<img alt="example" src={homePng} />}
                    >
                      <strong style={{fontSize: 16}}>{item.session_name}</strong>
                      <div>
                        开始时间：{moment.unix(Number(item.start_time)).format('MM月DD日 HH:mm')}
                      </div>
                      <div style={{marginTop: 8}}>
                        <span style={{fontSize: 14}}>{item.session_description}</span>
                      </div>
                      <Divider style={{margin: '8px 0'}}/>
                      {moduleList.length > 0 ? (
                        <>
                          {moduleList.map((item: any, index: number) => {
                            return (
                              <div key={index} style={{display: 'flex', justifyContent: 'space-between'}}>
                                <span style={{fontWeight: 'normal'}}>
                                  <span>{index + 1}. </span>
                                  {item.module_name}{item.practical_paper_no && <a style={{fontSize: 10}}>(含实操)</a>}
                                </span>
                                <span style={{fontWeight: 'normal'}}>{item.exam_duration}分钟</span>
                              </div>
                            )
                          })}
                        </>
                      ) : (
                        <Empty/>
                      )}
                    </Card>
                  </Badge.Ribbon>
                </Col>
              )
            })}
          </>
        ) : (
          <Empty/>
        )}
      </Row>
      {addVisible && (
        <SelectExamModal
          visible={addVisible}
          onCancel={() => {
            setAddVisible(false);
            fetchList();
          }}
        />
      )}
      {detailVisible && selectedSessionId && (
        <ShowAndEditExamModal
          visible={detailVisible}
          selectedSessionId={selectedSessionId}
          onCancel={() => {
            setDetailVisible(false);
            fetchList();
          }}
        />
      )}
    </div>
  );
}

export default ExamConfig;
