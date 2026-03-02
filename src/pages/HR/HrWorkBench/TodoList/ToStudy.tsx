import React, { useEffect } from 'react';
import {Alert, Button, Card, Col, Empty, message, Modal, Progress, Row, Skeleton, Space, Tree } from "antd"
import { ChevronRight, Clock } from "lucide-react";
import {queryHrCourseMaterial} from "@/services/hr/hrCourseMaterial";
import {updateCourseStudyTime, updateStudyStatus} from "@/services/hr/pushCourse";
import {useInterval} from "ahooks";
import {deepArr} from "@/utils/utils-array";
import ShowOnlyOfficeInfo from "@/pages/HR/Common/ShowOnlyOfficeInfo";

const ModalItem = (props: any) => {
  const { selectedCourse, selectedYear } = props;
  const [loading, setLoading] = React.useState(false);
  const [selectedMaterialItem, setSelectedMaterialItem] = React.useState<any>(null);
  const [selectedKeys, setSelectedKeys] = React.useState<any>([]);
  const [treeData, setTreeData] = React.useState<any>([
    {
      title: '全部资料',
      key: '0-0-0',
      children: []
    }
  ]);

  const updateTime = async () => {
    return;
    await updateCourseStudyTime({
      id: selectedCourse.id,
      year: selectedYear.format("YYYY"),
    })
  }

  useInterval(() => {
    updateTime();
  }, 10000);

  const fetchCourseMaterialList = async () => {
    setLoading(true);
    const res = await queryHrCourseMaterial({
      sort: 'create_ts',
      order: 'desc',
      filter: '[{"Key":"course_id","Val":2,"Operator":"="}]',
    })
    setLoading(false);
    if(res.rows.length > 0) {
      res.rows.forEach((item) => {
        Object.assign(item, {
          title: item.material_name,
          key: item.id
        })
      })
      const copyTreeData = deepArr(treeData)
      copyTreeData[0].children = res.rows || [];
      setTreeData(copyTreeData);
      setSelectedMaterialItem(res.rows[0]);
      setSelectedKeys([res.rows[0].id])
    }
  }

  useEffect(() => {
    updateTime();
    fetchCourseMaterialList();
  }, []);

  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    setSelectedKeys(selectedKeys);
    setSelectedMaterialItem(info.node);
  };

  return (
    <Skeleton loading={loading} >
      <Row gutter={16}>
        <Col span={6}>
          <Tree
            showLine
            selectedKeys={selectedKeys}
            defaultExpandedKeys={['0-0-0']}
            onSelect={onSelect}
            treeData={treeData}
          />
        </Col>
        <Col span={18}>
          {selectedMaterialItem ? (
            <>
              <ShowOnlyOfficeInfo
                url={selectedMaterialItem.material_url}
                fileName={selectedMaterialItem.material_name}
              />·
            </>
          ) : (
            <Empty description={'无内容'} />
          )}
        </Col>
      </Row>
    </Skeleton>
  )
}

