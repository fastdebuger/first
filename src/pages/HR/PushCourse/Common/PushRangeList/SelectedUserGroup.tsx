import React, { useEffect } from 'react';
import {queryUserGroup} from "@/services/base/usergroup/list";
import { Select } from 'antd';

function transformToGroupOptions(data) {
  // 1. 定义 prop_key 到分组名的映射
  const groupMap = {
    'dep': '项目部',
    'subComp': '分公司',
    'branchComp': '公司'
  };

  // 2. 初始化分组结构
  const groups = Object.keys(groupMap).map(key => ({
    label: groupMap[key],
    options: []
  }));

  // 3. 遍历数据，填充每个分组的 options
  data.forEach(item => {
    const propKey = item.prop_key;
    const groupLabel = groupMap[propKey];
    if (groupLabel) {
      const targetGroup = groups.find(g => g.label === groupLabel);
      if (targetGroup) {
        targetGroup.options.push({
          label: `${item.group_name}(${item.group_code})`,
          value: item.group_code
        });
      }
    }
  });

  // 4. 过滤掉没有选项的空分组
  return groups.filter(group => group.options.length > 0);
}

const SelectedUserGroup = (props: any) => {
  const { value , onChange } = props;

  const [list, setList] = React.useState<any[]>([]);
  const [groupList, setGroupList] = React.useState<any[]>([]);

  const fetchList = async () => {
    const res = await queryUserGroup({
      sort: 'group_code',
      order: 'asc',
      depCode: '',
      wbsCode: '',
      currDepCode: ''
    })
    setList(res.rows || []);
    const transformToGroupOptions1 = transformToGroupOptions(res.rows || []);
    setGroupList(transformToGroupOptions1);
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <Select value={value} onChange={(_value) => {
      const findObj = list.find(item => item.group_code === _value)
      onChange(_value, findObj.group_name);
    }} options={groupList}/>
  )
}

export default SelectedUserGroup;
