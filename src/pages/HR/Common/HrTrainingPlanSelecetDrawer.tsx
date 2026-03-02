import {Alert, Button, Card, Col, Drawer, Input, Row, Tag } from 'antd';
import React, {useEffect, useState } from 'react';
import {queryHrTrainingPlan} from "@/services/hr/hrTrainingPlan";
import planPng from '@/assets/hr/plan.png';

const HrTrainingPlanSelectDrawer: React.FC = (props: any) => {
  const { value, onChange } = props;

  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const propKey = localStorage.getItem("auth-default-wbs-prop-key") || "";

  const fetchList = async () => {
    const res = await queryHrTrainingPlan({
      sort: 'create_ts',
      order: 'desc',
      filter: JSON.stringify([
        {Key: 'publish_status', Val: '1', Operator: '='},
        {Key: 'prop_key', Val: propKey, Operator: '='},
      ]),
    })
    setList(res.rows || []);
  }

  useEffect(() => {
    if (open) {
      fetchList();
    }
  }, [open]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      {selectedItem ? (
        <Card
          hoverable
          cover={<img style={{width: 250}} alt="example" src={planPng} />}
          style={{position: 'relative', width: 250}}
          bodyStyle={{
            padding: '8px 16px'
          }}
          onClick={() => {
            setOpen(true);
          }}
        >
          <Tag color={'blue'} style={{position: 'absolute', top: 6, right: -4}}>
            {selectedItem.plan_type_str}
          </Tag>
          <div><strong>{selectedItem.plan_name || ''}</strong></div>
          <div><strong>{selectedItem.year || ''}年 | {selectedItem.start_date || ''}｜计划{selectedItem.plan_total_persons}人</strong></div>
          <div>{selectedItem.master_organizer_str || ''}</div>
        </Card>
      ) : (
        <Button type="primary" onClick={showDrawer}>
          选择培训计划
        </Button>
      )}
      {open && (
        <Drawer
          width={'75%'}
          // title="培训计划"
          placement="right"
          closable={false}
          onClose={onClose}
          open={open}
        >
          <Input.Search placeholder="输入培训计划名称进行搜索" onSearch={(value: string) => {

          }} style={{ width: '100%' }} />
          <div style={{ height: 'calc(100vh - 130px)', overflowY: 'scroll' }}>
            <Row gutter={16} style={{marginTop: 8}}>
              {list.map((item: any) => {
                return (
                  <Col span={6} key={item.id} style={{marginBottom: 8}}>
                    <Card
                      hoverable
                      cover={<img alt="example" src={planPng} />}
                      style={{position: 'relative'}}
                      bodyStyle={{
                        padding: '8px 16px'
                      }}
                      onClick={() => {
                        setSelectedItem(item);
                        if (onChange) onChange(item)
                        setOpen(false);
                      }}
                    >
                      <Tag color={'blue'} style={{position: 'absolute', top: 6, right: -4}}>
                        {item.plan_type_str}
                      </Tag>
                      <div><strong>{item.plan_name || ''}</strong></div>
                      <div><strong>{item.year || ''}年 | {item.start_date || ''}｜计划{item.plan_total_persons}人</strong></div>
                      <div>{item.master_organizer_str || ''}</div>
                    </Card>
                  </Col>
                )
              })}

            </Row>
          </div>
        </Drawer>
      )}
    </>
  );
};

export default HrTrainingPlanSelectDrawer;
