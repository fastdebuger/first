import React, { useEffect, useState } from 'react'
import { TreeSelect } from 'antd';
import { connect } from 'umi';
import { ErrorCode } from '@yayang/constants';
import { arrToTree } from '@/utils/utils-array';


/**
 * @description WbsTreeSelect 组件
 * @param {object} props 接收的属性
 * @param {function} props.dispatch umi/dva 提供的 dispatch 方法，用于触发 action
 * @param {function} props.onChange 当 TreeSelect 值变化时的回调函数
 * @param {string} props.value TreeSelect 的当前值（被选中的 WBS 编码）
 */
const WbsTreeSelect = (props: any) => {
  const { dispatch, onChange, value } = props;
  // 存储 WBS 树形结构数据
  const [wbsItems, setWbsItems] = useState<any[]>([]);
  // 存储加载状态
  const [loading, setLoading] = useState<boolean>(false);
  // 控制 TreeSelect 的值
  const [treeValue, setTreeValue] = useState('');

  useEffect(() => {
    setLoading(true);
    dispatch({
      type: "collectionOfRiskIncidents/queryRiskCategoryConfig",
      payload: {
        filter: JSON.stringify([]),
        order: 'asc',
        sort: 'id',
      },
      callback: (res: { errCode: number; rows: any }) => {
        if (res.errCode === ErrorCode.ErrOk) {
          const flatData = res.rows;
          const tree: any = arrToTree(flatData, 'id', 'parent_id', 'children', null);
          setWbsItems(tree?.map(i => ({ ...i, disabled: true })));
        } else {
          setWbsItems([]);
        }
        setLoading(false);
      },
    });
  }, [])

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
      placeholder="选择风险类别"
      allowClear
      treeDefaultExpandAll
      treeNodeFilterProp="category_name"
      fieldNames={{
        label: 'category_name',
        value: 'id',
      }}
      onChange={onChange}
      treeData={wbsItems}
    />
  )
}

export default connect()(WbsTreeSelect)