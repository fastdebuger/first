import React, { useEffect } from 'react';
import {queryCourseSign} from "@/services/hr/hrTrainingPlan";
import {Avatar, List, Tag } from 'antd';
import studentPng from '@/assets/hr/student.png';

const CourseStudentSign = (props: any) => {

  const { classCourseId, selectedRecord, } = props;
  const [list, setList] = React.useState<any[]>([])

  const fetchList = async () => {
    const res = await queryCourseSign({
      sort: 'id',
      order: 'asc',
      class_course_id: classCourseId,
      class_id: selectedRecord.id,
    })
    setList(res.rows);
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={list}
        renderItem={item => (
          <List.Item
            actions={[<>
              {item.sign_status === 'signed' ? <Tag color={'green'}>已签到</Tag> : <Tag>未签到</Tag>}
            </>]}
          >
            <List.Item.Meta
              avatar={<Avatar src={studentPng} />}
              title={<strong>{item.user_name}</strong>}
              description={`用户编码: ${item.user_code}`}
            />
          </List.Item>
        )}
      />
    </>
  )
}

export default CourseStudentSign;
