import React from 'react';
import MaterialItem from "@/pages/HR/Common/AIGenerateExamModal/MaterialItem";
import { Alert, Empty, Tabs } from 'antd';
import ShowOnlyOfficeInfo from "@/pages/HR/Common/ShowOnlyOfficeInfo";
import CourseStudentSign from "@/pages/HR/Common/AIGenerateExamModal/LecturerOrManager/CourseStudentSign";
import CourseStudentExamResult from "@/pages/HR/Common/AIGenerateExamModal/LecturerOrManager/CourseStudentExamResult";

const LecturerOrManager = ({
   selectedMaterialItem,
   selectedRecord,
   sysBasicDictList,
}: {
  selectedMaterialItem: any;
  selectedRecord: any;
  sysBasicDictList: any[]
}) => {

  const [activeKey, setActiveKey] = React.useState('1');

  return (
    <>
      <Alert type={'info'} message={'请选择左侧的课程资料, 然后点击右侧的 生成考题 按钮，系统会用 AI 分析资料后生成考题，如果觉得题目不错，可以点击 采纳 按钮，注意：管理类课程 不能生成、 视频，音频不能生成'}/>
      <div style={{
        marginTop: 16,
        height: 'calc(100vh - 170px)',
        overflowY: 'scroll',
      }}>
        {selectedMaterialItem ? (
          <>
            {selectedMaterialItem.node_type !== 'grade' && <strong style={{color: 'orange'}}>资料为：管理类 不可生成考题</strong>}
            <Tabs activeKey={activeKey} onChange={(_activeKey) => {
              setActiveKey(_activeKey);
            }}>
              <Tabs.TabPane tab="上课资料" key="1">
                <ShowOnlyOfficeInfo key={activeKey} url={selectedMaterialItem.material_url} fileName={selectedMaterialItem.material_name} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="AI出题" key="2">
                <MaterialItem key={activeKey} classId={selectedRecord.id} sysBasicDictList={sysBasicDictList} selectedMaterialItem={selectedMaterialItem}/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="考生签到" key="3">
                <CourseStudentSign key={activeKey} selectedRecord={selectedRecord} classCourseId={selectedMaterialItem.classCourseId} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="考试情况" key="4">
                <CourseStudentExamResult  key={activeKey} selectedRecord={selectedRecord} classCourseId={selectedMaterialItem.classCourseId} />
              </Tabs.TabPane>
            </Tabs>
          </>
        ) : (
          <Empty description={'无内容'} />
        )}
      </div>
    </>
  )
}

export default LecturerOrManager;