const ToStudy = (props: any) => {

  const { toStudyList, selectedYear } = props;
  const [visible, setVisible] = React.useState(false);

  const [selectedCourse, setSelectedCourse] = React.useState<any>(null);

  return (
    <>
      <Row gutter={12}>
        {toStudyList.length > 0 ? (
          <>
            {toStudyList.map((item: any, index: number) => {
              const studyDuration = (Number(item.study_duration || 0) / 3600).toFixed(1);
              const sumStudyDuration = (Number(item.sum_study_duration || 0) / 3600).toFixed(1);

              return (
                <Col span={6} key={item.course_name}>
                  <Card
                    className="border-2 border-gray-100 shadow-none transition-all hover:border-blue-200 hover:shadow-md"
                    bodyStyle={{
                      padding: 12
                    }}
                  >
                    <div className="mb-3">
                      <h3 className="mb-1 text-base font-semibold text-gray-800">
                        {item.course_name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {item.push_time_str}
                      </div>
                    </div>
                    <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                      {item.course_intro}
                    </p>
                    <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      学习时长: {sumStudyDuration}h/{studyDuration}h
                    </span>
                      <a onClick={async () => {
                        if (Number(item.study_status) === 3) {
                          message.warn("您已结束改课程的学习");
                          return;
                        }
                        // 未开始0 和 暂停学习2的时候，要改成学习中的状态
                        if (Number(item.study_status) === 0 || Number(item.study_status) === 2) {
                          const res = await updateStudyStatus({
                            id: item.id,
                            study_status: '1',
                            year: selectedYear.format('YYYY'),
                          })
                          if (res.errCode === 0) {
                            setSelectedCourse(item);
                            setVisible(true);
                          }
                        } else {
                          //  只有改过后的 状态为1 才进入学习
                          if (Number(item.study_status) === 1) {
                            setSelectedCourse(item);
                            setVisible(true);
                          }
                        }
                      }} className="flex items-center text-xs text-blue-600 hover:text-blue-700">
                        {Number(item.study_status) === 0 && '开始学习'}
                        {Number(item.study_status) === 1 && '继续学习'}
                        {Number(item.study_status) === 2 && '继续学习'}
                        {Number(item.study_status) !== 3 && <ChevronRight className="h-3 w-3" />}
                      </a>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Progress
                        percent={Number((Number(sumStudyDuration) / Number(studyDuration)) * 100)}
                        showInfo={false}
                        strokeColor={'#52c41a'}
                        trailColor="#f0f0f0"
                        size="small"
                      />
                      <span className="text-xs font-medium" style={{ color: '#52c41a'}}>
                      {Number((Number(sumStudyDuration) / Number(studyDuration)) * 100).toFixed(0)}%
                    </span>
                    </div>
                  </Card>
                </Col>
              )
            })}
          </>
        ) : (
          <Empty />
        )}
      </Row>
      {visible && selectedCourse && (
        <Modal
          title={selectedCourse.course_name}
          visible={visible}
          onCancel={() => {
            Modal.confirm({
              title: '关闭此次学习',
              content: '你还未全部学习完毕，是否关闭此次学习？关闭后后续可继续学习',
              okText: '确定关闭',
              cancelText: '我再想想',
              onOk: async () => {
                const res = await updateStudyStatus({
                  id: selectedCourse.id,
                  study_status: '2',
                  year: selectedYear.format('YYYY'),
                })
                if (res.errCode === 0) {
                  setVisible(false);
                }
              }
            })
          }}
          destroyOnClose={true}
          width={'80vw'}
          maskClosable={false}
          style={{
            top: 10,
            maxWidth: '100vw',
            paddingBottom: 0,
            minHeight: '100vh',
            overflow: 'hidden',
          }}
          bodyStyle={{ height: 'calc(100vh - 35px)', marginTop: '-20px' }}
          footer={(
            <Space>
              <Button type={'primary'} onClick={() => {
                Modal.confirm({
                  title: '结束学习',
                  content: '确定已完成要求的学习时长了？结束后不会有再次学习的机会，另外已学习时长会计入积分',
                  okText: '确定结束',
                  cancelText: '我再想想',
                  onOk: async () => {
                    const res = await updateStudyStatus({
                      id: selectedCourse.id,
                      study_status: '3',
                      year: selectedYear.format('YYYY'),
                    })
                    if (res.errCode === 0) {
                      setVisible(false);
                    }
                  }
                })
              }}>结束学习</Button>
            </Space>
          )}
        >
          <Alert type={'info'} message={'如果您已经学习完全部的资料，请点击下方的结束学习按钮，切记：一定要满足设定的学习时长'}/>
          <div style={{marginTop: 16}}>
            <ModalItem selectedYear={selectedYear} selectedCourse={selectedCourse}/>
          </div>
        </Modal>
      )}
    </>
  )
}

export default ToStudy;
