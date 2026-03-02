import { TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react'

/**
 * 树形下拉框
 * @param props 
 * @returns 
 */
const TreeSelectComp = (props: any) => {
  const {
    onChange,
    value,
    treeData,
    loading,
    fieldNames = {
      label: 'wbs_name',
      value: 'wbs_code',
    },
    placeholder = "选择单位"
  } = props;
  // 控制 TreeSelect 的值
  const [treeValue, setTreeValue] = useState('')
  // 默认值
  useEffect(() => {
    if (value) {
      setTreeValue(value)
    }
  }, [value])
  // 组件渲染部分
  return (
    <TreeSelect
      value={treeValue}
      loading={loading}
      showSearch
      dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
      placeholder={placeholder}
      allowClear
      treeDefaultExpandAll
      treeNodeFilterProp={fieldNames.label}
      fieldNames={fieldNames}
      onChange={onChange}
      treeData={treeData}
    />
  )
}

export default TreeSelectComp;