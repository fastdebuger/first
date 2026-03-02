import React, { useEffect, useState } from 'react'
import useGetAllWbsCode from '@/utils/useGetAllWbsCode';
import { TreeSelect } from 'antd';
import { connect } from 'umi';


/**
 * @description WbsTreeSelect 组件
 * @param {object} props 接收的属性
 * @param {function} props.dispatch umi/dva 提供的 dispatch 方法，用于触发 action
 * @param {function} props.onChange 当 TreeSelect 值变化时的回调函数
 * @param {string} props.value TreeSelect 的当前值（被选中的 WBS 编码）
 */
const WbsTreeSelect = (props: any) => {
  const { dispatch, onChange, value, disabled = false } = props;
  const { wbsItems, loading } = useGetAllWbsCode(dispatch);

  // 控制 TreeSelect 的值
  const [treeValue, setTreeValue] = useState('')

  useEffect(() => {
    if (value) {
      setTreeValue(value)
    }
  }, [value])

  // 组件渲染部分
  return (
    <TreeSelect
      disabled={disabled}
      value={treeValue}
      loading={loading}
      showSearch
      dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
      placeholder="选择单位"
      allowClear
      treeDefaultExpandAll
      treeNodeFilterProp="wbs_name"
      fieldNames={{
        label: 'wbs_name',
        value: 'wbs_code',
      }}
      onChange={onChange}
      treeData={wbsItems} // 传入作为数据源的 WBS 树形结构数据
    />
  )
}

export default connect()(WbsTreeSelect)
