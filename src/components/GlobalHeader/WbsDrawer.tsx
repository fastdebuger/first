import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { connect } from 'umi';
import { SwapOutlined } from '@ant-design/icons';
import { Drawer, Tree, Spin, Input } from 'antd'; // 导入 Input 组件
import type { ConnectState } from '@/models/connect';
import { changeWbs, filterTreeData, initDev } from '@/utils/utils';

const { TreeNode } = Tree;
const { Search } = Input;

const WbsDrawer: React.FC<any> = (props) => {
  const { dispatch, wbsTreeList, wbsDrawerVisible,onClose } = props;
  const [loading, setLoading] = useState(false);
  const defaultDepCode = localStorage.getItem('auth-default-wbsCode') || '';

  const [selectedKeys, setSelectedKeys] = useState([defaultDepCode]);
  // 搜索关键词
  const [searchValue, setSearchValue] = useState('');

  const getProject = useCallback(() => {
    // 查询项目部
    dispatch({
      type: 'common/queryWbsByUserCanSwitch',
      payload: {
        sort: 'wbs_code',
        order: 'asc',
      },
      callback() {
        setLoading(false);
      },
    });
  }, [dispatch]);

  useEffect(() => {
    getProject();
  }, [getProject]);

  // 过滤数据
  const filteredData = useMemo(() => {
    return filterTreeData(wbsTreeList, searchValue);
  }, [wbsTreeList, searchValue]);


  const changeDep = (keys: any[], { selectedNodes }: any) => {
    const selectedData = selectedNodes[0];
    if (!selectedData) return;
    if (Number(selectedData?.is_can_switch) === 0) return;
    if (selectedData.wbs_code) {
      setLoading(true);
      setSelectedKeys(keys);
      changeWbs(selectedData)
      // 获取权限装置
      dispatch({
        type: 'common/queryUserAscriptionDev',
        payload: {
          depCode: selectedData.wbs_code,
          currDepCode: selectedData.curr_wbs_code,
        },
        callback: (res: any) => {
          initDev(res)

          dispatch({
            type: 'login/modifyAuthority',
            payload: {
              propKey: selectedData.prop_key,
              replaceUrl: `/workBench`
            }
          })
          setLoading(false);
          onClose();
        },
      });
    }
  };

  /**
   * 关闭
   */
  const handleClose = () => {
    onClose();
    setSearchValue('');
  };

  /**
   * 将左侧树形结构所需的数据遍历展示
   * 函数反复调用，直到下一级没有 children 节点
   * is_can_switch 是否可以切换系统 0-否 1-是
   */
  const loopWbsTree = (arr: any) => {
    return arr.map((item: any) => {
      // 用于高亮显示搜索结果
      const title = item.wbs_name;
      const index = title.toLowerCase().indexOf(searchValue.toLowerCase());
      const beforeStr = title.substring(0, index);
      const afterStr = title.substring(index + searchValue.length);
      const titleElement = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : (
        <span>{title}</span>
      );


      if (item.children && item.children.length > 0) {
        return (
          <TreeNode
            key={item.wbs_code}
            title={() => (
              <div>
                {titleElement}
                {Number(item.is_can_switch) === 1 && (
                  <SwapOutlined style={{ paddingLeft: '5px' }} />
                )}
              </div>
            )}
            {...item}
          >
            {loopWbsTree(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.wbs_code}
          title={() => (
            <div>
              {titleElement}
              {Number(item.is_can_switch) === 1 && <SwapOutlined style={{ paddingLeft: '5px' }} />}
            </div>
          )}
          {...item}
        />
      );
    });
  };

  return (
    <div>
      <Drawer
        title="切换项目部"
        placement="right"
        width={400}
        onClose={handleClose}
        visible={wbsDrawerVisible}
      >
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="请输入项目部名称关键词"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            allowClear
          />
        </div>

        <Spin delay={500} spinning={loading}>
          {filteredData.length > 0 ? (
            <Tree
              defaultExpandAll
              selectedKeys={selectedKeys}
              onSelect={changeDep}
            >
              {loopWbsTree(filteredData)}
            </Tree>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              {loading ? '正在加载...' : '未找到匹配的项目部'}
            </div>
          )}
        </Spin>
      </Drawer>
    </div>
  );
};

export default connect(({ common }: ConnectState) => ({
  wbsTreeList: common.wbsTreeList,
}))(WbsDrawer);
