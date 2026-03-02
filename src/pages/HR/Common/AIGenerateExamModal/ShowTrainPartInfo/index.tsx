import React, { useEffect } from 'react';
import ShowOnlyOfficeInfo from "@/pages/HR/Common/ShowOnlyOfficeInfo";
import {Alert, Button, Empty, message} from 'antd';
import {
  getClassCourseStartTestStatus,
  updateExamStatus
} from "@/services/hr/quizQuestion";
import TrainExamQuestion from "./TrainExamQuestion";

const ShowTrainPartInfo = (props: any) => {

  const { sysBasicDictList, selectedMaterialItem } = props;
  const [isStart, setIsStart] = React.useState(0);
  const [testStatusLoading, setTestStatusLoading] = React.useState(false);

  const userCode = localStorage.getItem('auth-default-userCode');

  const fetchIsStart = async () => {
    const res = await getClassCourseStartTestStatus({
      class_course_id: selectedMaterialItem.classCourseId
    })
    if (res.result) {
      if (Number(res.result.start_test_status) !== 1) {
        message.warn('讲师/管理员 还未发布考题，请耐心等待');
      }
      setIsStart(Number(res.result.start_test_status));
    }
  }



  useEffect(() => {
    if (selectedMaterialItem) {
      fetchIsStart();
    }
  }, [selectedMaterialItem]);

  const showInfo = () => {
    // 说明是讲师还问发布 随堂测，则 onlyOffice 展示资料
    if (isStart === 0) {
      return (
        <>
          <Alert type={'info'} message={'请选择左侧的课程资料'} action={<Button
            type={'primary'}
            loading={testStatusLoading}
            onClick={async () => {
              setTestStatusLoading(true);
              const resTestStatus = await getClassCourseStartTestStatus({
                class_course_id: selectedMaterialItem.classCourseId
              })
              if (resTestStatus.result) {
                if (Number(resTestStatus.result.start_test_status) !== 1 ) {
                  setTestStatusLoading(false);
                  message.warn('讲师/管理员 还未发布考题，请耐心等待');
                  return;
                }
                // 发布状态为1， 考试进入考试，先修改考试状态
                if (Number(resTestStatus.result.start_test_status) === 1 ) {
                  const res = await updateExamStatus({
                    class_course_id: selectedMaterialItem.classCourseId,
                    exam_status: '1',
                    user_code: userCode,
                  })
                  setTestStatusLoading(false);
                  if(res.errCode === 0) {
                    // 能到这，就说明 讲师/管理员 已经发布了
                    setIsStart(1);
                  }
                }
              }
              setTestStatusLoading(false);
            }}
          >
            进入随堂测试
          </Button>}/>
          <div style={{marginTop: 16}}>
            <ShowOnlyOfficeInfo
              url={selectedMaterialItem.material_url}
              fileName={selectedMaterialItem.material_name}
            />
          </div>
        </>
      )
    }

    // 说明讲师已 发布随堂测，可以考试
    // 讲师/管理员 发布考题后，才能查询具体的考题信息
    if (isStart === 1) {
      return (
        <TrainExamQuestion sysBasicDictList={sysBasicDictList} selectedMaterialItem={selectedMaterialItem}/>
      )
    }
    return null;
  }


  return (
    <>
      {selectedMaterialItem ? (
        <div style={{
          marginTop: 16,
          height: 'calc(100vh - 170px)',
          overflowY: 'scroll',
        }}>
          {showInfo()}
        </div>
      ) : (
        <>
          <Alert type={'info'} message={'请选择左侧的课程资料'}/>
          <Empty style={{marginTop: 16}} description={'无内容'} />
        </>
      )}
    </>
  );
}

export default ShowTrainPartInfo;
