import React, { useEffect, useState } from 'react'
import useGetAllWbsCode from '@/utils/useGetAllWbsCode';
import { TreeSelect } from 'antd';
import { connect } from 'umi';

/**
 * @description WbsTreeSelect 组件
 */
const WbsTreeSelect = (props: any) => {
  const { dispatch, onChange, value } = props;
  const { wbsItems, loading } = useGetAllWbsCode(dispatch);

  const [treeValue, setTreeValue] = useState<any[]>([])

  useEffect(() => {
    if (value) {
      setTreeValue(Array.isArray(value) ? value : [value])
    } else {
      setTreeValue([])
    }
  }, [value])

  return (
    <TreeSelect
      value={treeValue}
      loading={loading}
      showSearch
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
      placeholder="请选择单位（多选）"
      allowClear
      treeDefaultExpandAll
      
      multiple={true}             
      treeCheckable={false}       
      treeCheckStrictly={false}   
      showCheckedStrategy={TreeSelect.SHOW_CHILD} 
      maxTagCount="responsive" 

      treeNodeFilterProp="wbs_name"
      fieldNames={{
        label: 'wbs_name',
        value: 'wbs_code',
        children: 'children'
      }}
      onChange={(val) => {
        setTreeValue(val);
        if (onChange) onChange(val);
      }}
      treeData={wbsItems}
    />
  )
}

export default connect()(WbsTreeSelect)