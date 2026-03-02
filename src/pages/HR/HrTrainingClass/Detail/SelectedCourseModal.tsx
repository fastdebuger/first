import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, DatePicker, Modal, Row, Col, message, Table, Popconfirm } from 'antd';
import React, { useEffect } from 'react';
import HrLecturerList from "@/components/CommonList/HrLecturerList";
import SelectedCourseList from "@/components/CommonList/SelectedCourseList";
import {configureCourse, queryClassCourse} from "@/services/hr/hrTrainingClass";
import {ErrorCode} from "@/common/const";
import {getDateTS, showTS} from "@/utils/utils-date";
const { RangePicker } = DatePicker;

const SelectedCourseModal: React.FC = (props: any) => {

  const { selectedRecord } = props;
  const [visible, setVisible] = React.useState(false);
  const [list, setList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [commitLoading, setCommitLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    console.log('Received values of form:', values);
    setCommitLoading(true);
    values.courses.forEach(item => {
      const time = item.time_area;
      Object.assign(item, {
        start_time: time[0] ? getDateTS(time[0].unix()) : 0,
        end_time: time[1] ?  getDateTS(time[1].unix()) : 0,
      })
      if(item.lecturer.length > 0) {
        item.lecturer = item.lecturer.map(it => Object.assign({
          lecturer_id: it,
        }))
      }
    })
    const result: any[] = [];
    if (list.length > 0) {
      list.forEach((item) => {
        const arr: any[] = item.lecturer_ids.split(',');
        const lecturer = arr.map(it => Object.assign({
          lecturer_id: it,
        }))
        result.push({
          course_id: item.course_id,
          start_time: item.start_time,
          end_time: item.end_time,
          lecturer,
        })
      })
    }
    if (result.length > 0) {
      result.forEach(item => {
        values.courses.push(item);
      })
    }
    const res = await configureCourse({
      courses: JSON.stringify(values.courses),
      id: selectedRecord.id,
    })
    setCommitLoading(false);
    if (res.errCode === ErrorCode.ErrOk) {
      message.success('配置成功');
      setVisible(false);
      fetchList();
    }
  };

  const onOk = (value: any) => {
    console.log('onOk: ', value);
  };

  // courses:[{course_id:1,start_time:1,end_time:1,lecturer:[{lecturer_id:1}]}]

  const fetchList = async () => {
    setLoading(true);
    const res = await queryClassCourse({
      sort: 'start_time',
      order: 'asc',
      id: selectedRecord.id,
    })
    setLoading(false);
    setList(res.rows || [])
  }

  useEffect(() => {
    fetchList()
  }, []);

  const columns = [
    {
      title: "课程时间",
      subTitle: "课程名称",
      dataIndex: "time",
      width: 200,
      align: "center",
      render: (h: any, record: any) => {
        return (
          <span>
            {showTS(Number(record.start_time), 'YYYY-MM-DD HH:mm')} ~ {showTS(Number(record.end_time), 'MM-DD HH:mm')}
          </span>
        )
      }
    },
    {
      title: "课程名称",
      subTitle: "课程名称",
      dataIndex: "course_name",
      width: 200,
      align: "center",
    },
    {
      title: "课程讲师",
      subTitle: "课程讲师",
      dataIndex: "lecturer_names",
      width: 160,
      align: "center",
    },
    {
      title: "操作",
      subTitle: "操作",
      dataIndex: "operate",
      width: 100,
      align: "center",
      render: (h: any, record: any) => {
        return (
          <Popconfirm title="确定删除?" onConfirm={async () => {
            setLoading(true);
            const filterArr = list.filter(item => item.id !== record.id);
            const result: any[] = [];
            if (filterArr.length > 0) {
              filterArr.forEach((item) => {
                const arr: any[] = item.lecturer_ids.split(',');
                const lecturer = arr.map(it => Object.assign({
                  lecturer_id: it,
                }))
                result.push({
                  course_id: item.course_id,
                  start_time: item.start_time,
                  end_time: item.end_time,
                  lecturer,
                })
              })
            }
            const res = await configureCourse({
              courses: JSON.stringify(result),
              id: selectedRecord.id,
            })
            setLoading(false);
            if (res.errCode === ErrorCode.ErrOk) {
              message.success('删除成功');
              setVisible(false);
              fetchList();
            }
          }}>
            <a style={{color: '#f40'}}>删除</a>
          </Popconfirm>
        )
      }
    },
  ]


  return (
    <>
      <Row justify="space-between">
        <Col></Col>
        <Col>
          <Button loading={commitLoading} type="primary" onClick={() => {
            setVisible(true);
          }}>
            新增
          </Button>
        </Col>
      </Row>
      <Table
        rowKey={'id'}
        loading={loading}
        style={{marginTop: 8}}
        size={'small'}
        columns={columns}
        dataSource={list}
      />
      {visible && (
        <Modal
          width={'86%'}
          title={'新增课程及讲师'}
          visible={visible}
          onCancel={() => setVisible(false)}
          footer={null}
        >
          <Form name="selected-course" onFinish={onFinish} autoComplete="off">
            <Form.List name="courses">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={4}>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'time_area']}
                          rules={[{ required: true, message: '必选项' }]}
                        >
                          <RangePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YY-MM-DD HH:mm"
                            onOk={onOk}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item
                          {...restField}
                          name={[name, 'course_id']}
                          rules={[{ required: true, message: '必选项' }]}
                        >
                          <SelectedCourseList/>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'lecturer']}
                          rules={[{ required: true, message: '必选项' }]}
                        >
                          <HrLecturerList/>
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Button danger type={'primary'}  onClick={() => remove(name)}>删除</Button>
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      新增课程及讲师
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default SelectedCourseModal;
