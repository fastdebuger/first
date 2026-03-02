import {Modal, TreeSelect } from 'antd';
import React, {useEffect, useState } from 'react';
import {queryWorkTypeTree} from "@/services/hr/hrCourse";
import {buildTreeAndParent} from "@/utils/utils";

function markNonLeafDisabled(list: any[]): any[] {
  return list.map(n => {
    const children = n.children ? markNonLeafDisabled(n.children) : undefined;
    const isNonLeaf = !!(children && children.length > 0);
    return {
      ...n,
      children,
      disabled: isNonLeaf, // 有孩子的节点禁选
      title: isNonLeaf ? n.title : `${n.title}(${n.parentNode.title})`,
    };
  });
}

const SelectedJobType: React.FC = (props: any) => {

  const { value, onChange } = props;

  const [treeValue, setTreeValue] = useState<string | undefined>(undefined);

  const [treeData, setTreeData] = useState<any[]>([]);

  const fetchTree = async () => {
    const res = await queryWorkTypeTree({
      sort: 'id',
      order: 'asc'
    })
    if(res.result.length > 0) {
      const filterArr = res.result.filter(r => !r.full_path.includes('管理类'));
      const treeList = buildTreeAndParent(filterArr || []);
      setTreeData(markNonLeafDisabled(treeList));
    }

  }

  const showWarnModal = () => {
    Modal.warning({
      title: '课程选择',
      content: '新增需要指定具体的课程分类，请选择左侧要新增的课程分类，比如：社会保险',
      okText: '知道了',
    })
  }

  const onSelect = (value, node, extra) => {

    console.log('-----newValue', value, node, extra);
    if (node.children.length != 0) {
      showWarnModal();
      return;
    }
    setTreeValue(value);
    if (onChange) onChange(node.expand_id, node);
  };

  useEffect(() => {
    fetchTree();
  }, [])

  return (
    <TreeSelect
      showSearch
      style={{ width: '100%' }}
      value={treeValue}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择工种"
      allowClear
      // 正确的 filterTreeNode 用法：按 title 不区分大小写模糊匹配
      filterTreeNode={(inputValue, treeNode) => {
        // 1. 无输入时，显示所有节点
        if (!inputValue) return true;
        // 2. 有输入时，匹配 title 字段（转小写避免大小写敏感）
        const nodeTitle = treeNode.title || '';
        return nodeTitle.toLowerCase().includes(inputValue.toLowerCase());
      }}
      onSelect={onSelect}
      treeData={treeData}
    />
  );
};

export default SelectedJobType;
