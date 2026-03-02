import React, {useEffect, useState } from "react";
import { Card, Progress, Tabs, Avatar, Tag, Badge } from "antd";
import {
  BookOpen,
  GraduationCap,
  Target,
  Award,
  ChevronRight,
  Clock,
  User,
  Mail,
  Building2,
  Briefcase,
  Calendar,
  Settings,
  Bell,
} from "lucide-react";
import TodoList from "@/pages/HR/HrWorkBench/TodoList";
import PublicClassList from "@/pages/WorkBench/PublicClassList";
import {queryPushCourseList} from "@/services/hr/pushCourse";
import moment from "moment";
import {deepArr} from "@/utils/utils-array";
import studentPng from '@/assets/hr/student.png';

// 统计卡片数据
const initStatsData = [
  {
    title: "已参加培训",
    value: 0,
    unit: "场",
    icon: BookOpen,
    color: "#ff7875",
    bgColor: "#fff1f0",
  },
  {
    title: "已参加考试",
    value: 0,
    unit: "场",
    icon: GraduationCap,
    color: "#ffc069",
    bgColor: "#fff7e6",
  },
  {
    title: "需完成学习",
    value: 0,
    suffix: "/0",
    unit: "次",
    icon: Target,
    color: "#ff85c0",
    bgColor: "#fff0f6",
  },
  {
    title: "总积分",
    value: 0,
    unit: "分",
    icon: Award,
    color: "#95de64",
    bgColor: "#f6ffed",
  },
];


// 用户信息
const userInfo = {
  name: "",
  avatar: "",
  role: "高级工程师",
  department: "技术研发部",
  email: "zhangminghui@company.com",
  joinDate: "2022-03-15",
  level: "L3",
  badges: ["优秀员工", "技术标兵"],
};

const HrWorkBench = () => {

  const [toStudyList, setToStudyList] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any[]>(initStatsData);

  const selectedYear = moment();
  const userName = localStorage.getItem('auth-default-userName');

  const fetchList = async () => {
    const copyStatsData = deepArr(statsData);
    const res = await queryPushCourseList({
      sort: 'id',
      order: 'asc',
      year: selectedYear.format('YYYY'),
    })
    setToStudyList(res.rows || []);
    copyStatsData[2].suffix = `/${res.total}`;
    if (res.rows.length > 0) {
      const filterArr = res.rows.filter(item => Number(item.study_status) === 3);
      copyStatsData[2].value = filterArr.length;
    }

    setStatsData(copyStatsData)
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div>
      <div className="flex gap-2" style={{backgroundColor: '#f5f5f5', minHeight: '100vh'}}>
        {/* 左侧主内容区 */}
        <div className="flex-1">
          {/* 统计卡片 */}
          <div className="mb-2 grid grid-cols-4 gap-2">
            {statsData.map((stat, index) => (
              <Card
                key={index}
                className="border-0 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{stat.title}</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-800">
                        {stat.value}
                      </span>
                      {stat.suffix && (
                        <span className="text-lg text-gray-400">{stat.suffix}</span>
                      )}
                      <span className="text-sm text-gray-400">{stat.unit}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <TodoList selectedYear={selectedYear} toStudyList={toStudyList}/>
        </div>

        {/* 右侧边栏 */}
        <div className="w-80 space-y-2">
          {/* 用户信息卡片 */}
          <Card
            className="border-0 shadow-sm"
          >
            <div className="flex flex-col items-center">
              <Avatar
                size={80}
                src={studentPng}
                className="mb-3 ring-4 ring-blue-50"
              />
              <h2 className="mb-1 text-lg font-semibold text-gray-800">
                {userName}
              </h2>
              {/*<Tag color="blue" className="mb-3">
                {userInfo.level} · {userInfo.role}
              </Tag>
              <div className="mb-4 flex gap-2">
                {userInfo.badges.map((badge, index) => (
                  <Tag key={index} color="gold" className="m-0">
                    {badge}
                  </Tag>
                ))}
              </div>*/}
            </div>
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{userInfo.department}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{userInfo.role}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="truncate text-gray-600">{userInfo.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">入职于 {userInfo.joinDate}</span>
              </div>
            </div>
          </Card>

          {/* 公开课 */}
          <PublicClassList/>
        </div>
      </div>
    </div>
  );
}


export default HrWorkBench
