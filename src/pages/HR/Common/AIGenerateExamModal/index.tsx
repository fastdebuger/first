import {Alert, Button, Col, Empty, message, Modal, Row, Skeleton, Tag, Tree } from 'antd';
import React, { useEffect } from 'react';
import {queryClassCourse} from "@/services/hr/hrTrainingClass";
import {deepArr} from "@/utils/utils-array";
import {getTS, showTS} from "@/utils/utils-date";
import type {ConnectState} from "@/models/connect";
import { connect } from 'umi';
import {queryHrLecturer} from "@/services/hr/hrLecturer";
import ShowTrainPartInfo from './ShowTrainPartInfo';
import LecturerOrManager from "./LecturerOrManager";
import {courseSign, getIsNeedSign} from "@/services/hr/hrTrainingPlan";


const AIGenerateExamModal = (props: any) => {

  const { isManager = false, visible, onCancel, selectedRecord, sysBasicDictList } = props;
  const [loading, setLoading] = React.useState(false);
  const [selectedKeys, setSelectedKeys] = React.useState<any[]>([]);
  const [selectedMaterialItem, setSelectedMaterialItem] = React.useState<any>(null);
  const [isLecturer, setIsLecturer] = React.useState(isManager); // 如果是 管理员进来，isManager = true，就赋予 讲师的出题权限

  const userCode = localStorage.getItem('auth-default-userCode')

  const [treeData, setTreeData] = React.useState<any>([
    {
      selectable: false,
      title: '所有课程',
      key: '0-0-0',
      children: []
    }
  ]);

  const fetchClassCourseList = async () => {
    setLoading(true);
    const res = await queryClassCourse({
      sort: 'start_time',
      order: 'asc',
      id: selectedRecord.id,
    })
    setLoading(false);
    if (res.rows.length > 0) {
      res.rows.forEach((row: any) => {
        Object.assign(row, {
          selectable: false,
          title: <>
            <div>{row.course_name} <Tag>讲师：{row.lecturer_names}</Tag></div>
            <div style={{fontSize: 10}}>{showTS(Number(row.start_time), 'MM-DD HH:mm')}~{showTS(Number(row.end_time), 'MM-DD HH:mm')}</div>
          </>,
          key: row.id
        })
        if(row.materials) {
          try {
            const parseData = JSON.parse(row.materials);
            if(parseData.length > 0) {
              parseData.forEach((item: any,indexIndex:number) => {
                Object.assign(item, {
                  course_start_time: row.start_time,
                  course_end_time: row.end_time,
                  node_type: row.node_type, // 需要把 课程的node_type 同步到 资料上，这样才能判断是否是 管理类
                  title: item.material_name,
                  key: row.id + '_yy_' + item.id,
                  classCourseId: row.id,
                  lecturer_names: row.lecturer_names,
                  lecturer_ids: row.lecturer_ids,
                  ...item,
                  courseId: row.course_id,
                  materialId: item.id,
                  startTestStatus: Number(row.start_test_status || 0)  // 控制课程是 参加考试，还是发布试题的功能
                })
              })
              Object.assign(row, {
                children: parseData
              })
            }
          } catch (e) {
            Object.assign(row, {
              children: []
            })
          }
        } else {
          Object.assign(row, {
            children: []
          })
        }
      })
      const copyTreeData = deepArr(treeData)
      copyTreeData[0].children = res.rows || [];
      setTreeData(copyTreeData);
    }
  }
  /**
   * 查询登陆用户 是不是讲师
   */
  const fetchIsLecturer = async () => {
    const res = await queryHrLecturer({
      sort: 'user_code',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'user_code', Val: userCode, Operator: '='}
      ]),
    })
    setIsLecturer(res.rows.length > 0)
  }

  useEffect(() => {
    // 如果不是管理员，才能还在是不是 讲师
    if (!isManager) {
      fetchIsLecturer();
    }
    fetchClassCourseList()
  }, [selectedRecord, userCode]);

  const onSelect = async (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    // 管理员 和 讲师 权限，直接进入即可，无需签到
    if (isLecturer) {
      setSelectedKeys(selectedKeys);
      setSelectedMaterialItem(info.node)
      return;
    }

    const res = await getIsNeedSign({
      class_course_id: info.node.classCourseId,
    })
    if (res.result) {
      // 是否需要签到，如果是 已经结束的课程我还未签到的，不会是 需要签到
      if (Number(res.result.status) === 1) {
        Modal.confirm({
          title: '签到提示',
          content: '需要签到，签到后可观看课程 ',
          okText: '确定签到',
          onOk: async () => {
            const res = await courseSign({
              class_course_id: info.node.classCourseId,
            })
            if (res.errCode === 0) {
              message.success('已签到，开始您的课程之旅吧');
              setSelectedKeys(selectedKeys);
              setSelectedMaterialItem(info.node)
            }
          }
        })
        return;
      }
      setSelectedKeys(selectedKeys);
      setSelectedMaterialItem(info.node)
    }
    // const item = info.node;
    // const currTs = getTS();
    // setSelectedKeys(selectedKeys);
    // setSelectedMaterialItem(info.node)
    // if (currTs >= Number(item.course_start_time)) {
    //   ;
    // } else {
    //   Modal.warn({
    //     title: '警告',
    //     content: '当前时间不能进入该课程',
    //   })
    // }
  };

  return (
    <Modal
      title={selectedRecord.class_name}
      visible={visible}
      onCancel={onCancel}
      destroyOnClose={true}
      width={'90vw'}
      style={{
        top: 8,
        maxWidth: '100vw',
        overflow: 'hidden',
        bottom: 8,
      }}
      bodyStyle={{ height: 'calc(100vh - 55px)', overflow: 'hidden', marginTop: '-16px' }}
      footer={null}
    >
      <Skeleton loading={loading} >
        <Row gutter={16}>
          <Col span={6}>
            <div style={{
              height: 'calc(100vh - 55px)',
              overflowY: 'scroll',
            }}>
              <Tree
                showLine
                selectedKeys={selectedKeys}
                defaultExpandedKeys={['0-0-0']}
                onSelect={onSelect}
                treeData={treeData}
              />
            </div>
          </Col>
          {/* 是讲师才能出题, 后续可以加 管理员权限控制 */}
          {isLecturer ? (
            <Col span={18}>
              <LecturerOrManager
                selectedMaterialItem={selectedMaterialItem}
                selectedRecord={selectedRecord}
                sysBasicDictList={sysBasicDictList}
              />
            </Col>
          ) : (
            <Col span={18}>
              <ShowTrainPartInfo sysBasicDictList={sysBasicDictList} selectedMaterialItem={selectedMaterialItem}/>
            </Col>
          )}
        </Row>
      </Skeleton>
    </Modal>
  )
}

export default connect(({ common }: ConnectState) => ({
  sysBasicDictList: common.sysBasicDictList
}))(AIGenerateExamModal);
