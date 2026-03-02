import React, { useEffect, useRef } from 'react';
import { DatePicker, Select, Row, Col, Button, Space } from 'antd';
import ObsCodeTreeSelect, { ObsCodeItem } from '@/components/ObsCodeTreeSelect';
import { SearchParams } from './types';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface OptionItem {
  value: string;
  label: string;
}

interface SearchFormProps {
  searchParams: SearchParams;
  obsCodeAllData: ObsCodeItem[];
  wbsOptions: OptionItem[];
  branchCompOptions: OptionItem[];
  projectWbsOptions: OptionItem[];
  onSearchParamsChange: (params: SearchParams) => void;
  onSearch: (customParams?: SearchParams) => void; // 建议让 onSearch 支持传入参数
  onReset: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchParams,
  obsCodeAllData,
  wbsOptions,
  branchCompOptions,
  projectWbsOptions,
  onSearchParamsChange,
  onSearch,
  onReset,
}) => {

  const hasInitialSearched = useRef(false);

  // 1. 处理分公司自动赋值并搜索
  useEffect(() => {
    if (branchCompOptions?.length === 1) {
      const singleValue = branchCompOptions[0].value;
      if (searchParams.branchCompCode !== singleValue) {
        const newParams = { ...searchParams, branchCompCode: singleValue };
        onSearchParamsChange(newParams);
        
        // 如果项目部还没加载或有多条，先按分公司查一次
        if (!hasInitialSearched.current) {
          onSearch(newParams);
        }
      }
    }
  }, [branchCompOptions]);

  // 2. 处理项目部自动赋值并搜索
  useEffect(() => {
    if (projectWbsOptions?.length === 1) {
      const singleValue = projectWbsOptions[0].value;
      if (searchParams.selectWbsCode !== singleValue) {
        const newParams = { ...searchParams, selectWbsCode: singleValue };
        onSearchParamsChange(newParams);
        if (!hasInitialSearched.current) {
          onSearch(newParams);
          hasInitialSearched.current = true;
        }
      }
    }
  }, [projectWbsOptions]);


  const handleTimePeriodChange = (dates: any) => {
    onSearchParamsChange({ ...searchParams, timePeriod: dates });
  };

  const handleBranchCompChange = (value: string) => {
    onSearchParamsChange({
      ...searchParams,
      branchCompCode: value,
      selectWbsCode: undefined,
    });
  };

  const filterOption = (input: string, option: any) => {
    const label = option?.label || option?.children;
    return String(label || '').toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <RangePicker value={searchParams.timePeriod} onChange={handleTimePeriodChange} style={{ width: '100%' }} />
        </Col>
        <Col span={3}>
          <ObsCodeTreeSelect data={obsCodeAllData} value={searchParams.problemSource} onChange={(val) => onSearchParamsChange({ ...searchParams, problemSource: Array.isArray(val) ? val[0] : val })} placeholder="问题来源" style={{ width: '100%' }} showSearch allowClear />
        </Col>
        <Col span={3}>
          <Select placeholder="检查单位" allowClear showSearch value={searchParams.examineUnit} onChange={(v) => onSearchParamsChange({ ...searchParams, examineUnit: v })} style={{ width: '100%' }} filterOption={filterOption}>
            {wbsOptions.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
          </Select>
        </Col>
        <Col span={3}>
          <Select disabled value={searchParams.problemType} style={{ width: '100%' }}><Option value="0">质量</Option></Select>
        </Col>
        <Col span={3}>
          <Select placeholder="问题级别" allowClear value={searchParams.severityLevel} onChange={(v) => onSearchParamsChange({ ...searchParams, severityLevel: v })} style={{ width: '100%' }}>
            <Option value="0">严重问题</Option>
            <Option value="1">较大问题</Option>
            <Option value="2">一般问题</Option>
            <Option value="3">轻微问题</Option>
          </Select>
        </Col>
        <Col span={8}>
          <Space>
            <Button type="primary" onClick={() => onSearch()}>查询</Button>
            <Button onClick={onReset}>重置</Button>
          </Space>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={3}>
          <Select
            placeholder="分公司"
            allowClear={branchCompOptions.length > 1}
            showSearch
            value={searchParams.branchCompCode}
            onChange={handleBranchCompChange}
            style={{ width: '100%' }}
            filterOption={filterOption}
            disabled={branchCompOptions.length === 1}
          >
            {branchCompOptions.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
          </Select>
        </Col>
        <Col span={3}>
          <Select
            placeholder="项目部"
            allowClear={projectWbsOptions.length > 1}
            showSearch
            value={searchParams.selectWbsCode}
            onChange={(v) => onSearchParamsChange({ ...searchParams, selectWbsCode: v })}
            style={{ width: '100%' }}
            filterOption={filterOption}
            disabled={!searchParams.branchCompCode || projectWbsOptions.length === 1}
          >
            {projectWbsOptions.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
          </Select>
        </Col>
      </Row>
    </>
  );
};

export default SearchForm;