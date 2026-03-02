import { Select, Pagination } from 'antd';
import { useState, useCallback, useEffect, useRef } from 'react';
import { queryUserInfo } from '@/services/base/user/list';

const VerifyObsCodeSelectList = (props: any) => {
  const { value, onChange } = props;

  // 每页数量
  const pageSize = 50;

  // 状态管理
  const [options, setOptions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [open, setOpen] = useState(false);

  // 防抖定时器
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  /**
   * 加载数据
   */
  const loadData = useCallback(async (keyword: string = '', page: number = 1) => {
    setLoading(true);
    const filter: any[] = [
      {"Key":"other_account","Operator":"=","Val":"01"}
    ];

    // 如果有搜索关键词，添加到过滤条件
    if (keyword) {
      filter.push({
        Key: 'all_user_info',
        Val: keyword,
      });
    }

    const res = await queryUserInfo({
      sort: 'user_code',
      order: 'asc',
      offset: (page - 1) * pageSize + 1,
      limit: pageSize,
      filter: JSON.stringify(filter),
    });

    const rows = res?.rows || [];
    const totalCount = res?.total || 0;

    // 转换为 Select 需要的格式
    const formattedOptions = rows.map((item: any) => ({
      value: item.user_code,
      label: item.all_user_info || item.user_name || item.user_code,
      user_name: item.user_name,
      all_user_info: item.all_user_info,
    }));

    setOptions(formattedOptions);
    setTotal(totalCount);
    setCurrentPage(page);
    setLoading(false);
  }, [pageSize]);

  /**
   * 处理搜索（带防抖）
   */
  const handleSearch = useCallback((keyword: string) => {
    // 清除之前的定时器
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // 设置新的定时器
    debounceTimer.current = setTimeout(() => {
      setSearchKeyword(keyword);
      setCurrentPage(1);
      loadData(keyword, 1);
    }, 300);
  }, [loadData]);

  /**
   * 处理分页变化
   */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    loadData(searchKeyword, page);
  }, [searchKeyword, loadData]);

  /**
   * 下拉框打开时加载第一页数据
   */
  useEffect(() => {
    if (open) {
      // 重置搜索关键词和页码，加载第一页数据
      setSearchKeyword('');
      setCurrentPage(1);
      loadData('', 1);
    }
  }, [open, loadData]);

  /**
   * 组件卸载时清除定时器
   */
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  /**
   * 处理选择变化
   */
  const handleChange = (val: any) => {
    onChange?.(val);
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      placeholder="请选择验证人"
      style={{ width: '100%' }}
      showSearch
      allowClear
      loading={loading}
      filterOption={false} // 禁用默认过滤，使用自定义搜索
      onSearch={handleSearch}
      onDropdownVisibleChange={setOpen}
      options={options}
      dropdownRender={(menu) => (
        <>
          {menu}
          {(total > pageSize || currentPage > 1) && (
            <div style={{
              padding: '8px 0 0',
              display: 'flex',
              justifyContent: 'flex-end',
              borderTop: '1px solid #f0f0f0'
            }}>
              <Pagination
                size="small"
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showTotal={(totalCount) => `共 ${totalCount} 条`}
                showQuickJumper
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    />
  );
};

export default VerifyObsCodeSelectList;
