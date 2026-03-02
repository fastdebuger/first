import React, { useEffect } from 'react';
import {queryObs} from "@/services/base/obs/list";
import { TreeSelect } from 'antd';

function buildTree(data) {
  // 1. 创建节点映射表
  const nodeMap = {};
  const roots = [];

  // 2. 初始化映射表，生成 value 和 label
  data.forEach(item => {
    const node = {
      ...item,
      value: item.obs_code,
      label: item.obs_name,
      children: []
    };
    nodeMap[item.obs_code] = node;
  });

  // 3. 构建父子关系
  data.forEach(item => {
    const node = nodeMap[item.obs_code];
    const parentCode = item.up_obs_code;
    if (parentCode === '') {
      // 根节点
      roots.push(node);
    } else {
      // 找到父节点并添加到 children
      const parent = nodeMap[parentCode];
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return roots;
}

const SelectedObs = (props: any) => {

  const { value , onChange } = props;

  const [treeList, setTreeList] = React.useState<any[]>([]);
  const [list, setList] = React.useState<any[]>([]);

  const fetchList = async () => {
    const res = await queryObs({
      sort: 'serial_no asc,obs_code',
      order: 'asc',
    })
    setList(res.rows || [])
    const buildTree1 = buildTree(res.rows || []);
    setTreeList(buildTree1);
  }
  useEffect(() => {
    fetchList()
  }, []);
  return (
    <TreeSelect
      showSearch
      style={{ width: '100%' }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择"
      // 自定义筛选逻辑：匹配 label 字段（忽略大小写）
      filterTreeNode={(inputValue, treeNode) => {
        // treeNode.props.label 对应我们构建的节点 label 字段
        return treeNode.props.label?.toLowerCase().includes(inputValue.toLowerCase());
      }}
      allowClear
      treeDefaultExpandAll
      onChange={(_value) => {
        const findObj = list.find(item => item.obs_code === _value)
        onChange(_value, findObj.obs_name);
      }}
      treeData={treeList}
    />
  )
}

export default SelectedObs;
